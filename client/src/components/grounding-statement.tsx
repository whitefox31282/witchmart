import { CRISIS_RESOURCES, GROUNDING_STATEMENT } from "@/lib/setai-gate";

interface GroundingStatementProps {
  compact?: boolean;
}

export function GroundingStatement({ compact = false }: GroundingStatementProps) {
  if (compact) {
    return (
      <div className="rounded-xl border border-purple-700/30 bg-purple-900/10 p-4" data-testid="grounding-compact">
        <p className="text-xs text-parchment/80">
          Breathe. You are in control. You own this space.
          <br />
          <span className="text-parchment/60">
            Crisis: 988 (US) | Trans Lifeline: 877-565-8860 | Trevor: 866-488-7386
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-700/30 bg-purple-900/10 p-5" data-testid="grounding-full">
      <div className="flex items-start gap-3">
        <span className="text-2xl">🌿</span>
        <div>
          <p className="text-sm font-medium text-parchment">
            Breathe. You are in control. You own this space.
          </p>
          <p className="mt-2 text-xs text-parchment/70">
            If you need help now, reach out to these resources:
          </p>
          <ul className="mt-3 space-y-2">
            {CRISIS_RESOURCES.map((resource) => (
              <li key={resource.name} className="flex items-center gap-2 text-xs">
                <span className="text-purple-400">•</span>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-parchment hover:underline"
                >
                  {resource.name}
                </a>
                <span className="text-parchment/60">— {resource.phone}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
