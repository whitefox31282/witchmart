import { useState } from "react";

interface ScrollOfContinuityProps {
  onClose: () => void;
}

export default function ScrollOfContinuity({ onClose }: ScrollOfContinuityProps) {
  const [consent, setConsent] = useState(false);

  return (
    <div className="scroll" data-testid="scroll-of-continuity">
      <div className="scroll-header">
        <span className="scroll-title font-cinzel">Scroll of Continuity</span>
        <button onClick={onClose} aria-label="Close scroll" data-testid="button-close-scroll">
          ✕
        </button>
      </div>

      <p className="scroll-note">
        I own this creation. No exploitation. Data is transient.
      </p>
      <label className="scroll-consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          data-testid="checkbox-sovereignty"
        />
        Sovereignty upheld.
      </label>

      <div className="scroll-grid">
        <button className="scroll-action" disabled={!consent} data-testid="button-add-photo">
          📷 Add Photo
        </button>
        <button className="scroll-action" disabled={!consent} data-testid="button-add-text">
          ✏️ Add Text
        </button>
        <button className="scroll-action" disabled={!consent} data-testid="button-add-video">
          🎥 Add Video
        </button>
      </div>

      <div className="scroll-query">
        <label className="font-cinzel">Ask SetAI (the ravens hear you…)</label>
        <textarea
          disabled={!consent}
          placeholder="The ravens hear you..."
          rows={3}
          data-testid="textarea-setai-query"
        />
      </div>
    </div>
  );
}
