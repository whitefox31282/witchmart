/**
 * SetSlothBuddhaPose Component
 * Replaces all eagle imagery site-wide with Set the Sloth floating on his carpet in Buddha pose.
 * This is a canonical replacement per SetAI visual guidelines.
 */

interface SetSlothBuddhaPoseProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  glow?: boolean;
}

export default function SetSlothBuddhaPose({ 
  size = "md", 
  className = "",
  glow = true 
}: SetSlothBuddhaPoseProps) {
  const sizeMap = {
    sm: { sloth: "1.2rem", carpet: "2rem" },
    md: { sloth: "1.8rem", carpet: "3rem" },
    lg: { sloth: "2.5rem", carpet: "4rem" },
  };

  const dimensions = sizeMap[size];

  return (
    <div 
      className={`set-sloth-buddha ${className}`}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
      aria-label="Set the Sloth in Buddha pose on flying carpet"
      data-testid="set-sloth-buddha"
    >
      {/* Set the Sloth in Buddha pose */}
      <span 
        style={{ 
          fontSize: dimensions.sloth,
          filter: glow ? "drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))" : "none",
          animation: glow ? "slothFloat 4s ease-in-out infinite" : "none",
          zIndex: 2,
        }}
        role="img"
        aria-hidden="true"
      >
        🦥
      </span>
      
      {/* Magic carpet underneath */}
      <span 
        style={{ 
          fontSize: dimensions.carpet,
          marginTop: "-0.5em",
          filter: glow ? "drop-shadow(0 0 6px rgba(150, 100, 200, 0.5))" : "none",
          zIndex: 1,
        }}
        role="img"
        aria-hidden="true"
      >
        🪄
      </span>

      <style>{`
        @keyframes slothFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

/**
 * Inline version for use in text or tight spaces
 */
export function SetSlothInline({ className = "" }: { className?: string }) {
  return (
    <span 
      className={`set-sloth-inline ${className}`}
      style={{
        display: "inline-block",
        animation: "slothFloatInline 3s ease-in-out infinite",
      }}
      aria-label="Set the Sloth guardian"
      data-testid="set-sloth-inline"
    >
      🦥
      <style>{`
        @keyframes slothFloatInline {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </span>
  );
}
