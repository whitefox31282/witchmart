import { useState } from "react";
import { revokeAllData, logTransparencyEvent } from "@/lib/setai-gate";
import { Link } from "wouter";

export function SetAIFooter() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRevoke = () => {
    if (showConfirm) {
      logTransparencyEvent("consent_revoked", "User revoked all consent and data");
      revokeAllData();
      window.location.reload();
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 5000); // Reset after 5 seconds
    }
  };

  return (
    <footer className="mt-auto border-t border-forest/20 bg-midnight py-8" data-testid="footer-setai">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">🦅</span>
          <span className="font-cinzel text-parchment">Protected by SetAI</span>
          <span className="text-xl">🖤</span>
        </div>
        
        <p className="mt-2 text-sm text-parchment/70">
          No surveillance. No data mining. You own 100% of your data.
        </p>
        
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link
            href="/transparency"
            className="text-parchment/60 underline transition hover:text-parchment"
          >
            Transparency Log
          </Link>
          <span className="text-parchment/30">|</span>
          <button
            onClick={handleRevoke}
            className={`underline transition ${
              showConfirm
                ? "font-semibold text-amber-400"
                : "text-parchment/60 hover:text-parchment"
            }`}
            data-testid="button-revoke-consent"
          >
            {showConfirm ? "Click again to confirm revocation" : "Revoke consent & clear all data"}
          </button>
        </div>
        
        <div className="mt-6 text-xs text-parchment/40">
          <p className="mt-1">WitchMart — Member-owned cooperative marketplace</p>
        </div>
      </div>
    </footer>
  );
}
