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
