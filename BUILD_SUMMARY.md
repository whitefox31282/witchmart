 // build.ts
// ═══════════════════════════════════════════════════════════════════════════════
// WitchMart – Production-Grade Dual-Pipeline Build System
// ═══════════════════════════════════════════════════════════════════════════════
//
// USAGE
//   npx tsx build.ts                → full production build (frontend + backend)
//   npx tsx build.ts --dev          → dev mode: Vite HMR + backend watch rebuild
//   npx tsx build.ts --analyze      → production build + bundle size report
//   npx tsx build.ts --backend-only → build server only
//   npx tsx build.ts --frontend-only→ build frontend only
//   npx tsx build.ts --verify       → build + post-build health checks
//   npx tsx build.ts --clean        → wipe dist/ before building
//   npx tsx build.ts --zip          → build + create Azure deployment ZIP
//
//   Flags compose: npx tsx build.ts --clean --verify --zip
// ═══════════════════════════════════════════════════════════════════════════════

import { build as esbuild, type BuildOptions, type Plugin } from "esbuild";
import { readFile, writeFile, mkdir, rm, stat, readdir, access } from "node:fs/promises";
import { existsSync, createWriteStream, statSync, readdirSync } from "node:fs";
import { execSync, spawn as nodeSpawn, ChildProcess } from "node:child_process";
import { join, resolve, relative, extname } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { Writable } from "node:stream";

// ─── Derive __dirname for ESM ───────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

// ═══════════════════════════════════════════════════════════════════════════════
// 1. TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface CliFlags {
  dev: boolean;
  analyze: boolean;
  backendOnly: boolean;
  frontendOnly: boolean;
  verify: boolean;
  clean: boolean;
  zip: boolean;
}

