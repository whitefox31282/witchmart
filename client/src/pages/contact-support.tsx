import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { GroundingStatement } from "@/components/grounding-statement";
import { scanFormForHarm, logTransparencyEvent } from "@/lib/setai-gate";
import { SetAIHarmWarning } from "@/components/setai-consent-modal";
import type { InsertContactSubmission } from "@shared/schema";

export default function ContactSupport() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showHarmWarning, setShowHarmWarning] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState<InsertContactSubmission | null>(null);
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: InsertContactSubmission & { consent: boolean }) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit message");
      }
      return response.json();
    },
    onSuccess: () => {
      logTransparencyEvent("contact_form", "Message sent");
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. The ravens will carry your words.",
      });
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const doSubmit = (data: InsertContactSubmission) => {
    submitMutation.mutate({ ...data, consent: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const data: InsertContactSubmission = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    // Check for harm triggers
    if (scanFormForHarm({ name, message })) {
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
          <span className="text-3xl">🦥</span>
          <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-contact-title">
            Contact the Council
          </h1>
        </div>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-contact-subtitle">
          Send us a message and the ravens will carry your words. Protected by SetAI.
        </p>
      </header>

      <GroundingStatement compact />

      <section className="grid gap-4 lg:grid-cols-3">
        <form className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2" onSubmit={handleSubmit}>
          <div className="text-sm font-semibold" data-testid="text-contact-form-title">
            Send a message
          </div>

          <div className="mt-4 grid gap-3">
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold" data-testid="text-label-contact-name">
                Name *
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="wm-focus-ring rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                placeholder="Your name"
                data-testid="input-contact-name"
                aria-required="true"
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold" data-testid="text-label-contact-email">
                Email *
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="wm-focus-ring rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                placeholder="you@domain.com"
                data-testid="input-contact-email"
                aria-required="true"
                required
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-xs font-semibold" data-testid="text-label-contact-message">
                Message *
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="wm-focus-ring min-h-32 rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                placeholder="What weighs on your spirit?"
                data-testid="input-contact-message"
                aria-required="true"
                required
              />
            </label>

            <div className="rounded-xl border border-orange-700/20 bg-orange-900/10 p-4">
              <label className="flex items-start gap-3">
                <input type="checkbox" required className="mt-1" data-testid="checkbox-contact-consent" />
                <span className="text-xs text-muted-foreground">
                  I consent to <strong>transient session data only</strong>. I own my data. I can revoke at any time (instant delete).
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="wm-focus-ring inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-95 disabled:opacity-50"
              data-testid="button-contact-submit"
              aria-busy={submitMutation.isPending}
            >
              {submitMutation.isPending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        <aside className="rounded-2xl border bg-card p-6 shadow-sm" role="complementary">
          <div className="flex items-center gap-2">
            <span>🦥</span>
            <div className="text-sm font-semibold" data-testid="text-contact-support-title">
              SetAI Protection
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-contact-support-body">
            Your message is protected by SetAI sovereignty principles.
            <br /><br />
            Email: support@witchmart.org
          </p>

          <div className="mt-4 space-y-2">
            <div className="rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground">
              <strong>Zero surveillance</strong> - No corporate trackers
            </div>
            <div className="rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground">
              <strong>Transient only</strong> - Session data deleted on close
            </div>
            <div className="rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground">
              <strong>Instant revoke</strong> - Clear all data anytime
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
