import { useState } from "react";
import { detectHarmTriggers, logTransparencyEvent } from "@/lib/setai-gate";
import { SetAIHarmWarning } from "./setai-consent-modal";

export function RavensWhisper() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showHarmWarning, setShowHarmWarning] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;

    if (detectHarmTriggers(message)) {
      setPendingMessage(message);
      setShowHarmWarning(true);
      return;
    }

    sendMessage(message);
  };

  const sendMessage = (msg: string) => {
    logTransparencyEvent("ravens_whisper", "Message sent (content not logged for privacy)");
    // Placeholder - in future this could connect to a real chat system
    alert("The ravens have received your whisper. This feature is coming soon.");
    setMessage("");
    setIsOpen(false);
  };

  const handleHarmConfirm = () => {
    setShowHarmWarning(false);
    sendMessage(pendingMessage);
    setPendingMessage("");
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-midnight px-4 py-3 text-parchment shadow-lg transition hover:bg-midnight/80 hover:shadow-xl"
        data-testid="button-ravens-whisper"
        aria-label="Open Raven's Whisper"
      >
        <span className="text-xl">🦥</span>
        <span className="font-cinzel text-sm">Whisper</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" data-testid="modal-ravens-whisper">
          <div className="mx-4 w-full max-w-md rounded-2xl border-2 border-orange-700/40 bg-midnight p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🦥</span>
                <h2 className="font-cinzel text-xl text-parchment">Raven's Whisper</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-parchment/60 transition hover:text-parchment"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="mt-4 text-sm italic text-parchment/70">
              The ravens watch. Speak your truth.
            </p>

            <div className="mt-4 rounded-xl border border-orange-700/20 bg-iron/30 p-3">
              <p className="text-xs text-parchment/60">
                This is a safe space. Your message is transient and not stored permanently.
                If you're in crisis, call 988 or text HOME to 741741.
              </p>
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What weighs on your spirit?"
              className="mt-4 h-32 w-full resize-none rounded-xl border border-orange-700/30 bg-iron/20 p-3 text-sm text-parchment placeholder:text-parchment/40 focus:border-orange-500 focus:outline-none"
              data-testid="textarea-ravens-whisper"
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-parchment/30 px-4 py-2 text-sm text-parchment transition hover:bg-parchment/10"
                data-testid="button-whisper-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="rounded-full bg-orange-700 px-4 py-2 text-sm font-semibold text-parchment shadow transition hover:bg-orange-600 disabled:opacity-50"
                data-testid="button-whisper-send"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Harm Warning */}
      {showHarmWarning && (
        <SetAIHarmWarning
          onConfirm={handleHarmConfirm}
          onCancel={() => {
            setShowHarmWarning(false);
            setPendingMessage("");
          }}
        />
      )}
    </>
  );
}
