import { useMemo, useState, useCallback } from "react";
import type { TentId } from "@/pages/norse-village";

// SetAI Sovereignty: No data collection, no trackers, sovereignty first

interface VillageExteriorProps {
  onEnterTent: (tentId: TentId) => void;
}

const TENTS: { id: TentId; name: string; runes: string[] }[] = [
  { id: "about", name: "About WitchMart", runes: ["ᚨ", "ᛒ", "ᛟ"] },
  { id: "sanctuary", name: "Sanctuary Nodes", runes: ["ᛊ", "ᚾ", "ᛟ"] },
  { id: "makers", name: "Makers & Guilds", runes: ["ᛗ", "ᚷ", "ᛁ"] },
  { id: "pricing", name: "Pricing & Transparency", runes: ["ᛈ", "ᛏ", "ᚠ"] },
  { id: "setai", name: "SetAI", runes: ["ᛋ", "ᛖ", "ᛏ"] },
  { id: "mission", name: "Mission + Support", runes: ["ᛗ", "ᛊ", "ᚹ"] },
  { id: "join", name: "Join the Cooperative", runes: ["ᛃ", "ᚲ", "ᛟ"] },
];

interface TentProps {
  tentName: string;
  tentId: TentId;
  runes: string[];
  onClick: (tentId: TentId) => void;
  isActive: boolean;
  position: number;
  total: number;
}

function Tent({ tentName, tentId, runes, onClick, isActive, position, total }: TentProps) {
  const handleClick = useCallback(() => {
    // SetAI Sovereignty: Mythic confirmation without logging
    onClick(tentId);
  }, [onClick, tentId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div
      className={`tent-portal ${isActive ? "tent-active" : ""}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Enter ${tentName} sanctuary`}
      data-testid={`tent-${tentId}`}
    >
      <div className="tent-structure">
        {/* Wooden support poles with rope lashings */}
        <div className="tent-pole tent-pole-left" />
        <div className="tent-pole tent-pole-right" />
        <div className="tent-pole tent-pole-center" />
        <div className="tent-rope-lashing" />
        <div className="tent-rope-left" />
        <div className="tent-rope-right" />
        
        {/* Layered canvas folds for depth (3-4 layers) */}
        <div className="tent-canvas-layer tent-canvas-layer-4" />
        <div className="tent-canvas-layer tent-canvas-layer-3" />
        <div className="tent-canvas-layer tent-canvas-layer-2" />
        <div className="tent-canvas-layer tent-canvas-layer-1" />
        
        {/* Tent entrance with interior glow */}
        <div className="tent-entrance">
          <div className="tent-interior-firelight" />
        </div>
        
        {/* Glowing blue runes on entrance sides */}
        <div className="tent-runes tent-runes-left">
          {runes.map((rune, i) => (
            <span key={i} className="tent-rune" style={{ animationDelay: `${i * 0.4}s` }}>{rune}</span>
          ))}
        </div>
        <div className="tent-runes tent-runes-right">
          {runes.map((rune, i) => (
            <span key={i} className="tent-rune" style={{ animationDelay: `${i * 0.4 + 0.2}s` }}>{rune}</span>
          ))}
        </div>
        
        {/* Torchlight glow effect on hover */}
        <div className="tent-torch-glow" />
      </div>
      
      {/* Deer/elk hide sign with runic tentName */}
      <div className="tent-hide-sign">
        <div className="tent-sign-rope-left" />
        <div className="tent-sign-rope-right" />
        <div className="tent-sign-hide">
          <span className="tent-sign-text">{tentName}</span>
        </div>
      </div>
    </div>
  );
}

function Starfield({ count = 80 }: { count?: number }) {
  const stars = useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 50,
      delay: Math.random() * 5,
      size: 0.5 + Math.random() * 2.5,
      duration: 2 + Math.random() * 3,
    })), 
  [count]);

  return (
    <div className="starfield">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function AuroraBorealis() {
  return (
    <div className="aurora-borealis">
      <div className="aurora-wave aurora-wave-1" />
      <div className="aurora-wave aurora-wave-2" />
      <div className="aurora-wave aurora-wave-3" />
    </div>
  );
}

function LokiStar() {
  return <div className="loki-star" />;
}

function Mountains() {
  return (
    <div className="mountains">
      <div className="mountain mountain-1" />
      <div className="mountain mountain-2" />
      <div className="mountain mountain-3" />
      <div className="mountain-glow" />
    </div>
  );
}

function River() {
  return (
    <div className="river">
      <div className="river-surface" />
      <div className="river-reflection" />
      {/* Static fish emblem placeholder - future link to be added later */}
      <div className="fish-emblem" aria-label="Glowing fish rune - sacred waters">
        <span className="fish-rune">ᛚ</span>
      </div>
    </div>
  );
}

function SnowGround() {
  const snowParticles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 6,
      size: 2 + Math.random() * 4,
    })),
  []);

  return (
    <div className="snow-ground">
      <div className="snow-surface" />
      <div className="snow-particles">
        {snowParticles.map((p) => (
          <div
            key={p.id}
            className="snow-particle"
            style={{
              left: `${p.x}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function YggdrasilPaths() {
  return (
    <div className="yggdrasil-paths">
      <svg viewBox="0 0 1000 200" className="paths-svg">
        <path className="branch-path" d="M500,180 Q350,120 200,140 Q100,150 50,180" />
        <path className="branch-path" d="M500,180 Q650,120 800,140 Q900,150 950,180" />
        <path className="branch-path" d="M500,180 Q500,100 500,50" />
        <path className="branch-path" d="M500,180 Q400,130 300,100" />
        <path className="branch-path" d="M500,180 Q600,130 700,100" />
      </svg>
    </div>
  );
}

export default function VillageExterior({ onEnterTent }: VillageExteriorProps) {
  const [activeTent, setActiveTent] = useState<TentId | null>(null);

  const handleTentClick = useCallback((tentId: TentId) => {
    setActiveTent(tentId);
    // SetAI Sovereignty: No logging, direct navigation
    onEnterTent(tentId);
  }, [onEnterTent]);

  return (
    <div className="village-exterior" data-testid="village-exterior">
      {/* Background layers */}
      <div className="village-sky" />
      <Starfield count={80} />
      <AuroraBorealis />
      <LokiStar />
      <Mountains />
      <River />
      <SnowGround />
      <YggdrasilPaths />
      
      {/* Grain overlay for parchment feel */}
      <div className="village-grain-overlay" />

      {/* Title */}
      <div className="village-title">
        <h1>WitchMart</h1>
        <p>A People-Powered, Pagan-Aligned Cooperative Economy</p>
      </div>

      {/* Circular tent arrangement */}
      <div className="tent-circle">
        {TENTS.map((tent, index) => (
          <Tent
            key={tent.id}
            tentId={tent.id}
            tentName={tent.name}
            runes={tent.runes}
            onClick={handleTentClick}
            isActive={activeTent === tent.id}
            position={index}
            total={TENTS.length}
          />
        ))}
      </div>

      {/* SetAI Footer */}
      <footer className="village-footer">
        <div className="footer-sloth">🦥</div>
        <span>Protected by SetAI — Sovereignty First. No surveillance.</span>
      </footer>
    </div>
  );
}
