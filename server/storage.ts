import { drizzle } from "drizzle-orm/node-postgres";
import { eq, ilike, or, sql } from "drizzle-orm";
import pg from "pg";
import {
  sanctuaryNodes,
  makers,
  productsServices,
  memberSignups,
  contactSubmissions,
  blogPosts,
  codexEvents,
  codexDocuments,
  codexProjects,
  councilPersonas,
  modePreferences,
  securityEvents,
  guardianPolicies,
  type SanctuaryNode,
  type InsertSanctuaryNode,
  type Maker,
  type InsertMaker,
  type ProductService,
  type InsertProductService,
  type MemberSignup,
  type InsertMemberSignup,
  type ContactSubmission,
  type InsertContactSubmission,
  type BlogPost,
  type InsertBlogPost,
  type CodexEvent,
  type InsertCodexEvent,
  type CodexDocument,
  type InsertCodexDocument,
  type CodexProject,
  type InsertCodexProject,
  type CouncilPersona,
  type InsertCouncilPersona,
  type ModePreference,
  type InsertModePreference,
  type SecurityEvent,
  type InsertSecurityEvent,
  type GuardianPolicy,
  type InsertGuardianPolicy,
} from "@shared/schema";

const { Pool } = pg;

export interface IStorage {
  // Sanctuary Nodes
  getAllNodes(): Promise<SanctuaryNode[]>;
  getNodeById(id: number): Promise<SanctuaryNode | undefined>;
  searchNodes(query: string): Promise<SanctuaryNode[]>;
  createNode(node: InsertSanctuaryNode): Promise<SanctuaryNode>;
  updateNode(id: number, node: Partial<InsertSanctuaryNode>): Promise<SanctuaryNode | undefined>;
  deleteNode(id: number): Promise<boolean>;

  // Makers & Guilds
  getAllMakers(): Promise<Maker[]>;
  getMakerById(id: number): Promise<Maker | undefined>;
  searchMakers(query: string): Promise<Maker[]>;
  createMaker(maker: InsertMaker): Promise<Maker>;
  updateMaker(id: number, maker: Partial<InsertMaker>): Promise<Maker | undefined>;
  deleteMaker(id: number): Promise<boolean>;

  // Products & Services
  getAllProducts(): Promise<ProductService[]>;
  getProductById(id: number): Promise<ProductService | undefined>;
  searchProducts(query: string): Promise<ProductService[]>;
  createProduct(product: InsertProductService): Promise<ProductService>;
  updateProduct(id: number, product: Partial<InsertProductService>): Promise<ProductService | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Member Signups
  createMemberSignup(signup: InsertMemberSignup): Promise<MemberSignup>;
  getAllSignups(): Promise<MemberSignup[]>;

  // Contact Submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;

  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // SetAI Codex - Events
  getAllCodexEvents(): Promise<CodexEvent[]>;
  getCodexEventById(id: number): Promise<CodexEvent | undefined>;
  createCodexEvent(event: InsertCodexEvent): Promise<CodexEvent>;
  updateCodexEvent(id: number, event: Partial<InsertCodexEvent>): Promise<CodexEvent | undefined>;
  deleteCodexEvent(id: number): Promise<boolean>;

  // SetAI Codex - Documents
  getAllCodexDocuments(): Promise<CodexDocument[]>;
  getCodexDocumentById(id: number): Promise<CodexDocument | undefined>;
  createCodexDocument(doc: InsertCodexDocument): Promise<CodexDocument>;
  updateCodexDocument(id: number, doc: Partial<InsertCodexDocument>): Promise<CodexDocument | undefined>;
  deleteCodexDocument(id: number): Promise<boolean>;

  // SetAI Codex - Projects
  getAllCodexProjects(): Promise<CodexProject[]>;
  getCodexProjectById(id: number): Promise<CodexProject | undefined>;
  createCodexProject(project: InsertCodexProject): Promise<CodexProject>;
  updateCodexProject(id: number, project: Partial<InsertCodexProject>): Promise<CodexProject | undefined>;
  deleteCodexProject(id: number): Promise<boolean>;

