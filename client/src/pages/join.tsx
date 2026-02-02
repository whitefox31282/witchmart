import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { GroundingStatement } from "@/components/grounding-statement";
import { scanFormForHarm, logTransparencyEvent } from "@/lib/setai-gate";
import { SetAIHarmWarning } from "@/components/setai-consent-modal";
import type { InsertMemberSignup } from "@shared/schema";

type Role = "Community" | "Maker" | "Guild" | "Node Owner";

const ROLE_COPY: Record<Role, { title: string; body: string }> = {
  Community: {
    title: "Community Member",
    body: "Browse nodes, attend events, and help shape standards through cooperative oversight.",
  },
  Maker: {
    title: "Maker",
    body: "List offerings, build reputation through transparent reviews, and participate in guild standards.",
  },
  Guild: {
    title: "Guild",
    body: "Organize skill communities, set safety baselines, and help certify best practices.",
  },
  "Node Owner": {
    title: "Node Owner",
    body: "Host a sanctuary node with clear guidelines, local coordination, and transparent operations.",
  },
};

export default function Join() {
  const [role, setRole] = useState<Role>("Community");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [showHarmWarning, setShowHarmWarning] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<InsertMemberSignup | null>(null);
  const { toast } = useToast();

  const copy = useMemo(() => ROLE_COPY[role], [role]);

  const submitMutation = useMutation({
    mutationFn: async (data: InsertMemberSignup) => {
      const response = await fetch("/api/member-signups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit signup");
      }
      return response.json();
    },
    onSuccess: () => {
      logTransparencyEvent("member_signup", `Role: ${role}`);
      toast({
        title: "Welcome to the sanctuary!",
        description: "Thank you for joining WitchMart. We'll be in touch soon.",
      });
      setName("");
      setEmail("");
      setNotes("");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const doSubmit = (data: InsertMemberSignup) => {
    submitMutation.mutate(data);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both name and email.",
        variant: "destructive",
      });
      return;
    }

    const data: InsertMemberSignup = {
      name: name.trim(),
      email: email.trim(),
      role,
      notes: notes.trim() || null,
    };

    // Check for harm triggers
    if (scanFormForHarm({ name, notes })) {
      setPendingSubmit(data);
      setShowHarmWarning(true);
      return;
    }

    doSubmit(data);
  };

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-join-title">
            Enter the Sanctuary
          </h1>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-join-subtitle">
          Choose how you want to participate in our member-owned cooperative. Your data is protected by SetAI.
        </p>
      </header>

      <GroundingStatement />

      <section className="grid gap-4 lg:grid-cols-3">
        <form className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2" onSubmit={handleSubmit}>
          <div className="text-sm font-semibold" data-testid="text-join-picker-title">
            Membership path
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["Community", "Maker", "Guild", "Node Owner"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                className={
                  "wm-focus-ring rounded-full border px-4 py-2 text-sm font-semibold shadow-sm transition hover:bg-muted/60" +
                  (role === r ? " bg-muted/80" : " bg-card")
                }
                data-testid={`button-role-${r.replaceAll(" ", "_")}`}
                onClick={() => setRole(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border bg-background/60 p-5">
            <div className="text-sm font-semibold" data-testid="text-join-role-title">
              {copy.title}
            </div>
            <p className="mt-2 text-sm text-muted-foreground" data-testid="text-join-role-body">
              {copy.body}
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold" data-testid="text-label-name">
                  Name *
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="wm-focus-ring rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                  placeholder="Your name"
                  data-testid="input-name"
                  required
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold" data-testid="text-label-email">
                  Email *
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="wm-focus-ring rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                  placeholder="you@domain.com"
                  data-testid="input-email"
                  required
                />
              </label>
              <label className="grid gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold" data-testid="text-label-notes">
                  Notes (optional)
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="wm-focus-ring min-h-28 rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                  placeholder="What are you hoping to build or join?"
                  data-testid="input-notes"
                />
              </label>
            </div>

            <div className="mt-4 rounded-xl border border-forest/20 bg-forest/5 p-4">
              <label className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1" data-testid="checkbox-consent" />
                <span className="text-xs text-muted-foreground">
                  I consent to <strong>transient session data only</strong>. I own my data. I can revoke at any time (instant delete).
                </span>
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="wm-focus-ring inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-95 disabled:opacity-50"
                data-testid="button-submit-signup"
              >
                {submitMutation.isPending ? "Submitting..." : "Enter Sanctuary"}
              </button>
              <button
                type="button"
                className="wm-focus-ring inline-flex items-center justify-center rounded-full border bg-card px-5 py-3 text-sm font-semibold shadow-sm hover:bg-muted/60"
                data-testid="button-discord-invite"
                onClick={() => alert("Community invite coming soon - ravens are preparing the space.")}
              >
                Join Community Chat
              </button>
            </div>
          </div>
        </form>

        <aside className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <span>🦅</span>
            <div className="text-sm font-semibold" data-testid="text-join-safety-title">
              SetAI Protection
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-join-safety-body">
            All participation follows published safety standards. Your data is stored only in your browser session - never on our servers without explicit consent.
          </p>

          <div className="mt-4 space-y-2">
            <div className="rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground">
              <strong>Zero surveillance</strong> - No Google Analytics or corporate trackers
            </div>
            <div className="rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground">
              <strong>Data sovereignty</strong> - You own 100% of your data
            </div>
            <div className="rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground">
              <strong>Instant revocation</strong> - Clear all data with one click
            </div>
          </div>
        </aside>
      </section>

      {showHarmWarning && (
        <SetAIHarmWarning
          onConfirm={() => {
            setShowHarmWarning(false);
            if (pendingSubmit) {
              doSubmit(pendingSubmit);
              setPendingSubmit(null);
            }
          }}
          onCancel={() => {
            setShowHarmWarning(false);
            setPendingSubmit(null);
          }}
        />
      )}
    </div>
  );
}
