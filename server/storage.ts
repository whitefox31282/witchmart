Below are two ready-to-commit files.

1. src/db/pool.ts

import pg from "pg";
const { Pool } = pg;

/**
 Singleton Postgres connection pool.
 Gracefully drains on SIGTERM so Azure/K-8s can shut the pod down cleanly.
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                 // tune for your DB plan
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

process.on("SIGTERM", async () => {
  await pool.end();
  process.exit(0);
});

2. src/db/storage.ts

import { drizzle } from "drizzle-orm/node-postgres";
import { eq, ilike, or, sql } from "drizzle-orm";
import { pool } from "./pool";
import createHttpError from "http-errors";
import { logger } from "@/core/logger";               // (rows: T[]): T | undefined {
  return rows[0];
}

function guard(p: Promise): Promise {
  return p.catch((err) => {
    logger.error(err, "DB_ERROR");
    throw createHttpError(500, "Database failure");
  });
}

interface PageOpts {
  limit?: number;
  offset?: number;
}

/* Immutable keys must never be patched */
type MutableSanctuaryNode = Omit;
type MutableMaker         = Omit;
type MutableProduct       = Omit;
type MutableBlogPost      = Omit;
type MutableCodexEvent    = Omit;
type MutableCodexDocument = Omit;
type MutableCodexProject  = Omit;

/* ──────────────────────────────
   Storage Class
──────────────────────────────── */

export interface IStorage {
  /* Sanctuary Nodes */
  getAllNodes(opts?: PageOpts): Promise;
  getNodeById(id: number): Promise;
  searchNodes(q: string, opts?: PageOpts): Promise;
  createNode(n: InsertSanctuaryNode): Promise;
  updateNode(id: number, p: MutableSanctuaryNode): Promise;
  deleteNode(id: number): Promise;

  /* Makers */
  getAllMakers(opts?: PageOpts): Promise;
  getMakerById(id: number): Promise;
  searchMakers(q: string, opts?: PageOpts): Promise;
  createMaker(m: InsertMaker): Promise;
  updateMaker(id: number, p: MutableMaker): Promise;
  deleteMaker(id: number): Promise;

  /* Products & Services */
  getAllProducts(opts?: PageOpts): Promise;
  getProductById(id: number): Promise;
  searchProducts(q: string, opts?: PageOpts): Promise;
  createProduct(p: InsertProductService): Promise;
  updateProduct(id: number, p: MutableProduct): Promise;
  deleteProduct(id: number): Promise;

  /* Member Sign-ups */
  createMemberSignup(s: InsertMemberSignup): Promise;
  getAllSignups(opts?: PageOpts): Promise;

  /* Contact Submissions */
  createContactSubmission(c: InsertContactSubmission): Promise;
  getAllContactSubmissions(opts?: PageOpts): Promise;

  /* Blog */
  getAllBlogPosts(opts?: PageOpts): Promise;
  getPublishedBlogPosts(opts?: PageOpts): Promise;
  getBlogPostById(id: number): Promise;
  createBlogPost(p: InsertBlogPost): Promise;
  updateBlogPost(id: number, p: MutableBlogPost): Promise;
  deleteBlogPost(id: number): Promise;

  /* Codex Events */
  getAllCodexEvents(opts?: PageOpts): Promise;
  getCodexEventById(id: number): Promise;
  createCodexEvent(e: InsertCodexEvent): Promise;
  updateCodexEvent(id: number, p: MutableCodexEvent): Promise;
  deleteCodexEvent(id: number): Promise;

  /* Codex Documents */
  getAllCodexDocuments(opts?: PageOpts): Promise;
  getCodexDocumentById(id: number): Promise;
  createCodexDocument(d: InsertCodexDocument): Promise;
  updateCodexDocument(id: number, p: MutableCodexDocument): Promise;
  deleteCodexDocument(id: number): Promise;

  /* Codex Projects */
  getAllCodexProjects(opts?: PageOpts): Promise;
  getCodexProjectById(id: number): Promise;
  createCodexProject(p: InsertCodexProject): Promise;
  updateCodexProject(id: number, p: MutableCodexProject): Promise;
  deleteCodexProject(id: number): Promise;

