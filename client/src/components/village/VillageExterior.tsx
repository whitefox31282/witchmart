import { useMemo } from "react";
import type { TentId } from "@/pages/norse-village";

interface VillageExteriorProps {
  onEnterTent: (tentId: TentId) => void;
}

const TENTS = [
  { id: "about" as TentId, name: "About WitchMart", runes: ["ᚨ", "ᛒ"] },
  { id: "sanctuary" as TentId, name: "Sanctuary Nodes", runes: ["ᛊ", "ᚾ"] },
  { id: "makers" as TentId, name: "Makers & Guilds", runes: ["ᛗ", "ᚷ"] },
  { id: "pricing" as TentId, name: "Pricing & Transparency", runes: ["ᛈ", "ᛏ"] },
  { id: "setai" as TentId, name: "SetAI", runes: ["ᛋ", "ᛁ"] },
  { id: "mission" as TentId, name: "Mission + Support", runes: ["ᛗ", "ᛊ"] },
  { id: "join" as TentId, name: "Join the Cooperative", runes: ["ᛃ", "ᚲ"] },
];

interface TentProps {
  tentName: string;
  tentId: TentId;
  runes: string[];
  onClick: (tentId: TentId) => void;
  isActive?: boolean;
}

function Tent({ tentName, tentId, runes, onClick, isActive = false }: TentProps) {
  return (
    <button
      className={`tent-portal ${isActive ? "tent-active" : ""}`}
      onClick={() => onClick(tentId)}
      aria-label={`Enter ${tentName} tent`}
      data-testid={`tent-${tentId}`}
    >
      <div className="tent-structure">
        {/* Wooden support poles */}
        <div className="tent-pole tent-pole-left" />
        <div className="tent-pole tent-pole-right" />
        <div className="tent-pole tent-pole-center" />
        
        {/* Rope lashings at top */}
        <div className="tent-rope-lashing" />
        
        {/* Layered canvas folds for depth */}
        <div className="tent-canvas-layer tent-canvas-back" />
        <div className="tent-canvas-layer tent-canvas-mid" />
        <div className="tent-canvas-layer tent-canvas-front" />
        
        {/* Tent entrance opening */}
        <div className="tent-entrance" />
        
        {/* Glowing runes on each side */}
        <div className="tent-runes tent-runes-left">
          {runes.map((rune, i) => (
            <span key={i} className="tent-rune">{rune}</span>
          ))}
        </div>
        <div className="tent-runes tent-runes-right">
          {runes.map((rune, i) => (
            <span key={i} className="tent-rune">{rune}</span>
          ))}
        </div>
        
        {/* Torchlight glow effect */}
        <div className="tent-glow" />
        <div className="tent-interior-glow" />
      </div>
      
      {/* Hide/leather sign with tent name */}
      <div className="tent-hide-sign">
        <div className="tent-sign-rope tent-sign-rope-left" />
        <div className="tent-sign-rope tent-sign-rope-right" />
        <div className="tent-sign-hide">
          <span>{tentName}</span>
        </div>
      </div>
    </button>
  );
}

export default function VillageExterior({ onEnterTent }: VillageExteriorProps) {
  const stars = useMemo(() => 
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 40,
      delay: Math.random() * 4,
      size: 1 + Math.random() * 2,
    })), 
  []);

  const smokeParticles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      delay: Math.random() * 8,
      size: 15 + Math.random() * 20,
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
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
          />
        ))}
      </div>

      {/* Aurora effect */}
      <div className="village-aurora" />

      <div className="village-smoke">
        {smokeParticles.map((particle) => (
          <div
            key={particle.id}
            className="smoke-particle"
            style={{
              left: `${particle.x}%`,
              animationDelay: `${particle.delay}s`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
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
          <Tent
            key={tent.id}
            tentId={tent.id}
            tentName={tent.name}
            runes={tent.runes}
            onClick={onEnterTent}
          />
        ))}
      </div>
    </div>
  );
}
