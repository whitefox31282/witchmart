// SetAI Gate - Sovereignty, Consent, and Harm Prevention System

const HARM_TRIGGERS = [
  "threat", "dox", "harm", "self-harm", "suicide", "abuse",
  "illegal", "weapon", "exploit", "kill", "murder", "attack"
];

// Check if text contains potential harm triggers
export function detectHarmTriggers(text: string): boolean {
  const lowerText = text.toLowerCase();
  return HARM_TRIGGERS.some(trigger => lowerText.includes(trigger));
}

// Check multiple form values for harm triggers
export function scanFormForHarm(values: Record<string, unknown>): boolean {
  return Object.values(values).some(value => {
    if (typeof value === "string") {
      return detectHarmTriggers(value);
    }
    return false;
  });
}

// Generate anonymous session ID (no personal data)
export function getSessionId(): string {
  let sessionId = sessionStorage.getItem("witchmart-session-id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("witchmart-session-id", sessionId);
  }
  return sessionId;
}

// Check if user has given consent
export function hasConsent(): boolean {
  return sessionStorage.getItem("witchmart-consent") === "true";
}

// Set consent status
export function setConsent(granted: boolean): void {
  if (granted) {
    sessionStorage.setItem("witchmart-consent", "true");
    sessionStorage.setItem("witchmart-consent-time", new Date().toISOString());
  } else {
    revokeAllData();
  }
}

// Revoke all consent and clear all data
export function revokeAllData(): void {
  sessionStorage.clear();
  localStorage.clear();
  // Notify server of revocation (fire and forget)
  fetch("/api/revoke", { method: "POST" }).catch(() => {});
}

// Log transparency event (stored in session only)
export function logTransparencyEvent(event: string, details?: string): void {
  const log = JSON.parse(sessionStorage.getItem("witchmart-transparency-log") || "[]");
  log.push({
    timestamp: new Date().toISOString(),
    event,
    details,
    sessionId: getSessionId().slice(0, 8) + "..." // Truncated for privacy
  });
  sessionStorage.setItem("witchmart-transparency-log", JSON.stringify(log));
}

// Get transparency log
export function getTransparencyLog(): Array<{ timestamp: string; event: string; details?: string }> {
  return JSON.parse(sessionStorage.getItem("witchmart-transparency-log") || "[]");
}

// Crisis resources for trauma-informed design
export const CRISIS_RESOURCES = [
  { name: "988 Suicide & Crisis Lifeline", phone: "988", url: "https://988lifeline.org" },
  { name: "Trans Lifeline", phone: "877-565-8860", url: "https://translifeline.org" },
  { name: "Trevor Project", phone: "866-488-7386", url: "https://www.thetrevorproject.org" },
  { name: "Crisis Text Line", phone: "Text HOME to 741741", url: "https://www.crisistextline.org" },
];

// Grounding statement for trauma-informed design
export const GROUNDING_STATEMENT = `Breathe. You are in control. You own this space.
If you need help now, call 988 (US) or reach out to the resources below.`;