  /* Councils & Preferences */
  getAllCouncilPersonas(opts?: PageOpts): Promise;
  getCouncilPersonaByName(name: string): Promise;
  createCouncilPersona(p: InsertCouncilPersona): Promise;
  getModePreference(userId: string): Promise;
  setModePreference(p: InsertModePreference): Promise;

  /* Security */
  getAllSecurityEvents(opts?: PageOpts): Promise;
  getRecentSecurityEvents(limit: number): Promise;
  createSecurityEvent(e: InsertSecurityEvent): Promise;
  getAllGuardianPolicies(): Promise;
  getActiveGuardianPolicies(): Promise;
}

export class PostgresStorage implements IStorage {
  private db = drizzle(pool);

  /* ───────── Sanctuary Nodes ───────── */

  getAllNodes({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(sanctuaryNodes)
        .orderBy(sanctuaryNodes.name)
        .limit(limit)
        .offset(offset),
    );
  }

  getNodeById(id: number) {
    return guard(
      this.db.select().from(sanctuaryNodes)
        .where(eq(sanctuaryNodes.id, id))
        .then(first),
    );
  }

  searchNodes(q: string, { limit = 50, offset = 0 }: PageOpts = {}) {
    const pattern = %${q}%;
    return guard(
      this.db.select().from(sanctuaryNodes)
        .where(
          or(
            ilike(sanctuaryNodes.name, pattern),
            ilike(sanctuaryNodes.region, pattern),
            ilike(sanctuaryNodes.city, pattern),
            sql${sanctuaryNodes.specialties}::text ILIKE ${pattern},
          ),
        )
        .orderBy(sanctuaryNodes.name)
        .limit(limit)
        .offset(offset),
    );
  }

  async createNode(node: InsertSanctuaryNode) {
    /* defense-in-depth: reject latent coordinate payloads */
    if (JSON.stringify(node).match(/latitude|longitude|gps/i)) {
      throw createHttpError(422, "Coordinates not allowed");
    }
    return guard(
      this.db.insert(sanctuaryNodes).values(node).returning().then(first),
    );
  }

