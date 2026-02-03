import { useState, useEffect } from "react";
import { hasConsent, setConsent, revokeAllData, logTransparencyEvent } from "@/lib/setai-gate";

interface SetAIConsentModalProps {
  onConsent: () => void;
  onDecline: () => void;
}

export function SetAIConsentModal({ onConsent, onDecline }: SetAIConsentModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" data-testid="modal-consent">
      <div className="mx-4 max-w-lg rounded-2xl border-2 border-amber-700/50 bg-slate-800 p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦥</span>
          <h2 className="font-cinzel text-xl text-amber-500">SetAI Sovereignty Gate</h2>
        </div>
        
        <div className="mt-4 space-y-4 text-sm text-orange-200">
          <p>
            Welcome to WitchMart. Before you enter, understand your rights:
          </p>
          
          <ul className="ml-4 list-disc space-y-2 text-orange-100">
            <li><strong className="text-amber-400">Zero Surveillance:</strong> No Google Analytics, Meta pixels, or corporate trackers.</li>
            <li><strong className="text-amber-400">Transient Data Only:</strong> Session data is deleted when you close your browser.</li>
            <li><strong className="text-amber-400">You Own Your Data:</strong> 100% ownership. Revoke consent anytime with instant deletion.</li>
            <li><strong className="text-amber-400">Anonymous IDs:</strong> Only random hashes are used - never personal identifiers.</li>
          </ul>
          
          <div className="rounded-xl border border-amber-700/40 bg-slate-700/50 p-4">
            <p className="text-xs text-orange-200/80">
              By consenting, you agree to transient session data only for site functionality.
              No data is sold, shared, or retained beyond your session.
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={() => {
              onDecline();
              window.location.href = "https://duckduckgo.com";
            }}
            className="rounded-full border border-orange-300/30 px-5 py-2.5 text-sm font-semibold text-orange-200 transition hover:bg-orange-200/10"
            data-testid="button-consent-decline"
          >
            Leave Site
          </button>
          <button
            onClick={() => {
              try {
                setConsent(true);
                logTransparencyEvent("consent_granted", "User accepted sovereignty terms");
                onConsent();
                // Force reload to ensure consent takes effect
                window.location.reload();
              } catch (e) {
                console.error("Consent error:", e);
                window.location.reload();
              }
            }}
            className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-500"
            data-testid="button-consent-accept"
          >
            I Consent - Enter Sanctuary
          </button>
        </div>
      </div>
    </div>
  );
}

interface SetAIHarmWarningProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function SetAIHarmWarning({ onConfirm, onCancel }: SetAIHarmWarningProps) {
  const [confirmCount, setConfirmCount] = useState(0);

  const handleConfirm = () => {
    if (confirmCount === 0) {
      setConfirmCount(1);
    } else {
      logTransparencyEvent("harm_warning_acknowledged", "User confirmed after double-check");
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" data-testid="modal-harm-warning">
      <div className="mx-4 max-w-lg rounded-2xl border-2 border-amber-600/50 bg-midnight p-6 shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <h2 className="font-cinzel text-xl text-amber-400">SetAI Protection</h2>
        </div>
        
        <div className="mt-4 space-y-4 text-sm text-parchment/90">
          <p className="font-semibold text-amber-300">
            Potential harm-related content detected.
          </p>
          <p>
            This may violate community standards. WitchMart is a sanctuary space built on mutual care and protection.
          </p>
          <div className="rounded-xl border border-amber-600/30 bg-amber-900/20 p-4">
            <p className="text-xs font-semibold text-amber-300">NOT LEGAL OR MEDICAL ADVICE</p>
            <p className="mt-1 text-xs text-parchment/70">
              If you're in crisis, please reach out: 988 (US), Trans Lifeline 877-565-8860, Trevor Project 866-488-7386
            </p>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="rounded-full border border-parchment/30 px-5 py-2.5 text-sm font-semibold text-parchment transition hover:bg-parchment/10"
            data-testid="button-harm-cancel"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="rounded-full bg-amber-700 px-5 py-2.5 text-sm font-semibold text-parchment shadow-lg transition hover:bg-amber-600"
            data-testid="button-harm-confirm"
          >
            {confirmCount === 0 ? "I Understand - Continue" : "Confirm Again to Proceed"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useSetAIConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    const consent = hasConsent();
    setConsentGiven(consent);
    if (!consent) {
      setShowConsent(true);
    }
  }, []);

  const handleConsent = () => {
    setConsentGiven(true);
    setShowConsent(false);
  };

  const handleDecline = () => {
    setShowConsent(false);
  };

  const handleRevoke = () => {
    revokeAllData();
    setConsentGiven(false);
    setShowConsent(true);
  };

  return {
    showConsent,
    consentGiven,
    handleConsent,
    handleDecline,
    handleRevoke,
    ConsentModal: showConsent ? (
      <SetAIConsentModal onConsent={handleConsent} onDecline={handleDecline} />
    ) : null,
  };
}
