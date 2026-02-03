import { useMemo } from "react";
import type { TentId } from "@/pages/norse-village";

interface VillageExteriorProps {
  onEnterTent: (tentId: TentId) => void;
}

const TENTS = [
  { id: "about" as TentId, name: "About WitchMart" },
  { id: "sanctuary" as TentId, name: "Sanctuary Nodes" },
  { id: "makers" as TentId, name: "Makers & Guilds" },
  { id: "pricing" as TentId, name: "Pricing & Transparency" },
  { id: "setai" as TentId, name: "SetAI" },
  { id: "mission" as TentId, name: "Mission + Support" },
  { id: "join" as TentId, name: "Join the Cooperative" },
];

export default function VillageExterior({ onEnterTent }: VillageExteriorProps) {
  const stars = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 35,
      delay: Math.random() * 4,
    })), 
  []);

  const smokeParticles = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      delay: Math.random() * 8,
    })),
  []);

  return (
    <div className="village-exterior" data-testid="village-exterior">
      <div className="village-sky" />
      
      <div className="village-stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="village-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="village-smoke">
        {smokeParticles.map((particle) => (
          <div
            key={particle.id}
            className="smoke-particle"
            style={{
              left: `${particle.x}%`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="village-ground" />

      <div className="village-title">
        <h1>WitchMart</h1>
        <p>A People-Powered, Pagan-Aligned Cooperative Economy</p>
      </div>

      <div className="tent-grid">
        {TENTS.map((tent) => (
          <button
            key={tent.id}
            className="tent-portal"
            onClick={() => onEnterTent(tent.id)}
            aria-label={`Enter ${tent.name} tent`}
            data-testid={`tent-${tent.id}`}
          >
            <div className="tent-structure">
              <div className="tent-pole" />
              <div className="tent-flag" />
              <div className="tent-canvas" />
              <div className="tent-glow" />
            </div>
            <div className="tent-sign">
              <span>{tent.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