  updateNode(id: number, patch: MutableSanctuaryNode) {
    return guard(
      this.db.update(sanctuaryNodes)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(sanctuaryNodes.id, id))
        .returning()
        .then(first),
    );
  }

  deleteNode(id: number) {
    return guard(
      this.db.delete(sanctuaryNodes).where(eq(sanctuaryNodes.id, id))
        .returning()
        .then((r) => r.length > 0),
    );
  }

  /* ───────── Makers ───────── */

  getAllMakers({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(makers)
        .orderBy(makers.name)
        .limit(limit)
        .offset(offset),
    );
  }

  getMakerById(id: number) {
    return guard(
      this.db.select().from(makers)
        .where(eq(makers.id, id))
        .then(first),
    );
  }

  searchMakers(q: string, { limit = 50, offset = 0 }: PageOpts = {}) {
    const pattern = %${q}%;
    return guard(
      this.db.select().from(makers)
        .where(
          or(
            ilike(makers.name, pattern),
            ilike(makers.category, pattern),
            ilike(makers.location, pattern),
            ilike(makers.tagline, pattern),
          ),
        )
        .orderBy(makers.name)
        .limit(limit)
        .offset(offset),
    );
  }

  createMaker(maker: InsertMaker) {
    return guard(
      this.db.insert(makers).values(maker).returning().then(first),
    );
  }

  updateMaker(id: number, patch: MutableMaker) {
    return guard(
      this.db.update(makers).set({ ...patch, updatedAt: new Date() })
        .where(eq(makers.id, id))
        .returning()
        .then(first),
    );
  }

  deleteMaker(id: number) {
    return guard(
      this.db.delete(makers).where(eq(makers.id, id))
        .returning()
        .then((r) => r.length > 0),
    );
  }

  /* ───────── Products & Services ───────── */

  getAllProducts({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(productsServices)
        .orderBy(productsServices.title)
        .limit(limit)
        .offset(offset),
    );
  }

  getProductById(id: number) {
    return guard(
      this.db.select().from(productsServices)
        .where(eq(productsServices.id, id))
        .then(first),
    );
  }

  searchProducts(q: string, { limit = 50, offset = 0 }: PageOpts = {}) {
    const pattern = %${q}%;
    return guard(
      this.db.select().from(productsServices)
        .where(
          or(
            ilike(productsServices.title, pattern),
            ilike(productsServices.category, pattern),
            ilike(productsServices.type, pattern),
            ilike(productsServices.mode, pattern),
          ),
        )
        .orderBy(productsServices.title)
        .limit(limit)
        .offset(offset),
    );
  }

  createProduct(p: InsertProductService) {
    return guard(
      this.db.insert(productsServices).values(p).returning().then(first),
    );
  }

  updateProduct(id: number, patch: MutableProduct) {
    return guard(
      this.db.update(productsServices)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(productsServices.id, id))
        .returning()
        .then(first),
    );
  }

  deleteProduct(id: number) {
    return guard(
      this.db.delete(productsServices).where(eq(productsServices.id, id))
        .returning()
        .then((r) => r.length > 0),
    );
  }

  /* ───────── Member Signups ───────── */

  createMemberSignup(s: InsertMemberSignup) {
    return guard(
      this.db.insert(memberSignups).values(s).returning().then(first),
    );
  }

  getAllSignups({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(memberSignups)
        .orderBy(sql${memberSignups.createdAt} DESC)
        .limit(limit)
        .offset(offset),
    );
  }

  /* ───────── Contact Submissions ───────── */

  createContactSubmission(c: InsertContactSubmission) {
    return guard(
      this.db.insert(contactSubmissions).values(c).returning().then(first),
    );
  }

  getAllContactSubmissions({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(contactSubmissions)
        .orderBy(sql${contactSubmissions.createdAt} DESC)
        .limit(limit)
        .offset(offset),
    );
  }

  /* ───────── Blog Posts ───────── */

  getAllBlogPosts({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(blogPosts)
        .orderBy(sql${blogPosts.date} DESC)
        .limit(limit)
        .offset(offset),
    );
  }

  getPublishedBlogPosts(opts?: PageOpts) {
    return guard(
      this.db.select().from(blogPosts)
        .where(eq(blogPosts.published, true))
        .orderBy(sql${blogPosts.date} DESC)
        .limit(opts?.limit ?? 50)
        .offset(opts?.offset ?? 0),
    );
  }

  getBlogPostById(id: number) {
    return guard(
      this.db.select().from(blogPosts)
        .where(eq(blogPosts.id, id))
        .then(first),
    );
  }

  createBlogPost(p: InsertBlogPost) {
    return guard(
      this.db.insert(blogPosts).values(p).returning().then(first),
    );
  }

  updateBlogPost(id: number, patch: MutableBlogPost) {
    return guard(
      this.db.update(blogPosts)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(blogPosts.id, id))
        .returning()
        .then(first),
    );
  }

  deleteBlogPost(id: number) {
    return guard(
      this.db.delete(blogPosts).where(eq(blogPosts.id, id))
        .returning()
        .then((r) => r.length > 0),
    );
  }

  /* ───────── Codex Events ───────── */

  getAllCodexEvents({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(codexEvents)
        .orderBy(sql${codexEvents.timestamp} DESC)
        .limit(limit)
        .offset(offset),
    );
  }

  getCodexEventById(id: number) {
    return guard(
      this.db.select().from(codexEvents)
        .where(eq(codexEvents.id, id))
        .then(first),
    );
  }

  createCodexEvent(e: InsertCodexEvent) {
    return guard(
      this.db.insert(codexEvents).values(e).returning().then(first),
    );
  }

  updateCodexEvent(id: number, patch: MutableCodexEvent) {
    return guard(
      this.db.update(codexEvents)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(codexEvents.id, id))
        .returning()
        .then(first),
    );
  }

  deleteCodexEvent(id: number) {
    return guard(
      this.db.delete(codexEvents).where(eq(codexEvents.id, id))
        .returning()
        .then((r) => r.length > 0),
    );
  }

  /* ───────── Codex Documents ───────── */

  getAllCodexDocuments({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(codexDocuments)
        .orderBy(sql${codexDocuments.createdAt} DESC)
        .limit(limit)
        .offset(offset),
    );
  }

  getCodexDocumentById(id: number) {
    return guard(
      this.db.select().from(codexDocuments)
        .where(eq(codexDocuments.id, id))
        .then(first),
    );
  }

  createCodexDocument(d: InsertCodexDocument) {
    return guard(
      this.db.insert(codexDocuments).values(d).returning().then(first),
    );
  }

  updateCodexDocument(id: number, patch: MutableCodexDocument) {
    return guard(
      this.db.update(codexDocuments)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(codexDocuments.id, id))
        .returning()
        .then(first),
    );
  }

  deleteCodexDocument(id: number) {
    return guard(
      this.db.delete(codexDocuments).where(eq(codexDocuments.id, id))
        .returning()
        .then((r) => r.length > 0),
    );
  }

  /* ───────── Codex Projects ───────── */

  getAllCodexProjects({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(codexProjects)
        .orderBy(codexProjects.name)
        .limit(limit)
        .offset(offset),
    );
  }

  getCodexProjectById(id: number) {
    return guard(
      this.db.select().from(codexProjects)
        .where(eq(codexProjects.id, id))
        .then(first),
    );
  }

  createCodexProject(p: InsertCodexProject) {
    return guard(
      this.db.insert(codexProjects).values(p).returning().then(first),
    );
  }

  updateCodexProject(id: number, patch: MutableCodexProject) {
    return guard(
      this.db.update(codexProjects)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(codexProjects.id, id))
        .returning()
        .then(first),
    );
  }

  deleteCodexProject(id: number) {
    return guard(
      this.db.delete(codexProjects).where(eq(codexProjects.id, id))
        .returning()
        .then((r) => r.length > 0),
    );
  }

  /* ───────── Council Personas & Mode Prefs ───────── */

  getAllCouncilPersonas({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(councilPersonas)
        .orderBy(councilPersonas.name)
        .limit(limit)
        .offset(offset),
    );
  }

  getCouncilPersonaByName(name: string) {
    return guard(
      this.db.select().from(councilPersonas)
        .where(eq(councilPersonas.name, name))
        .then(first),
    );
  }

  createCouncilPersona(p: InsertCouncilPersona) {
    return guard(
      this.db.insert(councilPersonas).values(p).returning().then(first),
    );
  }

  getModePreference(userId: string) {
    return guard(
      this.db.select().from(modePreferences)
        .where(eq(modePreferences.userId, userId))
        .then(first),
    );
  }

  async setModePreference(pref: InsertModePreference) {
    const existing = await this.getModePreference(pref.userId);
    return existing
      ? guard(
          this.db.update(modePreferences)
            .set({ ...pref, updatedAt: new Date() })
            .where(eq(modePreferences.userId, pref.userId))
            .returning()
            .then(first),
        )
      : guard(
          this.db.insert(modePreferences).values(pref).returning().then(first),
        );
  }

  /* ───────── Security ───────── */

  getAllSecurityEvents({ limit = 50, offset = 0 }: PageOpts = {}) {
    return guard(
      this.db.select().from(securityEvents)
        .orderBy(sql${securityEvents.createdAt} DESC)
        .limit(limit)
        .offset(offset),
    );
  }

  getRecentSecurityEvents(limit = 10) {
    return guard(
      this.db.select().from(securityEvents)
        .orderBy(sql${securityEvents.createdAt} DESC)
        .limit(limit),
    );
  }

  createSecurityEvent(e: InsertSecurityEvent) {
    return guard(
      this.db.insert(securityEvents).values(e).returning().then(first),
    );
  }

  getAllGuardianPolicies() {
    return guard(
      this.db.select().from(guardianPolicies)
        .orderBy(guardianPolicies.policyId),
    );
  }

  getActiveGuardianPolicies() {
    return guard(
      this.db.select().from(guardianPolicies)
        .where(eq(guardianPolicies.active, true))
        .orderBy(guardianPolicies.policyId),
    );
  }
}

/* Export singleton */
export const storage: IStorage = new PostgresStorage();

How to deploy:

Replace logger import with your preferred logger (pino, winston, etc.).
Run npm run lint && npm run check to ensure typings align with your project.
Commit both files and push—no other code paths need changing (constructor signature and exports match the original).