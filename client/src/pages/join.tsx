import { useMemo, useState } from "react";

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

  const copy = useMemo(() => ROLE_COPY[role], [role]);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-join-title">
          Join / Get Involved
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-join-subtitle">
          Choose how you want to participate. This is a prototype signup flow (no data is sent).
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold" data-testid="text-join-picker-title">
            Membership path
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["Community", "Maker", "Guild", "Node Owner"] as Role[]).map((r) => (
              <button
                key={r}
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
                  Name
                </span>
                <input
                  className="wm-focus-ring rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                  placeholder="Your name"
                  data-testid="input-name"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-semibold" data-testid="text-label-email">
                  Email
                </span>
                <input
                  className="wm-focus-ring rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                  placeholder="you@domain.com"
                  data-testid="input-email"
                />
              </label>
              <label className="grid gap-1.5 md:col-span-2">
                <span className="text-xs font-semibold" data-testid="text-label-notes">
                  Notes (optional)
                </span>
                <textarea
                  className="wm-focus-ring min-h-28 rounded-xl border bg-background px-3 py-2 text-sm shadow-sm"
                  placeholder="What are you hoping to build or join?"
                  data-testid="input-notes"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                className="wm-focus-ring inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-95"
                data-testid="button-submit-signup"
                onClick={() => alert("Prototype: signup submitted (no data sent).")}
              >
                Submit (prototype)
              </button>
              <button
                className="wm-focus-ring inline-flex items-center justify-center rounded-full border bg-card px-5 py-3 text-sm font-semibold shadow-sm hover:bg-muted/60"
                data-testid="button-discord-invite"
                onClick={() => alert("Placeholder: add Discord/community invite link.")}
              >
                Discord / Community Invite
              </button>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-join-safety-title">
            Up-front safety
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-join-safety-body">
            All participation must follow published safety standards and local laws. This site is for coordination and transparency.
          </p>

          <div className="mt-4 rounded-xl border bg-background/60 p-4 text-xs text-muted-foreground" data-testid="text-join-disclaimer">
            Disclaimer: prototype only. No backend signup has been connected yet.
          </div>
        </aside>
      </section>
    </div>
  );
}
