import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { InsertContactSubmission } from "@shared/schema";

export default function ContactSupport() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: InsertContactSubmission) => {
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
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
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
    submitMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
  };

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-contact-title">
          Contact / Support
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-contact-subtitle">
          Send us a message and we'll respond as soon as possible.
        </p>
      </header>

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
                placeholder="How can we help?"
                data-testid="input-contact-message"
                required
              />
            </label>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="wm-focus-ring inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-95 disabled:opacity-50"
              data-testid="button-contact-submit"
            >
              {submitMutation.isPending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>

        <aside className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-contact-support-title">
            Support info
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-contact-support-body">
            Email: support@witchmart.org
            <br />
            <br />
            Community Discord and social links coming soon.
          </p>

          <div className="mt-4 rounded-xl border bg-background/60 p-4 text-xs text-muted-foreground" data-testid="text-contact-disclaimer">
            Your message will be saved and reviewed by our team.
          </div>
        </aside>
      </section>
    </div>
  );
}
