import { useState, useEffect, useRef } from "react";
import { X, Camera, FileText, Video } from "lucide-react";
import "./ScrollOfContinuity.css";

interface ScrollOfContinuityProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScrollOfContinuity({ isOpen, onClose }: ScrollOfContinuityProps) {
  const [sovereigntyChecked, setSovereigntyChecked] = useState(false);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.focus();
    }
  }, [isOpen]);

  const handleAction = (action: string) => {
    if (!sovereigntyChecked) return;
    console.log(`Action: ${action}`);
  };

  const handleSubmit = () => {
    if (!sovereigntyChecked || !message.trim()) return;
    console.log("SetAI message:", message);
    setMessage("");
  };

  if (!isOpen) return null;

  return (
    <div className="scroll-overlay" onClick={onClose} data-testid="scroll-overlay">
      <div
        ref={scrollRef}
        className="scroll-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Scroll of Continuity"
        tabIndex={-1}
        data-testid="scroll-of-continuity"
      >
        <div className="scroll-cap scroll-cap--top" />
        
        <div className="scroll-parchment">
          <button
            className="scroll-close"
            onClick={onClose}
            aria-label="Close scroll"
            data-testid="button-close-scroll"
          >
            <X size={20} />
          </button>

          <h2 className="scroll-title">Scroll of Continuity</h2>

          <label className="sovereignty-checkbox">
            <input
              type="checkbox"
              checked={sovereigntyChecked}
              onChange={(e) => setSovereigntyChecked(e.target.checked)}
              data-testid="checkbox-sovereignty"
            />
            <span className="sovereignty-check" />
            <span className="sovereignty-text">
              I own this creation. No exploitation. Data is transient.
            </span>
          </label>

          {sovereigntyChecked && (
            <div className="sovereignty-confirmed">
              ⚔️ Sovereignty Upheld — The Scroll Awakens ⚔️
            </div>
          )}

          <div className="scroll-actions">
            <button
              className="scroll-action-btn"
              onClick={() => handleAction("photo")}
              disabled={!sovereigntyChecked}
              data-testid="button-add-photo"
            >
              <Camera size={18} />
              <span>Add Photo</span>
            </button>
            <button
              className="scroll-action-btn"
              onClick={() => handleAction("text")}
              disabled={!sovereigntyChecked}
              data-testid="button-add-text"
            >
              <FileText size={18} />
              <span>Add Text</span>
            </button>
            <button
              className="scroll-action-btn"
              onClick={() => handleAction("video")}
              disabled={!sovereigntyChecked}
              data-testid="button-add-video"
            >
              <Video size={18} />
              <span>Add Video</span>
            </button>
          </div>

          <div className="scroll-setai">
            <label className="scroll-setai-label" htmlFor="setai-input">
              Ask SetAI <span className="ravens-whisper">(the ravens hear you…)</span>
            </label>
            <textarea
              id="setai-input"
              className="scroll-setai-input"
              placeholder="The ravens hear you..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!sovereigntyChecked}
              rows={3}
              data-testid="textarea-setai"
            />
            <button
              className="scroll-submit-btn"
              onClick={handleSubmit}
              disabled={!sovereigntyChecked || !message.trim()}
              data-testid="button-submit-setai"
            >
              Send to the Ravens
            </button>
          </div>
        </div>

        <div className="scroll-cap scroll-cap--bottom" />
      </div>
    </div>
  );
}
