import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sanctuaryNodes = pgTable("sanctuary_nodes", {
  id: serial("id").primaryKey(),
  nodeId: text("node_id").notNull().unique(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  city: text("city").notNull(),
  specialties: text("specialties").array().notNull().default([]),
  nextEvent: text("next_event"),
  contactEmail: text("contact_email").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSanctuaryNodeSchema = createInsertSchema(sanctuaryNodes).omit({
  id: true,
  createdAt: true,
});
export type InsertSanctuaryNode = z.infer<typeof insertSanctuaryNodeSchema>;
export type SanctuaryNode = typeof sanctuaryNodes.$inferSelect;

export const makers = pgTable("makers", {
  id: serial("id").primaryKey(),
  makerId: text("maker_id").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  location: text("location").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description"),
  reputation: integer("reputation").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMakerSchema = createInsertSchema(makers).omit({
  id: true,
  createdAt: true,
  reputation: true,
});
export type InsertMaker = z.infer<typeof insertMakerSchema>;
export type Maker = typeof makers.$inferSelect;

export const productsServices = pgTable("products_services", {
  id: serial("id").primaryKey(),
  itemId: text("item_id").notNull().unique(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  mode: text("mode").notNull(),
  priceNote: text("price_note").notNull(),
  description: text("description"),
  makerId: integer("maker_id").references(() => makers.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductServiceSchema = createInsertSchema(productsServices).omit({
  id: true,
  createdAt: true,
});
export type InsertProductService = z.infer<typeof insertProductServiceSchema>;
export type ProductService = typeof productsServices.$inferSelect;

export const memberSignups = pgTable("member_signups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMemberSignupSchema = createInsertSchema(memberSignups).omit({
  id: true,
  createdAt: true,
});
export type InsertMemberSignup = z.infer<typeof insertMemberSignupSchema>;
export type MemberSignup = typeof memberSignups.$inferSelect;

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  postId: text("post_id").notNull().unique(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// ============================================================================
// SETAI CODEX MODELS
// ============================================================================

export const codexEvents = pgTable("codex_events", {
  id: serial("id").primaryKey(),
  eventId: text("event_id").notNull().unique(),
  timestamp: timestamp("timestamp").notNull(),
  approximate: boolean("approximate").notNull().default(false),
  location: text("location"),
  people: text("people").array().notNull().default([]),
  institutions: text("institutions").array().notNull().default([]),
  summary: text("summary").notNull(),
  details: text("details"),
  tags: text("tags").array().notNull().default([]),
  linkedDocumentIds: text("linked_document_ids").array().notNull().default([]),
  linkedProjectIds: text("linked_project_ids").array().notNull().default([]),
  source: text("source").notNull().default("user"),
  trustLevel: text("trust_level").notNull().default("probable"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCodexEventSchema = createInsertSchema(codexEvents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCodexEvent = z.infer<typeof insertCodexEventSchema>;
export type CodexEvent = typeof codexEvents.$inferSelect;

export const codexDocuments = pgTable("codex_documents", {
  id: serial("id").primaryKey(),
  documentId: text("document_id").notNull().unique(),
  title: text("title").notNull(),
  path: text("path"),
  type: text("type").notNull().default("text"),
  summary: text("summary"),
  extractedText: text("extracted_text"),
  linkedEventIds: text("linked_event_ids").array().notNull().default([]),
  source: text("source").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCodexDocumentSchema = createInsertSchema(codexDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCodexDocument = z.infer<typeof insertCodexDocumentSchema>;
export type CodexDocument = typeof codexDocuments.$inferSelect;

export const codexProjects = pgTable("codex_projects", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  name: text("name").notNull(),
  status: text("status").notNull().default("active"),
  description: text("description"),
  linkedEventIds: text("linked_event_ids").array().notNull().default([]),
  linkedDocumentIds: text("linked_document_ids").array().notNull().default([]),
  tags: text("tags").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCodexProjectSchema = createInsertSchema(codexProjects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCodexProject = z.infer<typeof insertCodexProjectSchema>;
export type CodexProject = typeof codexProjects.$inferSelect;

// ============================================================================
// SETAI COUNCIL MODELS
// ============================================================================

export const councilPersonas = pgTable("council_personas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  tone: text("tone").notNull(),
  constraints: text("constraints").array().notNull().default([]),
  allowedTools: text("allowed_tools").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCouncilPersonaSchema = createInsertSchema(councilPersonas).omit({
  id: true,
  createdAt: true,
});
export type InsertCouncilPersona = z.infer<typeof insertCouncilPersonaSchema>;
export type CouncilPersona = typeof councilPersonas.$inferSelect;

export const modePreferences = pgTable("mode_preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  defaultPersona: text("default_persona").notNull().default("Companion"),
  verbosity: text("verbosity").notNull().default("medium"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertModePreferenceSchema = createInsertSchema(modePreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertModePreference = z.infer<typeof insertModePreferenceSchema>;
export type ModePreference = typeof modePreferences.$inferSelect;

// ============================================================================
// SETAI SECURITY MODELS
// ============================================================================

export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  eventId: text("event_id").notNull().unique(),
  stage: text("stage").notNull(),
  level: text("level").notNull().default("low"),
  description: text("description").notNull(),
  rawInput: text("raw_input"),
  decision: text("decision").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSecurityEventSchema = createInsertSchema(securityEvents).omit({
  id: true,
  createdAt: true,
});
export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;
export type SecurityEvent = typeof securityEvents.$inferSelect;

export const guardianPolicies = pgTable("guardian_policies", {
  id: serial("id").primaryKey(),
  policyId: text("policy_id").notNull().unique(),
  scope: text("scope").notNull(),
  description: text("description").notNull(),
  conditions: text("conditions").notNull(),
  action: text("action").notNull(),
  log: boolean("log").notNull().default(true),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGuardianPolicySchema = createInsertSchema(guardianPolicies).omit({
  id: true,
  createdAt: true,
});
export type InsertGuardianPolicy = z.infer<typeof insertGuardianPolicySchema>;
export type GuardianPolicy = typeof guardianPolicies.$inferSelect;
