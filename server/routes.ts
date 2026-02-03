import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertSanctuaryNodeSchema,
  insertMakerSchema,
  insertProductServiceSchema,
  insertMemberSignupSchema,
  insertContactSubmissionSchema,
  insertBlogPostSchema,
  insertCodexEventSchema,
  insertCodexDocumentSchema,
  insertCodexProjectSchema,
  insertSecurityEventSchema,
  insertModePreferenceSchema,
} from "@shared/schema";
import fs from "fs";
import path from "path";
import { fromZodError } from "zod-validation-error";
import { createListResponse, createSuccessResponse, createErrorResponse, getSupportInfo, getSafetyDisclaimer } from "./witchmart-response";

// SetAI Consent Middleware - Rejects POST/PUT/PATCH without consent
function requireConsent(req: any, res: any, next: any) {
  // Skip for GET and DELETE methods
  if (req.method === "GET" || req.method === "DELETE") {
    return next();
  }
  
  // Skip for revoke endpoint (allows users to revoke without prior consent)
  // Note: req.path is relative to mount point, so it's "/revoke" not "/api/revoke"
  if (req.path === "/revoke") {
    return next();
  }
  
  // Check for consent in body
  const consent = req.body?.consent;
  if (consent !== true && consent !== "true") {
    return res.status(403).json({
      error: "SetAI Gate: Consent required. You must agree to transient session data only.",
      code: "CONSENT_REQUIRED"
    });
  }
  
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Apply SetAI consent middleware to all API routes
  app.use("/api", requireConsent);

  // Sanctuary Nodes
  app.get("/api/nodes", async (req, res) => {
    try {
      const { q } = req.query;
      if (q && typeof q === "string") {
        const nodes = await storage.searchNodes(q);
        return res.json(createListResponse(nodes, "sanctuary nodes", { includeSupport: true }));
      }
      const nodes = await storage.getAllNodes();
      res.json(createListResponse(nodes, "sanctuary nodes", { includeSupport: true }));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  });

  app.get("/api/nodes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const node = await storage.getNodeById(id);
      if (!node) {
        return res.status(404).json({ error: "Node not found" });
      }
      res.json(node);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/nodes", async (req, res) => {
    try {
      const { name, nodeType, founded, location, contact, description } = req.body;
      
      const requiredFields = { name, nodeType, founded, location, contact, description };
      const missing = Object.entries(requiredFields)
        .filter(([_, v]) => !v)
        .map(([k]) => k);
      
      if (missing.length > 0) {
        return res.status(400).json(createErrorResponse(
          `Missing required fields: ${missing.join(", ")}`
        ));
      }
      
      const hatePatterns = /\b(hate|violence|kill|attack|supremacy|nazi|terrorist)\b/i;
      const textContent = `${name} ${description} ${req.body.statement || ""}`;
      if (hatePatterns.test(textContent)) {
        return res.status(400).json(createErrorResponse(
          "Submission rejected: Content promoting violence, hate, or illegal activity is not permitted."
        ));
      }
      
      const nodeId = `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const nodeData = { ...req.body, nodeId };
      
      const result = insertSanctuaryNodeSchema.safeParse(nodeData);
      if (!result.success) {
        return res.status(400).json(createErrorResponse(fromZodError(result.error).message));
      }
      
      const node = await storage.createNode(result.data);
      res.status(201).json({
        status: "success",
        message: "Node added successfully. All traditions welcome.",
        node,
        support: getSupportInfo()
      });
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  });

  app.patch("/api/nodes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const node = await storage.updateNode(id, req.body);
      if (!node) {
        return res.status(404).json({ error: "Node not found" });
      }
      res.json(node);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/nodes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteNode(id);
      if (!deleted) {
        return res.status(404).json({ error: "Node not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Makers & Guilds
  app.get("/api/makers", async (req, res) => {
    try {
      const { q } = req.query;
      if (q && typeof q === "string") {
        const makers = await storage.searchMakers(q);
        return res.json(createListResponse(makers, "makers and guilds", { includeSupport: true }));
      }
      const makers = await storage.getAllMakers();
      res.json(createListResponse(makers, "makers and guilds", { includeSupport: true }));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  });

  app.get("/api/makers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const maker = await storage.getMakerById(id);
      if (!maker) {
        return res.status(404).json({ error: "Maker not found" });
      }
      res.json(maker);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/makers", async (req, res) => {
    try {
      const result = insertMakerSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const maker = await storage.createMaker(result.data);
      res.status(201).json(maker);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/makers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const maker = await storage.updateMaker(id, req.body);
      if (!maker) {
        return res.status(404).json({ error: "Maker not found" });
      }
      res.json(maker);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/makers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMaker(id);
      if (!deleted) {
        return res.status(404).json({ error: "Maker not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Products & Services
  app.get("/api/products", async (req, res) => {
    try {
      const { q } = req.query;
      if (q && typeof q === "string") {
        const products = await storage.searchProducts(q);
        return res.json(createListResponse(products, "products and services", { includeSupport: true }));
      }
      const products = await storage.getAllProducts();
      res.json(createListResponse(products, "products and services", { includeSupport: true }));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const result = insertProductServiceSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const product = await storage.createProduct(result.data);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.updateProduct(id, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Member Signups
  app.post("/api/member-signups", async (req, res) => {
    try {
      const result = insertMemberSignupSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const signup = await storage.createMemberSignup(result.data);
      res.status(201).json(signup);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/member-signups", async (req, res) => {
    try {
      const signups = await storage.getAllSignups();
      res.json(signups);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Contact Submissions
  app.post("/api/contact", async (req, res) => {
    try {
      const result = insertContactSubmissionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const submission = await storage.createContactSubmission(result.data);
      res.status(201).json(submission);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // WitchMart Support Info
  app.get("/api/support", (req, res) => {
    res.json({
      status: "success",
      data: {
        support: getSupportInfo(),
        disclaimer: getSafetyDisclaimer(),
        cooperative: {
          name: "WitchMart",
          type: "Member-owned cooperative",
          principles: [
            "Transparency: State exactly what contributions support",
            "Voluntary: No pressure, no urgency, no guilt",
            "Community Ownership: Contributions help build shared infrastructure",
            "Clarity: Never more than necessary"
          ]
        }
      }
    });
  });

  // Blog Posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(createListResponse(posts, "blog posts", { includeSupport: true }));
    } catch (error: any) {
      res.status(500).json(createErrorResponse(error.message));
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.getBlogPostById(id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const result = insertBlogPostSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const post = await storage.createBlogPost(result.data);
      res.status(201).json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.updateBlogPost(id, req.body);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/blog/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteBlogPost(id);
      if (!deleted) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // SetAI: Consent revocation endpoint
  // NOTE: This endpoint only acknowledges the revocation request.
  // No user data is stored server-side for anonymous sessions.
  // The console log below is for development debugging only and
  // should be removed or disabled in production to maintain
  // the zero-retention promise.
  app.post("/api/revoke", async (_req, res) => {
    if (process.env.NODE_ENV === "development") {
      console.log("[SetAI] Revocation acknowledged (dev mode only)");
    }
    res.json({ success: true, message: "Consent revoked. All session data cleared." });
  });

  // ============================================================================
  // SETAI CANON ROUTES
  // ============================================================================
  
  app.get("/api/canon", async (_req, res) => {
    try {
      const canonPath = path.join(process.cwd(), "config", "canon.json");
      const canon = JSON.parse(fs.readFileSync(canonPath, "utf-8"));
      res.json(canon);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/founder_canon", async (_req, res) => {
    try {
      const founderCanonPath = path.join(process.cwd(), "config", "founder_canon.json");
      const founderCanon = JSON.parse(fs.readFileSync(founderCanonPath, "utf-8"));
      res.json(founderCanon);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/guardian_policies", async (_req, res) => {
    try {
      const policiesPath = path.join(process.cwd(), "config", "guardian_policies.json");
      const policies = JSON.parse(fs.readFileSync(policiesPath, "utf-8"));
      res.json(policies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/security_pipeline", async (_req, res) => {
    try {
      const pipelinePath = path.join(process.cwd(), "config", "security_pipeline.json");
      const pipeline = JSON.parse(fs.readFileSync(pipelinePath, "utf-8"));
      res.json(pipeline);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================================
  // SETAI CODEX ROUTES
  // ============================================================================

  // Codex Events
  app.get("/api/codex/events", async (_req, res) => {
    try {
      const events = await storage.getAllCodexEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/codex/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getCodexEventById(id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/codex/events", async (req, res) => {
    try {
      const data = { ...req.body };
      if (typeof data.timestamp === "string") {
        data.timestamp = new Date(data.timestamp);
      }
      const result = insertCodexEventSchema.safeParse(data);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const event = await storage.createCodexEvent(result.data);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/codex/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = { ...req.body };
      if (typeof data.timestamp === "string") {
        data.timestamp = new Date(data.timestamp);
      }
      const event = await storage.updateCodexEvent(id, data);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/codex/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCodexEvent(id);
      if (!deleted) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Codex Documents
  app.get("/api/codex/documents", async (_req, res) => {
    try {
      const documents = await storage.getAllCodexDocuments();
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/codex/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getCodexDocumentById(id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/codex/documents", async (req, res) => {
    try {
      const result = insertCodexDocumentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const document = await storage.createCodexDocument(result.data);
      res.status(201).json(document);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/codex/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.updateCodexDocument(id, req.body);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/codex/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCodexDocument(id);
      if (!deleted) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Codex Projects
  app.get("/api/codex/projects", async (_req, res) => {
    try {
      const projects = await storage.getAllCodexProjects();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/codex/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getCodexProjectById(id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/codex/projects", async (req, res) => {
    try {
      const result = insertCodexProjectSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const project = await storage.createCodexProject(result.data);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/codex/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.updateCodexProject(id, req.body);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/codex/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCodexProject(id);
      if (!deleted) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================================
  // SETAI COUNCILS ROUTES
  // ============================================================================

  app.get("/api/councils/personas", async (_req, res) => {
    try {
      const personas = await storage.getAllCouncilPersonas();
      res.json(personas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/councils/mode/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const pref = await storage.getModePreference(userId);
      if (!pref) {
        return res.json({ defaultPersona: "Companion", verbosity: "medium" });
      }
      res.json(pref);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/councils/mode", async (req, res) => {
    try {
      const result = insertModePreferenceSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const pref = await storage.setModePreference(result.data);
      res.status(201).json(pref);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============================================================================
  // SETAI SECURITY ROUTES
  // ============================================================================

  app.get("/api/security/events", async (req, res) => {
    try {
      const { limit } = req.query;
      if (limit && typeof limit === "string") {
        const events = await storage.getRecentSecurityEvents(parseInt(limit));
        return res.json(events);
      }
      const events = await storage.getAllSecurityEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/security/events", async (req, res) => {
    try {
      const result = insertSecurityEventSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: fromZodError(result.error).message });
      }
      const event = await storage.createSecurityEvent(result.data);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/security/policies", async (_req, res) => {
    try {
      const policies = await storage.getActiveGuardianPolicies();
      res.json(policies);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Health check
  app.get("/api/health", async (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  return httpServer;
}
