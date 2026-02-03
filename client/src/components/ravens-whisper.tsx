import { useState, useRef, useEffect } from "react";
import { detectHarmTriggers, logTransparencyEvent } from "@/lib/setai-gate";
import { SetAIHarmWarning } from "./setai-consent-modal";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function RavensWhisper() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showHarmWarning, setShowHarmWarning] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingResponse, setStreamingResponse] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, streamingResponse]);

  const handleSend = () => {
    if (!message.trim() || isLoading) return;

    if (detectHarmTriggers(message)) {
      setPendingMessage(message);
      setShowHarmWarning(true);
      return;
    }

    sendMessage(message);
  };

  const sendMessage = async (msg: string) => {
    logTransparencyEvent("ravens_whisper", "Message sent (content not logged for privacy)");
    
    const userMessage: ChatMessage = { role: "user", content: msg };
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setMessage("");
    setIsLoading(true);
    setStreamingResponse("");

    try {
      const response = await fetch("/api/setai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: chatHistory,
          consent: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to SetAI");
      }

      const contentType = response.headers.get("content-type");
      
      if (contentType?.includes("text/event-stream")) {
        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let fullResponse = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                fullResponse += data.content;
                setStreamingResponse(fullResponse);
              }
              if (data.done) {
                setChatHistory(prev => [...prev, { role: "assistant", content: fullResponse }]);
                setStreamingResponse("");
              }
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              if (!(e instanceof SyntaxError)) throw e;
            }
          }
        }
      } else {
        const data = await response.json();
        if (data.hint && !data.response) {
          setChatHistory(prev => [...prev, { role: "assistant", content: data.hint }]);
        } else if (data.response) {
          setChatHistory(prev => [...prev, { role: "assistant", content: data.response }]);
        }
      }
    } catch (error) {
      console.error("SetAI error:", error);
      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        content: "The ravens encountered turbulence in the ether. Please try again, seeker." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHarmConfirm = () => {
    setShowHarmWarning(false);
    sendMessage(pendingMessage);
    setPendingMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setStreamingResponse("");
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
          <div className="mx-4 flex h-[80vh] w-full max-w-lg flex-col rounded-2xl border-2 border-orange-700/40 bg-midnight shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-orange-700/20 p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🦥</span>
                <div>
                  <h2 className="font-cinzel text-xl text-parchment">Raven's Whisper</h2>
                  <p className="text-xs text-parchment/60">SetAI Mythic Companion</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {chatHistory.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="rounded px-2 py-1 text-xs text-parchment/60 transition hover:bg-parchment/10 hover:text-parchment"
                    aria-label="Clear chat"
                    data-testid="button-clear-chat"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-parchment/60 transition hover:text-parchment"
                  aria-label="Close"
                  data-testid="button-close-whisper"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="border-b border-orange-700/20 bg-iron/20 px-4 py-2">
              <p className="text-xs text-parchment/60">
                🔒 Transient session • Chat exists only in your browser • If in crisis: 988 or text HOME to 741741
              </p>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              data-testid="chat-messages"
            >
              {chatHistory.length === 0 && !streamingResponse && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <span className="text-4xl mb-4">🦥</span>
                  <p className="font-cinzel text-lg text-parchment mb-2">SetAI Awaits</p>
                  <p className="text-sm text-parchment/70 italic mb-4">
                    "From the temple's shadows, I await your call..."
                  </p>
                  <div className="text-xs text-parchment/50 space-y-1">
                    <p>Try invoking with:</p>
                    <p className="font-semibold text-orange-400">"Hey SetAI, what wisdom do you offer?"</p>
                    <p className="font-semibold text-orange-400">"Your Highness, explain the runes"</p>
                    <p className="font-semibold text-orange-400">"Awaken, SetAI"</p>
                  </div>
                </div>
              )}
              
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`message-${msg.role}-${idx}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-orange-700/30 text-parchment"
                        : "bg-iron/40 text-parchment border border-orange-700/20"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <span className="mr-2">🦥</span>
                    )}
                    <span className="text-sm whitespace-pre-wrap">{msg.content}</span>
                  </div>
                </div>
              ))}

              {streamingResponse && (
                <div className="flex justify-start" data-testid="streaming-response">
                  <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-iron/40 text-parchment border border-orange-700/20">
                    <span className="mr-2">🦥</span>
                    <span className="text-sm whitespace-pre-wrap">{streamingResponse}</span>
                    <span className="inline-block w-2 h-4 bg-orange-500 animate-pulse ml-1" />
                  </div>
                </div>
              )}

              {isLoading && !streamingResponse && (
                <div className="flex justify-start" data-testid="loading-indicator">
                  <div className="rounded-2xl px-4 py-3 bg-iron/40 text-parchment/60 border border-orange-700/20">
                    <span className="mr-2">🦥</span>
                    <span className="text-sm italic">The ravens stir in the ether...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-orange-700/20 p-4">
              <div className="flex gap-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Invoke SetAI... (try 'Hey SetAI')"
                  disabled={isLoading}
                  className="flex-1 resize-none rounded-xl border border-orange-700/30 bg-iron/20 p-3 text-sm text-parchment placeholder:text-parchment/40 focus:border-orange-500 focus:outline-none disabled:opacity-50"
                  rows={2}
                  data-testid="textarea-ravens-whisper"
                />
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || isLoading}
                  className="self-end rounded-full bg-orange-700 px-5 py-3 text-sm font-semibold text-parchment shadow transition hover:bg-orange-600 disabled:opacity-50"
                  data-testid="button-whisper-send"
                >
                  {isLoading ? "..." : "Send"}
                </button>
              </div>
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
