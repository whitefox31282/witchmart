import { Download } from "lucide-react";

const guides = [
  { id: "sg-1", title: "Community Safety Basics (placeholder)", kind: "PDF" },
  { id: "sg-2", title: "Event Hosting Checklist (placeholder)", kind: "PDF" },
  { id: "sg-3", title: "Do-Not-Do Protocols (placeholder)", kind: "PDF" },
];

export default function SafetyCertification() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-safety-title">
          Safety & Certification
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-safety-subtitle">
          Clear guidance, community standards, and disclaimers—visible everywhere.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold" data-testid="text-safety-process-title">
            Certification Process (placeholder)
          </div>
          <p className="mt-2 text-sm text-muted-foreground" data-testid="text-safety-process-body">
            Placeholder: community review, safety training requirements, reputation signals, and remediation steps.
          </p>

          <div className="mt-4 rounded-xl border bg-background/60 p-4 text-sm" data-testid="text-safety-legal-loki">
            <div className="font-semibold">Legal Loki role (placeholder)</div>
            <div className="mt-1 text-muted-foreground">
              Placeholder: boundary-setting, risk flags, and responsible disclaimers.
            </div>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-safety-downloads-title">
            Downloadable Guides
          </div>
          <div className="mt-3 space-y-2">
            {guides.map((g) => (
              <button
                key={g.id}
                className="wm-focus-ring flex w-full items-center justify-between rounded-xl border bg-background/60 px-3 py-2 text-sm hover:bg-muted/60"
                data-testid={`button-download-${g.id}`}
                onClick={() => {
                  // placeholder: no files yet
                  alert("Download placeholder: add real guide files next.");
                }}
              >
                <span>{g.title}</span>
                <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                  {g.kind}
                  <Download className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold" data-testid="text-safety-disclaimer-title">
          Disclaimers
        </div>
        <p className="mt-2 text-sm text-muted-foreground" data-testid="text-safety-disclaimer-body">
          This prototype does not provide legal, medical, or professional advice. All participation is voluntary. Follow local laws
          and published safety guidance.
        </p>
      </section>
    </div>
  );
}
