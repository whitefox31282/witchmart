/**
 * ============================================================================
 * build.ts — Production-Grade Server Build Script
 * ============================================================================
 *
 * A comprehensive esbuild-based build pipeline for Node.js servers targeting
 * serverless or containerized environments. Designed to minimize cold-start
 * latency through intelligent dependency bundling decisions.
 *
 * Usage:
 *   npx tsx build.ts                  # Production build
 *   npx tsx build.ts --dev            # Development build (no minify, inline sourcemaps)
 *   npx tsx build.ts --analyze        # Build + detailed bundle analysis
 *   npx tsx build.ts --dry-run        # Preview bundle/external decisions without building
 *   npx tsx build.ts --clean          # Remove dist/ before building
 *   npx tsx build.ts --clean --analyze --dev   # Flags compose freely
 *
 * Requirements:
 *   - Node.js >= 20
 *   - esbuild (devDependency)
 *   - tsx or ts-node to execute directly
 *
 * @module build
 * @version 2.0.0
 * @license MIT
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";
import * as esbuild from "esbuild";

// ============================================================================
// SECTION 1: Constants & Configuration
// ============================================================================

/** Entry point for the server application */
const ENTRY_POINT = "src/index.ts";

/** Output file path — .mjs extension signals ESM to Node.js */
const OUTPUT_FILE = "dist/server.mjs";

/** Output directory */
const DIST_DIR = "dist";

/** Node.js target version */
const NODE_TARGET = "node20";

/**
 * Size threshold in bytes. Dependencies larger than this are externalized
 * by default to avoid bundle bloat and slow cold starts.
 * 500 KB = 512,000 bytes.
 */
const SIZE_THRESHOLD_BYTES = 512_000;

/**
 * FORCE_BUNDLE — Dependencies that MUST always be bundled regardless of size.
 * Typically small, critical runtime deps that you don't want to resolve from
 * node_modules at startup (avoids filesystem reads on cold start).
 */
const FORCE_BUNDLE: ReadonlySet<string> = new Set([
  "dotenv",
  "ms",
  "debug",
  "uuid",
  "nanoid",
  "zod",
  "superjson",
  "mime-types",
  "content-type",
  "cookie",
  "escape-html",
  "vary",
  "on-finished",
  "depd",
  "statuses",
]);

/**
 * FORCE_EXTERNAL — Dependencies that must NEVER be bundled. Large SDKs,
 * native addons, or packages with dynamic require() patterns that break
 * when bundled.
 */
const FORCE_EXTERNAL: ReadonlySet<string> = new Set([
  "@google/generative-ai",
  "@google-cloud/vertexai",
  "openai",
  "xlsx",
  "sharp",
  "@prisma/client",
  "prisma",
  "puppeteer",
  "playwright",
  "canvas",
  "bcrypt",
  "better-sqlite3",
  "pg-native",
  "cpu-features",
  "esbuild",
  "lightningcss",
  "vite",
  "rollup",
  "webpack",
  "typescript",
]);

/**
 * Warning threshold: any single module larger than this inside the final
 * bundle triggers a warning during analysis.
 */
const MODULE_WARNING_THRESHOLD_BYTES = 1_048_576; // 1 MB

/** Number of top modules to display in bundle analysis */
const TOP_MODULES_COUNT = 15;

// ============================================================================
// SECTION 2: CLI Flag Parsing
// ============================================================================

/**
 * Parsed CLI flags controlling build behavior.
 *
 * @property dev       - Development mode: disables minification, uses inline sourcemaps
 * @property analyze   - Print detailed bundle analysis after build
 * @property dryRun    - Preview bundling decisions without actually building
 * @property clean     - Remove dist/ directory before building
 */
interface BuildFlags {
  dev: boolean;
  analyze: boolean;
  dryRun: boolean;
  clean: boolean;
}

/**
 * Parse process.argv into structured build flags.
 * Unrecognized flags are silently ignored.
 */
function parseFlags(): BuildFlags {
  const args = new Set(process.argv.slice(2).map((a) => a.toLowerCase()));
  return {
    dev: args.has("--dev"),
    analyze: args.has("--analyze"),
    dryRun: args.has("--dry-run"),
    clean: args.has("--clean"),
  };
}

// ============================================================================
// SECTION 3: Colored Console Helpers
// ============================================================================

