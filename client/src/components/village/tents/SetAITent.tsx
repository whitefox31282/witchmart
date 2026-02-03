import { useState } from "react";
import { Camera, FileText, Video } from "lucide-react";
import BackToVillage from "../BackToVillage";

interface SetAITentProps {
  onReturn: () => void;
}

export default function SetAITent({ onReturn }: SetAITentProps) {
  const [sovereigntyChecked, setSovereigntyChecked] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = (action: string) => {
    if (!sovereigntyChecked) return;
    console.log(`Action: ${action}`);
  };

  const handleSubmit = () => {
    if (!sovereigntyChecked || !message.trim()) return;
    setIsLoading(true);
    setResponse("");
    
    setTimeout(() => {
      setResponse("The ravens have heard you. Your message echoes through the network...");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="tent-interior tent-mystic" data-testid="tent-setai">
      <BackToVillage onReturn={onReturn} />
      
      <div className="tent-content">
        <header className="tent-header">
          <h1>SetAI</h1>
          <p>The Mystic Seer's Tent</p>
        </header>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: "5rem",
            animation: "slothFloat 4s ease-in-out infinite",
            filter: "drop-shadow(0 0 20px rgba(212, 175, 55, 0.5))"
          }}>
            🦥
          </div>
          <p style={{ color: "#d4af37", fontFamily: "'Cinzel', serif", marginTop: 8 }}>
            Set the Sloth
          </p>
          <p style={{ color: "#a89070", fontSize: "0.9rem" }}>
            Guardian of the Scroll
          </p>
        </div>

        <style>{`
          @keyframes slothFloat {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-12px); }
          }
        `}</style>

        <div className="scroll-display" style={{ maxWidth: 500, margin: "0 auto" }}>
          <h2 style={{ 
            fontFamily: "'Cinzel', serif", 
            color: "#3d2e0f", 
            textAlign: "center",
            marginBottom: 20
          }}>
            Scroll of Continuity
          </h2>

          <label style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            padding: 16,
            background: "rgba(139, 105, 20, 0.1)",
            borderRadius: 8,
            cursor: "pointer",
            marginBottom: 16
          }}>
            <input
              type="checkbox"
              checked={sovereigntyChecked}
              onChange={(e) => setSovereigntyChecked(e.target.checked)}
              style={{ marginTop: 4 }}
              data-testid="checkbox-sovereignty"
            />
            <span style={{ color: "#5a4510", fontSize: "0.95rem", lineHeight: 1.5 }}>
              I own this creation. No exploitation. Data is transient.
            </span>
          </label>

          {sovereigntyChecked && (
            <div style={{
              textAlign: "center",
              padding: 12,
              color: "#8b6914",
              animation: "glowText 2s ease-in-out infinite"
            }}>
              ⚔️ Sovereignty Upheld — The Scroll Awakens ⚔️
            </div>
          )}

          <style>{`
            @keyframes glowText {
              0%, 100% { text-shadow: 0 0 4px rgba(139, 105, 20, 0.4); }
              50% { text-shadow: 0 0 12px rgba(139, 105, 20, 0.8); }
            }
          `}</style>

          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[
              { icon: Camera, label: "Add Photo", action: "photo" },
              { icon: FileText, label: "Add Text", action: "text" },
              { icon: Video, label: "Add Video", action: "video" },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                disabled={!sovereigntyChecked}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: 12,
                  background: sovereigntyChecked ? "rgba(139, 105, 20, 0.1)" : "rgba(0,0,0,0.05)",
                  border: "1px solid #8b6914",
                  borderRadius: 8,
                  color: sovereigntyChecked ? "#5a4510" : "#999",
                  cursor: sovereigntyChecked ? "pointer" : "not-allowed",
                  fontSize: "0.8rem"
                }}
                data-testid={`button-${action}`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div>
            <label style={{ 
              display: "block", 
              color: "#3d2e0f", 
              fontWeight: 600,
              marginBottom: 8
            }}>
              Ask SetAI <span style={{ fontWeight: 400, fontStyle: "italic", color: "#8b6914" }}>(the ravens hear you…)</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="The ravens hear you..."
              disabled={!sovereigntyChecked}
              rows={3}
              style={{
                width: "100%",
                padding: 12,
                background: sovereigntyChecked ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.05)",
                border: "1px solid #8b6914",
                borderRadius: 8,
                color: "#3d2e0f",
                fontSize: "0.95rem",
                resize: "none",
                cursor: sovereigntyChecked ? "text" : "not-allowed"
              }}
              data-testid="textarea-setai"
            />
            <button
              onClick={handleSubmit}
              disabled={!sovereigntyChecked || !message.trim() || isLoading}
              style={{
                width: "100%",
                marginTop: 12,
                padding: 14,
                background: sovereigntyChecked ? "linear-gradient(135deg, #8b6914 0%, #d4af37 100%)" : "#ccc",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                fontWeight: 600,
                cursor: sovereigntyChecked && message.trim() ? "pointer" : "not-allowed",
                opacity: isLoading ? 0.7 : 1
              }}
              data-testid="button-submit-setai"
            >
              {isLoading ? "Ravens listening..." : "Send to the Ravens"}
            </button>

            {response && (
              <div style={{
                marginTop: 16,
                padding: 16,
                background: "rgba(139, 105, 20, 0.1)",
                borderRadius: 8,
                color: "#5a4510",
                fontStyle: "italic"
              }} data-testid="text-setai-response">
                {response}
              </div>
            )}
          </div>
        </div>

        <div className="runestone" style={{ marginTop: 32, textAlign: "center" }}>
          <h3>Sovereignty Rules</h3>
          <p>
            No surveillance. No tracking. No cookies. Your data is transient and owned entirely by you.
          </p>
        </div>
      </div>
    </div>
  );
}