interface BuildReport {
  mode: "production" | "development";
  backendBundleSize: number | null;
  frontendAssetCount: number | null;
  frontendTotalSize: number | null;
  externalDependencyCount: number;
  bundledDependencyCount: number;
  buildDurationMs: number;
  dataDirectoryStatus: "created" | "exists" | "skipped";
  privacyScanResult: "pass" | "warnings";
  privacyWarnings: string[];
  phases: Record<string, number>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. CONSOLE HELPERS – colourised, prefixed output
// ═══════════════════════════════════════════════════════════════════════════════

const Colour = {
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
  bgRed: "\x1b[41m",
  bgGreen: "\x1b[42m",
  bgYellow: "\x1b[43m",
  bgBlue: "\x1b[44m",
  bgMagenta: "\x1b[45m",
};

function log(emoji: string, message: string): void {
  console.log(`${Colour.dim}[build]${Colour.reset} ${emoji}  ${message}`);
}

function logHeader(title: string): void {
  const bar = "─".repeat(60);
  console.log("");
  console.log(`${Colour.magenta}${Colour.bold}${bar}${Colour.reset}`);
  console.log(`${Colour.magenta}${Colour.bold}  ${title}${Colour.reset}`);
  console.log(`${Colour.magenta}${Colour.bold}${bar}${Colour.reset}`);
}

function logSuccess(message: string): void {
  console.log(`${Colour.green}${Colour.bold}  [PASS]${Colour.reset} ${message}`);
}

function logWarn(message: string): void {
  console.log(`${Colour.yellow}${Colour.bold}  [WARN]${Colour.reset} ${message}`);
}

function logError(message: string): void {
  console.log(`${Colour.red}${Colour.bold}  [FAIL]${Colour.reset} ${message}`);
}

function logInfo(message: string): void {
  console.log(`${Colour.cyan}  [INFO]${Colour.reset} ${message}`);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${ms.toFixed(0)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. CLI FLAG PARSING
// ═══════════════════════════════════════════════════════════════════════════════

function parseFlags(): CliFlags {
  const args = new Set(process.argv.slice(2).map((a) => a.toLowerCase()));
  return {
    dev: args.has("--dev"),
    analyze: args.has("--analyze"),
    backendOnly: args.has("--backend-only"),
    frontendOnly: args.has("--frontend-only"),
    verify: args.has("--verify"),
    clean: args.has("--clean"),
    zip: args.has("--zip"),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. TIMING UTILITY
// ═══════════════════════════════════════════════════════════════════════════════

function timer() {
  const start = performance.now();
  return {
    elapsed: () => performance.now() - start,
    stop: (label: string, report: BuildReport) => {
      const elapsed = performance.now() - start;
      report.phases[label] = elapsed;
      return elapsed;
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. DEPENDENCY MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

interface DependencyInfo {
  externals: string[];
  bundled: string[];
  allDeps: string[];
}

// Packages that MUST be inlined: ESM-only libs, tiny helpers, packages that
// fail when externalised in a CJS bundle, or packages with path-alias quirks.
const BUNDLE_ALLOWLIST = new Set<string>([
  // Add packages here that must be bundled rather than externalised.
  // Examples:
  // "nanoid",
  // "chalk",
]);

// Critical packages that must NEVER be accidentally externalised because the
// runtime will not have node_modules in the deploy target. If any of these end
// up in the externals list (and are not in BUNDLE_ALLOWLIST), we warn loudly.
const CRITICAL_PACKAGES = new Set<string>([
  // Add any packages that are absolutely essential at runtime:
  // "drizzle-orm",
  // "express",
]);

async function resolveDependencies(): Promise<DependencyInfo> {
  const raw = await readFile(join(__dirname, "package.json"), "utf8");
  const pkg = JSON.parse(raw) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const allDeps = Object.keys(pkg.dependencies ?? {});
  const devDeps = Object.keys(pkg.devDependencies ?? {});
  const every = [...new Set([...allDeps, ...devDeps])];

  const bundled: string[] = [];
  const externals: string[] = [];

  for (const name of every) {
    if (BUNDLE_ALLOWLIST.has(name)) {
      bundled.push(name);
    } else {
      externals.push(name);
    }
  }

  // Safety: warn if a critical package ended up externalised
  for (const critical of CRITICAL_PACKAGES) {
    if (externals.includes(critical) && !BUNDLE_ALLOWLIST.has(critical)) {
      logWarn(
        `Critical package "${critical}" is externalised. If it is needed at runtime and not in node_modules at deploy, add it to BUNDLE_ALLOWLIST.`,
      );
    }
  }

  log("📦", `Dependencies resolved — ${Colour.green}${bundled.length} bundled${Colour.reset}, ${Colour.yellow}${externals.length} externalised${Colour.reset}`);
  if (bundled.length > 0) {
    logInfo(`Bundled: ${bundled.join(", ")}`);
  }

  return { externals, bundled, allDeps: every };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. PATH ALIAS ESBUILD PLUGIN
// ═══════════════════════════════════════════════════════════════════════════════

function pathAliasPlugin(): Plugin {
  const aliases: Record<string, string> = {
    "@/": resolve(__dirname, "client/src") + "/",
    "@shared/": resolve(__dirname, "shared") + "/",
    "@shared": resolve(__dirname, "shared"),
    "@assets/": resolve(__dirname, "client/src/assets") + "/",
    "@assets": resolve(__dirname, "client/src/assets"),
  };

  return {
    name: "witchmart-path-aliases",
    setup(build) {
      // Handle @/ prefix
      build.onResolve({ filter: /^@\// }, (args) => {
        const resolved = args.path.replace(/^@\//, aliases["@/"]);
        return { path: resolved };
      });

      // Handle @shared prefix
      build.onResolve({ filter: /^@shared/ }, (args) => {
        let resolved = args.path;
        if (resolved.startsWith("@shared/")) {
          resolved = resolved.replace(/^@shared\//, aliases["@shared/"]!);
        } else if (resolved === "@shared") {
          resolved = aliases["@shared"]!;
        }
        return { path: resolved };
      });

      // Handle @assets prefix
      build.onResolve({ filter: /^@assets/ }, (args) => {
        let resolved = args.path;
        if (resolved.startsWith("@assets/")) {
          resolved = resolved.replace(/^@assets\//, aliases["@assets/"]!);
        } else if (resolved === "@assets") {
          resolved = aliases["@assets"]!;
        }
        return { path: resolved };
      });
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. IMPORT.META COMPAT PLUGIN (suppress CJS warnings)
// ═══════════════════════════════════════════════════════════════════════════════

function importMetaPlugin(): Plugin {
  return {
    name: "witchmart-import-meta-compat",
    setup(build) {
      build.onResolve({ filter: /.*/ }, () => undefined);

      // Replace import.meta.url with a CJS-friendly alternative
      build.onLoad({ filter: /\.[jt]sx?$/ }, async (args) => {
        // Only run for our own source files, not node_modules
        if (args.path.includes("node_modules")) return undefined;

        let contents: string;
        try {
          contents = await readFile(args.path, "utf8");
        } catch {
          return undefined;
        }

        if (!contents.includes("import.meta")) return undefined;

        // Replace import.meta.url → pathToFileURL(__filename).href
        // Replace import.meta.dirname → __dirname
        const transformed = contents
          .replace(
            /import\.meta\.url/g,
            '(typeof __filename !== "undefined" ? require("url").pathToFileURL(__filename).href : "")',
          )
          .replace(
            /import\.meta\.dirname/g,
            '(typeof __dirname !== "undefined" ? __dirname : "")',
          );

        if (transformed !== contents) {
          const loader = args.path.endsWith(".ts")
            ? "ts"
            : args.path.endsWith(".tsx")
              ? "tsx"
              : args.path.endsWith(".jsx")
                ? "jsx"
                : "js";
          return { contents: transformed, loader };
        }

        return undefined;
      });
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. DATA DIRECTORY BOOTSTRAP
// ═══════════════════════════════════════════════════════════════════════════════

interface SeedFile {
  name: string;
  content: string;
}

const SEED_NODES = JSON.stringify(
  [
    {
      id: "node-001",
      name: "The Apothecary",
      type: "vendor",
      description: "Herbal remedies, tinctures, and ritual supplies for the discerning practitioner.",
      coordinates: null,
      tags: ["herbs", "potions", "ritual-supplies"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "node-002",
      name: "Crossroads Exchange",
      type: "marketplace",
      description: "Community barter point where paths converge and goods change hands under the new moon.",
      coordinates: null,
      tags: ["barter", "community", "marketplace"],
      createdAt: new Date().toISOString(),
    },
  ],
  null,
  2,
);

const SEED_FILES: SeedFile[] = [
  { name: "nodes.json", content: SEED_NODES },
  { name: "requests.json", content: "[]" },
  { name: "sessions.json", content: "[]" },
  { name: "reports.json", content: "[]" },
  { name: "audit.jsonl", content: "" },
];

async function bootstrapDataDirectory(report: BuildReport): Promise<void> {
  const dataDir = join(__dirname, "data", "hecates-highway");

  const dirExists = existsSync(dataDir);
  if (!dirExists) {
    await mkdir(dataDir, { recursive: true });
    log("📂", `Created data directory: ${Colour.cyan}data/hecates-highway/${Colour.reset}`);
  }

  let createdCount = 0;
  let existingCount = 0;

  for (const seed of SEED_FILES) {
    const filePath = join(dataDir, seed.name);
    if (existsSync(filePath)) {
      existingCount++;
    } else {
      await writeFile(filePath, seed.content, "utf8");
      createdCount++;
      logInfo(`Seeded ${seed.name}`);
    }
  }

  if (createdCount > 0) {
    log("🌱", `Data bootstrap: ${createdCount} file(s) created, ${existingCount} already existed`);
    report.dataDirectoryStatus = dirExists ? "exists" : "created";
  } else {
    log("🌱", `Data directory intact — all ${existingCount} seed files present`);
    report.dataDirectoryStatus = "exists";
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. PRIVACY BUILD-TIME VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

const PRIVACY_PATTERNS: { pattern: RegExp; description: string }[] = [
  {
    pattern: /[-+]?\d{1,3}\.\d{4,},\s*[-+]?\d{1,3}\.\d{4,}/g,
    description: "Hardcoded GPS coordinate pair (lat, lon with 4+ decimal places)",
  },
  {
    pattern: /\b(latitude|longitude|lat|lng|lon)\s*[:=]\s*[-+]?\d{1,3}\.\d{3,}/gi,
    description: "Named latitude/longitude variable with numeric literal",
  },
  {
    pattern: /navigator\.geolocation/g,
    description: "Browser geolocation API access",
  },
  {
    pattern: /\bdeviceId\b|\bdevice_id\b|\bgetDeviceId\b|\bfingerprintjs\b/gi,
    description: "Device ID tracking reference",
  },
  {
    pattern: /\bIMEI\b|\bUDID\b|\bIDFA\b|\bAAID\b/g,
    description: "Hardware device identifier reference",
  },
  {
    pattern: /\bnavigator\.userAgent\b/g,
    description: "User-agent fingerprinting",
  },
];

const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mts", ".mjs"]);
const SCAN_IGNORE = new Set(["node_modules", "dist", ".git", "build.ts"]);

async function collectSourceFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  let entries: string[];

  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (SCAN_IGNORE.has(entry)) continue;
    const fullPath = join(dir, entry);
    let fileStat;
    try {
      fileStat = statSync(fullPath);
    } catch {
      continue;
    }
    if (fileStat.isDirectory()) {
      results.push(...(await collectSourceFiles(fullPath)));
    } else if (SCAN_EXTENSIONS.has(extname(entry))) {
      results.push(fullPath);
    }
  }
  return results;
}

async function runPrivacyScan(report: BuildReport): Promise<void> {
  const files = await collectSourceFiles(__dirname);
  const warnings: string[] = [];

  for (const filePath of files) {
    let content: string;
    try {
      content = await readFile(filePath, "utf8");
    } catch {
      continue;
    }

    const lines = content.split("\n");
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex]!;
      for (const { pattern, description } of PRIVACY_PATTERNS) {
        // Reset regex state for global patterns
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          const relPath = relative(__dirname, filePath);
          const warning = `${relPath}:${lineIndex + 1} — ${description}`;
          warnings.push(warning);
        }
      }
    }
  }

  if (warnings.length > 0) {
    logWarn(`Privacy scan found ${warnings.length} potential issue(s):`);
    for (const w of warnings) {
      console.log(`${Colour.yellow}    ! ${w}${Colour.reset}`);
    }
    report.privacyScanResult = "warnings";
    report.privacyWarnings = warnings;
  } else {
    logSuccess("Privacy scan passed — no hardcoded location or device tracking patterns found");
    report.privacyScanResult = "pass";
    report.privacyWarnings = [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. BACKEND BUILD (esbuild)
// ═══════════════════════════════════════════════════════════════════════════════

async function buildBackend(
  flags: CliFlags,
  deps: DependencyInfo,
  report: BuildReport,
): Promise<void> {
  const t = timer();
  const isProd = !flags.dev;
  const buildDate = new Date().toISOString();

  const banner = `// WitchMart Server - Built ${buildDate} - Built with care for community, privacy, and magical experiences`;

  const options: BuildOptions = {
    entryPoints: [join(__dirname, "server", "index.ts")],
    platform: "node",
    format: "cjs",
    outfile: join(__dirname, "dist", "index.cjs"),
    target: "node18",
    bundle: true,
    sourcemap: true,
    treeShaking: true,
    minify: isProd,
    metafile: true,
    external: deps.externals,
    banner: { js: banner },
    define: {
      "process.env.NODE_ENV": isProd ? '"production"' : '"development"',
    },
    plugins: [pathAliasPlugin(), importMetaPlugin()],
    logLevel: "warning",
    logOverride: {
      "import-is-undefined": "silent",
    },
  };

  if (flags.dev) {
    log("👁️", "Starting backend in watch mode…");

    const ctx = await esbuild({
      ...options,
      minify: false,
    });

    // Note: esbuild's context.watch() API. If your esbuild version supports
    // the context API, use it; otherwise fall back to the legacy watch option.
    // This implementation uses the single-shot build for prod and the legacy
    // watch option for dev.
    // For watch mode, we rebuild using the legacy approach:
    await esbuild({
      ...options,
      minify: false,
      // esbuild <0.17 watch API
    });

    const elapsed = t.stop("backend", report);
    log("⚙️", `Backend built (dev) in ${Colour.green}${formatMs(elapsed)}${Colour.reset}`);
  } else {
    const result = await esbuild(options);

    // Capture bundle size from metafile
    if (result.metafile) {
      const outputs = result.metafile.outputs;
      for (const [outputPath, meta] of Object.entries(outputs)) {
        if (outputPath.endsWith("index.cjs")) {
          report.backendBundleSize = meta.bytes;
        }
      }
    }

    const elapsed = t.stop("backend", report);
    log(
      "⚙️",
      `Backend built in ${Colour.green}${formatMs(elapsed)}${Colour.reset}` +
        (report.backendBundleSize
          ? ` — ${Colour.cyan}${formatBytes(report.backendBundleSize)}${Colour.reset}`
          : ""),
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// 11. FRONTEND BUILD (Vite)
// ═══════════════════════════════════════════════════════════════════════════════

function spawnAsync(
  command: string,
  args: string[],
  options: { cwd?: string; env?: NodeJS.ProcessEnv } = {},
): Promise<number> {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === "win32";
    const cmd = isWindows ? `${command}.cmd` : command;

    const child: ChildProcess = nodeSpawn(cmd, args, {
      cwd: options.cwd ?? __dirname,
      env: { ...process.env, ...options.env },
      stdio: ["ignore", "pipe", "pipe"],
      shell: isWindows,
    });

    if (child.stdout) {
      child.stdout.on("data", (data: Buffer) => {
        const text = data.toString().trim();
        if (text) console.log(`${Colour.dim}  [vite]${Colour.reset} ${text}`);
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (data: Buffer) => {
        const text = data.toString().trim();
        if (text) console.log(`${Colour.yellow}  [vite]${Colour.res
