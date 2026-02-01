import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Network upkeep", value: 42 },
  { name: "Node support", value: 28 },
  { name: "Justice / legal fund", value: 18 },
  { name: "Accessibility & grants", value: 12 },
];

const COLORS = ["#3D5A40", "#D4AF37", "#5E4636", "#2F4B3A"];

export default function PricingTransparency() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="wm-hero-title text-3xl font-semibold" data-testid="text-pricing-title">
          Pricing & Transparency
        </h1>
        <p className="max-w-3xl text-sm text-muted-foreground" data-testid="text-pricing-subtitle">
          Placeholder model overview: clear pricing rules, “where your dollar goes,” and public reporting.
        </p>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-pricing-chart-title">
            Where Your Dollar Goes (placeholder)
          </div>
          <div className="mt-4 h-64" data-testid="chart-where-dollar-goes">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {data.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 text-xs text-muted-foreground" data-testid="text-pricing-chart-note">
            Note: percentages and categories are placeholders.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="text-sm font-semibold" data-testid="text-pricing-model-title">
            Pricing Model (placeholder)
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {[
              "Member-first pricing with transparent coop fees.",
              "Clear caps to prevent extraction.",
              "Sliding-scale options where appropriate.",
              "Quarterly public reporting and open ledgers (links placeholder).",
            ].map((line, idx) => (
              <li key={idx} className="rounded-xl border bg-background/60 p-3" data-testid={`text-pricing-line-${idx}`}>
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-xl border bg-background/60 p-3 text-xs text-muted-foreground" data-testid="text-pricing-justice">
            Justice/legal fund placeholder: support for community defense, worker protection, and cooperative integrity.
          </div>
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-6 shadow-sm">
        <div className="text-sm font-semibold" data-testid="text-pricing-ledgers-title">
          Open Ledgers & Reports
        </div>
        <p className="mt-2 text-sm text-muted-foreground" data-testid="text-pricing-ledgers-body">
          Placeholder: links to quarterly reports, spending summaries, and governance minutes.
        </p>
      </section>
    </div>
  );
}