const Color = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
} as const;

function log(message: string): void {
  console.log(`${Color.cyan}[build]${Color.reset} ${message}`);
}

function logSuccess(message: string): void {
  console.log(
    `${Color.green}${Color.bold}  ✓${Color.reset} ${Color.green}${message}${Color.reset}`
  );
}

function logWarn(message: string): void {
  console.warn(
    `${Color.yellow}${Color.bold}  ⚠${Color.reset} ${Color.yellow}${message}${Color.reset}`
  );
}

function logError(message: string): void {
  console.error(
    `${Color.red}${Color.bold}  ✗${Color.reset} ${Color.red}${message}${Color.reset}`
  );
}

function logInfo(message: string): void {
  console.log(`${Color.gray}    ${message}${Color.reset}`);
}

function logHeader(message: string): void {
  const line = "─".repeat(60);
  console.log(`\n${Color.blue}${line}${Color.reset}`);
  console.log(`${Color.blue}${Color.bold}  ${message}${Color.reset}`);
  console.log(`${Color.blue}${line}${Color.reset}\n`);
}

/**
 * Formats bytes into a human-readable string (e.g., "1.23 MB").
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value.toFixed(exponent === 0 ? 0 : 2)} ${units[exponent]}`;
}

// ============================================================================
// SECTION 4: Package.json & Dependency Introspection
// ============================================================================

/** Structure we care about from the root package.json */
interface PackageJson {
  name?: string;
  version?: string;
  type?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

/**
 * Read and parse the project's package.json.
 * Throws with a clear message if not found.
 */
function readPackageJson(): PackageJson {
  const packagePath = path.resolve("package.json");
  if (!fs.existsSync(packagePath)) {
    throw new Error(
      `Cannot find package.json at ${packagePath}. Run this script from the project root.`
    );
  }
  return JSON.parse(fs.readFileSync(packagePath, "utf-8"));
}

/**
 * Metadata collected for each dependency to drive bundling decisions.
 */
interface DependencyInfo {
  /** npm package name */
  name: string;
  /** Installed version from its own package.json, or "unknown" */
  version: string;
  /** Estimated total size on disk in bytes */
  sizeBytes: number;
  /** Module type: 'esm' | 'cjs' | 'unknown' */
  moduleType: "esm" | "cjs" | "unknown";
  /** Whether the package contains a native addon (binding.gyp, .node files) */
  hasNativeAddon: boolean;
  /** Resolved path inside node_modules */
  resolvedPath: string | null;
}

/**
 * Recursively calculate the total size of a directory in bytes.
 * Returns 0 if the path does not exist or is inaccessible.
 */
function getDirectorySize(dirPath: string): number {
  if (!fs.existsSync(dirPath)) return 0;

  let totalSize = 0;

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      try {
        if (entry.isDirectory()) {
          // Skip nested node_modules to avoid double-counting hoisted deps
          if (entry.name === "node_modules") continue;
          totalSize += getDirectorySize(fullPath);
        } else if (entry.isFile()) {
          totalSize += fs.statSync(fullPath).size;
        }
      } catch {
        // Permission error or symlink race — skip silently
      }
    }
  } catch {
    return 0;
  }

  return totalSize;
}

/**
 * Resolve the installed location of a dependency. Handles scoped packages
 * (e.g., @google/generative-ai) and hoisted layouts.
 */
function resolveDependencyPath(depName: string): string | null {
  const candidate = path.resolve("node_modules", depName);
  if (fs.existsSync(candidate)) return candidate;

  // In monorepos, deps may be hoisted higher. Try require.resolve as fallback.
  try {
    const resolved = require.resolve(`${depName}/package.json`, {
      paths: [process.cwd()],
    });
    return path.dirname(resolved);
  } catch {
    return null;
  }
}

/**
 * Detect the module type of an installed dependency by reading its package.json.
 * Returns 'esm' if `"type": "module"`, 'cjs' otherwise, 'unknown' if unreadable.
 */
function detectModuleType(depPath: string): "esm" | "cjs" | "unknown" {
  const pkgPath = path.join(depPath, "package.json");
  if (!fs.existsSync(pkgPath)) return "unknown";

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    if (pkg.type === "module") return "esm";
    // If main field ends with .mjs, treat as ESM-capable
    if (
      typeof pkg.main === "string" &&
      pkg.main.endsWith
