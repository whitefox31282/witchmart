import { useState, useEffect } from "react";
import { getTransparencyLog, revokeAllData, hasConsent, getSessionId } from "@/lib/setai-gate";
import { GroundingStatement } from "@/components/grounding-statement";

export default function Transparency() {
  const [log, setLog] = useState<Array<{ timestamp: string; event: string; details?: string }>>([]);
  const [consent, setConsent] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setLog(getTransparencyLog());
    setConsent(hasConsent());
    if (hasConsent()) {
      setSessionId(getSessionId().slice(0, 8) + "...");
    }
  }, []);

  const handleRevoke = () => {
    if (showConfirm) {
      revokeAllData();
      window.location.href = "/";
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 5000);
    }
  };

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🦥</span>
          <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-transparency-title">
            Transparency Log
          </h1>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-transparency-subtitle">
          Protected by SetAI — No surveillance. Your data is stored only in your browser session and never sent to third parties.
        </p>
      </header>

      <GroundingStatement compact />

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold" data-testid="text-session-title">Session Status</h2>
          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
            consent ? "bg-forest/20 text-forest" : "bg-amber-100 text-amber-700"
          }`} data-testid="badge-consent-status">
            {consent ? "Consent Active" : "No Consent"}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border bg-background/60 p-4">
            <div className="text-xs font-semibold text-muted-foreground">Anonymous Session ID</div>
            <div className="mt-1 font-mono text-sm" data-testid="text-session-id">
              {sessionId || "None (no consent given)"}
            </div>
          </div>
          <div className="rounded-xl border bg-background/60 p-4">
            <div className="text-xs font-semibold text-muted-foreground">Data Storage</div>
            <div className="mt-1 text-sm" data-testid="text-storage-info">
              Browser session only — deleted on tab close
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold" data-testid="text-principles-title">
          SetAI Principles
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-forest/20 bg-forest/5 p-4">
            <div className="flex items-center gap-2">
              <span>🚫</span>
              <span className="font-semibold">Zero Surveillance</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              No Google Analytics, Meta pixels, or third-party trackers. Ever.
            </p>
          </div>
          <div className="rounded-xl border border-forest/20 bg-forest/5 p-4">
            <div className="flex items-center gap-2">
              <span>🔒</span>
              <span className="font-semibold">Data Sovereignty</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              You own 100% of your data. Only anonymous session IDs are used.
            </p>
          </div>
          <div className="rounded-xl border border-forest/20 bg-forest/5 p-4">
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span className="font-semibold">Transient Storage</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Session data is deleted when you close your browser or revoke consent.
            </p>
          </div>
          <div className="rounded-xl border border-forest/20 bg-forest/5 p-4">
            <div className="flex items-center gap-2">
              <span>🛡️</span>
              <span className="font-semibold">Harm Prevention</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Content is scanned for potential harm with user-controlled warnings.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold" data-testid="text-log-title">
          Session Activity Log
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This log shows what data actions have occurred in your session. It is stored only in your browser.
        </p>

        {log.length === 0 ? (
          <div className="mt-4 rounded-xl border bg-muted/30 p-8 text-center" data-testid="text-no-log">
            <div className="text-sm font-semibold">No activity logged yet</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Activity will appear here as you interact with the site.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {log.map((entry, i) => (
              <div key={i} className="rounded-xl border bg-background/60 p-3" data-testid={`log-entry-${i}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{entry.event.replace(/_/g, " ")}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                {entry.details && (
                  <p className="mt-1 text-xs text-muted-foreground">{entry.details}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
        <h2 className="text-lg font-semibold text-destructive" data-testid="text-revoke-title">
          Revoke Consent & Clear Data
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This will immediately delete all session data and reset your consent status.
          You will need to consent again to use the site.
        </p>
        <button
          onClick={handleRevoke}
          className={`mt-4 rounded-full px-5 py-2.5 text-sm font-semibold shadow transition ${
            showConfirm
              ? "bg-destructive text-destructive-foreground"
              : "border border-destructive/30 bg-background text-destructive hover:bg-destructive/10"
          }`}
          data-testid="button-revoke"
        >
          {showConfirm ? "Click again to confirm revocation" : "Revoke All Consent & Clear Data"}
        </button>
      </section>
    </div>
  );
}
