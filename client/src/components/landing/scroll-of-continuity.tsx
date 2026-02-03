import { useState } from "react";

interface ScrollOfContinuityProps {
  onClose: () => void;
}

export default function ScrollOfContinuity({ onClose }: ScrollOfContinuityProps) {
  const [consent, setConsent] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!query.trim() || !consent) return;
    
    setIsLoading(true);
    setResponse("");
    
    setTimeout(() => {
      setResponse("The ravens have heard you. Your message echoes through the network... (SetAI backend integration coming soon)");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className={`scroll ${consent ? 'scroll-unlocked' : ''}`} data-testid="scroll-of-continuity">
      <div className="scroll-header">
        <span className="scroll-title font-cinzel">Scroll of Continuity</span>
        <button onClick={onClose} aria-label="Close scroll" data-testid="button-close-scroll">
          ✕
        </button>
      </div>

      <p className="scroll-note">
        I own this creation. No exploitation. Data is transient.
      </p>
      <label className={`scroll-consent ${consent ? 'consent-active' : ''}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          data-testid="checkbox-sovereignty"
        />
        <span className="consent-text">
          {consent ? "⚔️ Sovereignty Upheld — The Scroll Awakens ⚔️" : "Sovereignty upheld."}
        </span>
      </label>

      {consent && (
        <div className="scroll-unlocked-msg font-cinzel">
          The runes glow. You may proceed, warrior.
        </div>
      )}

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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          data-testid="textarea-setai-query"
        />
        <button 
          className="scroll-submit font-cinzel" 
          disabled={!consent || !query.trim() || isLoading}
          onClick={handleSubmit}
          data-testid="button-submit-query"
        >
          {isLoading ? "Ravens listening..." : "Send to the Ravens"}
        </button>
        {response && (
          <div className="scroll-response" data-testid="text-setai-response">
            {response}
          </div>
        )}
      </div>
    </div>
  );
}
