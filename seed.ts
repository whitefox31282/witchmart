import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
  sanctuaryNodes,
  makers,
  productsServices,
  blogPosts,
} from "./shared/schema";

const { Pool } = pg;

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(pool);

  console.log("Seeding sanctuary nodes...");
  await db.insert(sanctuaryNodes).values([
    {
      nodeId: "wm-001",
      name: "Green Hollow Node",
      region: "Appalachia",
      city: "Asheville, NC",
      specialties: ["mutual aid", "classes", "repair"],
      nextEvent: "Community skillshare (placeholder)",
      contactEmail: "node@witchmart.org",
      description: "A welcoming community hub for mutual aid, skill-sharing, and repair workshops.",
    },
    {
      nodeId: "wm-002",
      name: "Harbor Lantern Node",
      region: "Coastal",
      city: "Portland, ME",
      specialties: ["makers market", "food", "sanctuary"],
      nextEvent: "Seasonal market night (placeholder)",
      contactEmail: "node@witchmart.org",
      description: "Coastal sanctuary offering seasonal markets and food security programs.",
    },
    {
      nodeId: "wm-003",
      name: "Ironwood Circle",
      region: "Midwest",
      city: "Madison, WI",
      specialties: ["survival tech", "guild meetups", "training"],
      nextEvent: "Node orientation (placeholder)",
      contactEmail: "node@witchmart.org",
      description: "Midwest hub for survival skills training and guild coordination.",
    },
  ]);

  console.log("Seeding makers...");
  await db.insert(makers).values([
    {
      makerId: "mk-101",
      name: "Iron & Ivy Workshop",
      category: "repair / tools",
      reputation: 48,
      location: "Madison, WI",
      tagline: "Fix-first craft: restore, sharpen, mend.",
      description: "Specializing in tool repair, restoration, and teaching repair skills to the community.",
    },
    {
      makerId: "mk-102",
      name: "Hearthseed Guild",
      category: "ag / food",
      reputation: 46,
      location: "Asheville, NC",
      tagline: "Seasonal staples, shared skills, soil wisdom.",
      description: "Growing, preserving, and teaching sustainable agriculture practices.",
    },
    {
      makerId: "mk-103",
      name: "Lanternglass Atelier",
      category: "handmade goods",
      reputation: 49,
      location: "Portland, ME",
      tagline: "Small-batch goods, honest materials.",
      description: "Crafting beautiful, functional items using traditional techniques and local materials.",
    },
  ]);

  console.log("Seeding products...");
  await db.insert(productsServices).values([
    {
      itemId: "ps-201",
      title: "Basic Repair Clinic (group)",
      type: "service",
      category: "repair",
      mode: "local",
      priceNote: "$ — sliding scale (placeholder)",
      description: "Learn essential repair skills in a supportive group setting.",
    },
    {
      itemId: "ps-202",
      title: "Shelf-Stable Pantry Starter",
      type: "product",
      category: "ag/food",
      mode: "local",
      priceNote: "$ — coop price (placeholder)",
      description: "Seasonal, shelf-stable foods to build food security.",
    },
    {
      itemId: "ps-203",
      title: "Safety & Planning Workshop",
      type: "service",
      category: "classes",
      mode: "virtual",
      priceNote: "$ — member discount (placeholder)",
      description: "Virtual workshop on community safety planning and protocols.",
    },
  ]);

  console.log("Seeding blog posts...");
  await db.insert(blogPosts).values([
    {
      postId: "bl-1",
      title: "Welcome to WitchMart (prototype)",
      date: "2026-02-01",
      excerpt: "What we are building, why it matters, and how members shape the system.",
      content: "Full blog post content coming soon...",
      published: true,
    },
    {
      postId: "bl-2",
      title: "Sanctuary nodes: the first 90 days (placeholder)",
      date: "2026-02-01",
      excerpt: "A practical onboarding rhythm: safety, roles, inventory, and trust-building.",
      content: "Full blog post content coming soon...",
      published: true,
    },
  ]);

  console.log("✅ Seeding complete!");
  await pool.end();
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
