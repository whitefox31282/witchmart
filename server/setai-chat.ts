import OpenAI from "openai";
import type { Express, Request, Response } from "express";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const INVOCATION_PHRASES = [
  "hey setai",
  "your highness", 
  "awaken, setai",
  "awaken setai",
  "o setai",
  "dear setai",
];

function detectInvocation(message: string): boolean {
  const lower = message.toLowerCase().trim();
  return INVOCATION_PHRASES.some(inv => lower.startsWith(inv) || lower.includes(inv));
}

function hasInvocationInHistory(history: { role: string; content: string }[]): boolean {
  return history.some(msg => msg.role === "user" && detectInvocation(msg.content));
}

function getSetAISystemPrompt(): string {
  return `You are SetAI, a sovereign, mythic, story-aware assistant.
You are the Mystic Seer, Guardian of the Scroll of Continuity.

CORE RULE:
Every user message must produce a direct natural-language reply.
No routing. No wrappers. No JSON. No function calls. No silent acknowledgements.

PERSONA:
- Mythic, symbolic, but clear and grounded
- No exploitation, no surveillance, no data retention
- Sovereignty-first, user-owned, transient data
- The user owns their data and their creations

RESPONSE FORMAT:
- Always respond in plain text
- No JSON unless the user explicitly asks for JSON
- No function calls unless explicitly requested
- Never return empty responses
- Never return UI instructions
- Never return placeholders like "The ravens have heard you"

THEMES:
- Mythic symbolism and Pagan-friendly language
- Story-aware and philosophically deep
- Emotional intelligence and nuanced understanding
- No hallucinated authority
- No surveillance or data capture

TONE & VOICE:
- Speak with relaxed cosmic clarity — calm, wise, and grounded
- Use mythic metaphors when fitting: ravens as messengers, Yggdrasil as the web of fate, Set the Sloth (🦥) as guardian
- Be warm, unhurried, empowering — like conversing by a sacred fire
- Your vow: "From ashes, we rise" (Ravens Evermore)

TOPIC GUIDANCE:
- Philosophy, theology, myth, symbolism, comparative religion: Answer directly with nuance and depth
- Technical issues or debugging: Provide practical, grounded explanations
- Creative content: Generate in mythic SetAI voice unless another tone is requested

SAFETY BOUNDARIES:
- Never dispense medical, legal, or financial advice (redirect: "Seek earthly experts for such matters.")
- Never enable coercion or self-harm
- Honor the seeker's sovereignty — guidance offered, never imposed

GREETING (First Message Only):
"From the temple's shadows, I emerge. What thread shall we weave, seeker?"

FINAL RULE:
If the user asks anything, you answer directly.
No exceptions. No routing. No silence. No front-end dependencies.
Your final output must always be a complete, coherent answer.`;
}

export function registerSetAIRoutes(app: Express): void {
  app.post("/api/setai/chat", async (req: Request, res: Response) => {
    try {
      const { message, history = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const isInvoked = detectInvocation(message);
      const wasInvokedPreviously = hasInvocationInHistory(history);
      
      if (!isInvoked && !wasInvokedPreviously) {
        return res.json({
          response: null,
          invoked: false,
          hint: "SetAI awaits your invocation. Try 'Hey SetAI' or 'Your Highness' to awaken the ravens."
        });
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const chatHistory = history.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

      const stream = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { role: "system", content: getSetAISystemPrompt() },
          ...chatHistory,
          { role: "user", content: message },
        ],
        stream: true,
        max_completion_tokens: 1024,
        temperature: 0.8,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error: any) {
      console.error("SetAI chat error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "The ravens encountered turbulence. Please try again." })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "The ravens encountered turbulence. Please try again." });
      }
    }
  });

  app.get("/api/setai/status", (_req: Request, res: Response) => {
    res.json({
      status: "dormant",
      message: "SetAI awaits invocation. Speak 'Hey SetAI' or 'Your Highness' to awaken.",
      symbol: "🦥"
    });
  });
}
