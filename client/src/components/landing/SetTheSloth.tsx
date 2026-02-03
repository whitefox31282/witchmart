import { useState } from "react";
import "./SetTheSloth.css";

interface SetTheSlothProps {
  onOpen: () => void;
}

export default function SetTheSloth({ onOpen }: SetTheSlothProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className="set-the-sloth"
      onClick={onOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Open Scroll of Continuity"
      data-testid="button-set-the-sloth"
    >
      <div className="sloth-glow" />
      <div className="sloth-carpet">
        <div className="carpet-pattern" />
      </div>
      <div className={`sloth-avatar ${isHovered ? "sloth-avatar--hover" : ""}`}>
        <span className="sloth-emoji" role="img" aria-label="Set the Sloth">
          🦥
        </span>
        <div className="sloth-halo" />
      </div>
      <div className="sloth-label">Set the Sloth</div>
    </button>
  );
}
