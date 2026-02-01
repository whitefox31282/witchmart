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
}

export const storage = new PostgresStorage();