  // SetAI Councils
  getAllCouncilPersonas(): Promise<CouncilPersona[]>;
  getCouncilPersonaByName(name: string): Promise<CouncilPersona | undefined>;
  createCouncilPersona(persona: InsertCouncilPersona): Promise<CouncilPersona>;
  getModePreference(userId: string): Promise<ModePreference | undefined>;
  setModePreference(pref: InsertModePreference): Promise<ModePreference>;

  // SetAI Security
  getAllSecurityEvents(): Promise<SecurityEvent[]>;
  getRecentSecurityEvents(limit: number): Promise<SecurityEvent[]>;
  createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent>;
  getAllGuardianPolicies(): Promise<GuardianPolicy[]>;
  getActiveGuardianPolicies(): Promise<GuardianPolicy[]>;
}

class PostgresStorage implements IStorage {
  private db;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    this.db = drizzle(pool);
  }

  // Sanctuary Nodes
  async getAllNodes(): Promise<SanctuaryNode[]> {
    return await this.db.select().from(sanctuaryNodes).orderBy(sanctuaryNodes.name);
  }

  async getNodeById(id: number): Promise<SanctuaryNode | undefined> {
    const result = await this.db.select().from(sanctuaryNodes).where(eq(sanctuaryNodes.id, id));
    return result[0];
  }

  async searchNodes(query: string): Promise<SanctuaryNode[]> {
    const searchPattern = `%${query}%`;
    return await this.db
      .select()
      .from(sanctuaryNodes)
      .where(
        or(
          ilike(sanctuaryNodes.name, searchPattern),
          ilike(sanctuaryNodes.region, searchPattern),
          ilike(sanctuaryNodes.city, searchPattern),
          sql`${sanctuaryNodes.specialties}::text ILIKE ${searchPattern}`,
        ),
      )
      .orderBy(sanctuaryNodes.name);
  }

  async createNode(node: InsertSanctuaryNode): Promise<SanctuaryNode> {
    const result = await this.db.insert(sanctuaryNodes).values(node).returning();
    return result[0];
  }

  async updateNode(id: number, node: Partial<InsertSanctuaryNode>): Promise<SanctuaryNode | undefined> {
    const result = await this.db.update(sanctuaryNodes).set(node).where(eq(sanctuaryNodes.id, id)).returning();
    return result[0];
  }

  async deleteNode(id: number): Promise<boolean> {
    const result = await this.db.delete(sanctuaryNodes).where(eq(sanctuaryNodes.id, id)).returning();
    return result.length > 0;
  }

  // Makers & Guilds
  async getAllMakers(): Promise<Maker[]> {
    return await this.db.select().from(makers).orderBy(makers.name);
  }

  async getMakerById(id: number): Promise<Maker | undefined> {
    const result = await this.db.select().from(makers).where(eq(makers.id, id));
    return result[0];
  }

  async searchMakers(query: string): Promise<Maker[]> {
    const searchPattern = `%${query}%`;
    return await this.db
      .select()
      .from(makers)
      .where(
        or(
          ilike(makers.name, searchPattern),
          ilike(makers.category, searchPattern),
          ilike(makers.location, searchPattern),
          ilike(makers.tagline, searchPattern),
        ),
      )
      .orderBy(makers.name);
  }

  async createMaker(maker: InsertMaker): Promise<Maker> {
    const result = await this.db.insert(makers).values(maker).returning();
    return result[0];
  }

  async updateMaker(id: number, maker: Partial<InsertMaker>): Promise<Maker | undefined> {
    const result = await this.db.update(makers).set(maker).where(eq(makers.id, id)).returning();
    return result[0];
  }

  async deleteMaker(id: number): Promise<boolean> {
    const result = await this.db.delete(makers).where(eq(makers.id, id)).returning();
    return result.length > 0;
  }

  // Products & Services
  async getAllProducts(): Promise<ProductService[]> {
    return await this.db.select().from(productsServices).orderBy(productsServices.title);
  }

  async getProductById(id: number): Promise<ProductService | undefined> {
    const result = await this.db.select().from(productsServices).where(eq(productsServices.id, id));
    return result[0];
  }

  async searchProducts(query: string): Promise<ProductService[]> {
    const searchPattern = `%${query}%`;
    return await this.db
      .select()
      .from(productsServices)
      .where(
        or(
          ilike(productsServices.title, searchPattern),
          ilike(productsServices.category, searchPattern),
          ilike(productsServices.type, searchPattern),
          ilike(productsServices.mode, searchPattern),
        ),
      )
      .orderBy(productsServices.title);
  }

  async createProduct(product: InsertProductService): Promise<ProductService> {
    const result = await this.db.insert(productsServices).values(product).returning();
    return result[0];
  }

  async updateProduct(id: number, product: Partial<InsertProductService>): Promise<ProductService | undefined> {
    const result = await this.db.update(productsServices).set(product).where(eq(productsServices.id, id)).returning();
    return result[0];
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await this.db.delete(productsServices).where(eq(productsServices.id, id)).returning();
    return result.length > 0;
  }

  // Member Signups
  async createMemberSignup(signup: InsertMemberSignup): Promise<MemberSignup> {
    const result = await this.db.insert(memberSignups).values(signup).returning();
    return result[0];
  }

  async getAllSignups(): Promise<MemberSignup[]> {
    return await this.db.select().from(memberSignups).orderBy(sql`${memberSignups.createdAt} DESC`);
  }

  // Contact Submissions
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await this.db.insert(contactSubmissions).values(submission).returning();
    return result[0];
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await this.db.select().from(contactSubmissions).orderBy(sql`${contactSubmissions.createdAt} DESC`);
  }

  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return await this.db.select().from(blogPosts).orderBy(sql`${blogPosts.date} DESC`);
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await this.db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(sql`${blogPosts.date} DESC`);
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const result = await this.db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return result[0];
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await this.db.insert(blogPosts).values(post).returning();
    return result[0];
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await this.db.update(blogPosts).set(post).where(eq(blogPosts.id, id)).returning();
    return result[0];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await this.db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }

  // SetAI Codex - Events
  async getAllCodexEvents(): Promise<CodexEvent[]> {
    return await this.db.select().from(codexEvents).orderBy(sql`${codexEvents.timestamp} DESC`);
  }

  async getCodexEventById(id: number): Promise<CodexEvent | undefined> {
    const result = await this.db.select().from(codexEvents).where(eq(codexEvents.id, id));
    return result[0];
  }

  async createCodexEvent(event: InsertCodexEvent): Promise<CodexEvent> {
    const result = await this.db.insert(codexEvents).values(event).returning();
    return result[0];
  }

  async updateCodexEvent(id: number, event: Partial<InsertCodexEvent>): Promise<CodexEvent | undefined> {
    const result = await this.db.update(codexEvents).set({ ...event, updatedAt: new Date() }).where(eq(codexEvents.id, id)).returning();
    return result[0];
  }

  async deleteCodexEvent(id: number): Promise<boolean> {
    const result = await this.db.delete(codexEvents).where(eq(codexEvents.id, id)).returning();
    return result.length > 0;
  }

  // SetAI Codex - Documents
  async getAllCodexDocuments(): Promise<CodexDocument[]> {
    return await this.db.select().from(codexDocuments).orderBy(sql`${codexDocuments.createdAt} DESC`);
  }

  async getCodexDocumentById(id: number): Promise<CodexDocument | undefined> {
    const result = await this.db.select().from(codexDocuments).where(eq(codexDocuments.id, id));
    return result[0];
  }

  async createCodexDocument(doc: InsertCodexDocument): Promise<CodexDocument> {
    const result = await this.db.insert(codexDocuments).values(doc).returning();
    return result[0];
  }

  async updateCodexDocument(id: number, doc: Partial<InsertCodexDocument>): Promise<CodexDocument | undefined> {
    const result = await this.db.update(codexDocuments).set({ ...doc, updatedAt: new Date() }).where(eq(codexDocuments.id, id)).returning();
    return result[0];
  }

  async deleteCodexDocument(id: number): Promise<boolean> {
    const result = await this.db.delete(codexDocuments).where(eq(codexDocuments.id, id)).returning();
    return result.length > 0;
  }

  // SetAI Codex - Projects
  async getAllCodexProjects(): Promise<CodexProject[]> {
    return await this.db.select().from(codexProjects).orderBy(codexProjects.name);
  }

  async getCodexProjectById(id: number): Promise<CodexProject | undefined> {
    const result = await this.db.select().from(codexProjects).where(eq(codexProjects.id, id));
    return result[0];
  }

  async createCodexProject(project: InsertCodexProject): Promise<CodexProject> {
    const result = await this.db.insert(codexProjects).values(project).returning();
    return result[0];
  }

  async updateCodexProject(id: number, project: Partial<InsertCodexProject>): Promise<CodexProject | undefined> {
    const result = await this.db.update(codexProjects).set({ ...project, updatedAt: new Date() }).where(eq(codexProjects.id, id)).returning();
    return result[0];
  }

  async deleteCodexProject(id: number): Promise<boolean> {
    const result = await this.db.delete(codexProjects).where(eq(codexProjects.id, id)).returning();
    return result.length > 0;
  }

  // SetAI Councils
  async getAllCouncilPersonas(): Promise<CouncilPersona[]> {
    return await this.db.select().from(councilPersonas).orderBy(councilPersonas.name);
  }

  async getCouncilPersonaByName(name: string): Promise<CouncilPersona | undefined> {
    const result = await this.db.select().from(councilPersonas).where(eq(councilPersonas.name, name));
    return result[0];
  }

  async createCouncilPersona(persona: InsertCouncilPersona): Promise<CouncilPersona> {
    const result = await this.db.insert(councilPersonas).values(persona).returning();
    return result[0];
  }

  async getModePreference(userId: string): Promise<ModePreference | undefined> {
    const result = await this.db.select().from(modePreferences).where(eq(modePreferences.userId, userId));
    return result[0];
  }

  async setModePreference(pref: InsertModePreference): Promise<ModePreference> {
    const existing = await this.getModePreference(pref.userId);
    if (existing) {
      const result = await this.db.update(modePreferences).set({ ...pref, updatedAt: new Date() }).where(eq(modePreferences.userId, pref.userId)).returning();
      return result[0];
    }
    const result = await this.db.insert(modePreferences).values(pref).returning();
    return result[0];
  }

  // SetAI Security
  async getAllSecurityEvents(): Promise<SecurityEvent[]> {
    return await this.db.select().from(securityEvents).orderBy(sql`${securityEvents.createdAt} DESC`);
  }

  async getRecentSecurityEvents(limit: number): Promise<SecurityEvent[]> {
    return await this.db.select().from(securityEvents).orderBy(sql`${securityEvents.createdAt} DESC`).limit(limit);
  }

  async createSecurityEvent(event: InsertSecurityEvent): Promise<SecurityEvent> {
    const result = await this.db.insert(securityEvents).values(event).returning();
    return result[0];
  }

  async getAllGuardianPolicies(): Promise<GuardianPolicy[]> {
    return await this.db.select().from(guardianPolicies).orderBy(guardianPolicies.policyId);
  }

  async getActiveGuardianPolicies(): Promise<GuardianPolicy[]> {
    return await this.db.select().from(guardianPolicies).where(eq(guardianPolicies.active, true)).orderBy(guardianPolicies.policyId);
  }
}

export const storage = new PostgresStorage();
