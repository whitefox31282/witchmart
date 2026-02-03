import { useState } from "react";
import { Link } from "wouter";

/**
 * SetAI Gaming Safety Agent
 * Parental monitoring tool for in-game chat
 * 
 * TODO: Implement actual monitoring logic when laptop arrives
 * This is a placeholder with UI and consent flows
 */

export default function GamingSafetyPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);

  const handleToggle = () => {
    if (!isEnabled && !hasConsented) {
      setShowConsentModal(true);
    } else {
      setIsEnabled(!isEnabled);
      // TODO: Call API to enable/disable monitoring
      console.log("Gaming Safety Agent:", !isEnabled ? "ENABLED" : "DISABLED");
    }
  };

  const handleConsent = () => {
    setHasConsented(true);
    setIsEnabled(true);
    setShowConsentModal(false);
    // TODO: Call API to enable monitoring
    console.log("Gaming Safety Agent: ENABLED with consent");
  };

  return (
    <div className="safety-page">
      <header className="safety-header">
        <Link href="/gaming-guild" style={{ textDecoration: "none" }}>
          <button className="back-button" data-testid="button-back-guild">
            ← Back to Gaming Guild
          </button>
        </Link>
        <h1>🛡️ SetAI Gaming Safety Agent</h1>
        <p>Parental protection for young gamers</p>
      </header>

      <div className="safety-content">
        {/* Main Toggle */}
        <div className="toggle-section">
          <div className="toggle-card">
            <h2>Safety Monitoring</h2>
            <p>Enable SetAI to monitor in-game chat for your child</p>
            
            <div className="toggle-container">
              <button
                className={`toggle-button ${isEnabled ? "enabled" : "disabled"}`}
                onClick={handleToggle}
                data-testid="toggle-safety"
              >
                <span className="toggle-slider" />
              </button>
              <span className="toggle-label">{isEnabled ? "ON" : "OFF"}</span>
            </div>

            {isEnabled && (
              <div className="status-active">
                <span>🦥</span> Set is watching over your young one
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="info-section">
          <h2>How It Works</h2>
          
          <div className="info-grid">
            <div className="info-card">
              <h3>📖 What It Monitors</h3>
              <ul>
                <li>Public chat messages in supported games</li>
                <li>Private messages (with child's consent)</li>
                <li>Friend request patterns</li>
                <li>Concerning language patterns</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>🚫 What It Does NOT Monitor</h3>
              <ul>
                <li>Voice chat (audio not captured)</li>
                <li>Gameplay footage or recordings</li>
                <li>Personal files or browsing</li>
                <li>Non-gaming applications</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>⚡ Alert System</h3>
              <ul>
                <li>Immediate alerts for flagged content</li>
                <li>Weekly summary reports</li>
                <li>Configurable sensitivity levels</li>
                <li>Parent-only dashboard access</li>
              </ul>
            </div>

            <div className="info-card">
              <h3>🔒 Privacy & Transparency</h3>
              <ul>
                <li>All data stored locally on your device</li>
                <li>No data sold or shared with third parties</li>
                <li>Child is informed monitoring is active</li>
                <li>Full deletion available anytime</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Programming Overview */}
        <div className="technical-section">
          <h2>Technical Overview</h2>
          <div className="scroll-box">
            <p>
              The SetAI Gaming Safety Agent uses pattern-matching algorithms to identify 
              potentially harmful content in text-based communications. It runs locally 
              on your device and does not transmit chat data to external servers.
            </p>
            <p>
              <strong>Detection categories:</strong> Grooming patterns, bullying language, 
              personal information requests, inappropriate content, and distress signals.
            </p>
            <p>
              <strong>False positive handling:</strong> All flags are reviewed by parents 
              before any action is taken. Context is provided to help distinguish 
              genuine concerns from harmless gaming banter.
            </p>
          </div>
        </div>
      </div>

      {/* Consent Modal */}
      {showConsentModal && (
        <div className="modal-overlay" onClick={() => setShowConsentModal(false)}>
          <div className="consent-modal" onClick={(e) => e.stopPropagation()}>
            <h2>🛡️ Parental Consent Required</h2>
            
            <div className="consent-content">
              <p><strong>You are enabling the SetAI Gaming Safety Agent.</strong></p>
              
              <div className="consent-statement">
                <p>By enabling this agent, you acknowledge:</p>
                <ul>
                  <li>You are the parent or legal guardian of the child</li>
                  <li>You are enabling this feature of your own free will</li>
                  <li>You understand what this agent monitors and does not monitor</li>
                  <li>You will inform your child that monitoring is active</li>
                  <li>You can disable this feature at any time</li>
                </ul>
              </div>

              <div className="data-notice">
                <h4>Data Handling</h4>
                <p>
                  All monitoring data is stored locally on your device. 
                  No chat logs, alerts, or personal information are transmitted 
                  to WitchMart servers or any third parties. You maintain full 
                  ownership and control of all data at all times.
                </p>
              </div>
            </div>

            <div className="consent-actions">
              <button 
                className="consent-button cancel" 
                onClick={() => setShowConsentModal(false)}
                data-testid="button-cancel-consent"
              >
                Cancel
              </button>
              <button 
                className="consent-button accept" 
                onClick={handleConsent}
                data-testid="button-accept-consent"
              >
                I Understand & Consent
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .safety-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a15 0%, #1a1525 50%, #0a0a15 100%);
          padding: 20px;
          color: #e8dcc8;
        }

        .safety-header {
          text-align: center;
          padding: 40px 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .safety-header h1 {
          font-family: 'Cinzel', serif;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          color: #d4af37;
          margin-bottom: 12px;
        }

        .safety-header p {
          color: #a89070;
        }

        .back-button {
          background: linear-gradient(135deg, rgba(58, 42, 30, 0.9) 0%, rgba(42, 26, 18, 0.9) 100%);
          border: 2px solid #5a4a3e;
          border-radius: 8px;
          color: #d4af37;
          font-family: 'Cinzel', serif;
          font-size: 0.9rem;
          padding: 10px 20px;
          cursor: pointer;
          margin-bottom: 20px;
        }

        .safety-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .toggle-section {
          margin-bottom: 40px;
        }

        .toggle-card {
          background: linear-gradient(135deg, #2a2520 0%, #1a1510 100%);
          border: 2px solid #4a3a2e;
          border-radius: 12px;
          padding: 32px;
          text-align: center;
        }

        .toggle-card h2 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 8px;
        }

        .toggle-card > p {
          color: #a89070;
          margin-bottom: 24px;
        }

        .toggle-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .toggle-button {
          width: 80px;
          height: 40px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          position: relative;
          transition: background 0.3s ease;
        }

        .toggle-button.disabled {
          background: #3a3a3a;
        }

        .toggle-button.enabled {
          background: linear-gradient(90deg, #8b6914, #d4af37);
        }

        .toggle-slider {
          position: absolute;
          top: 4px;
          width: 32px;
          height: 32px;
          background: white;
          border-radius: 50%;
          transition: left 0.3s ease;
        }

        .toggle-button.disabled .toggle-slider {
          left: 4px;
        }

        .toggle-button.enabled .toggle-slider {
          left: 44px;
        }

        .toggle-label {
          font-family: 'Cinzel', serif;
          font-size: 1.2rem;
          color: #d4af37;
          min-width: 50px;
        }

        .status-active {
          margin-top: 20px;
          padding: 12px 24px;
          background: rgba(100, 150, 100, 0.2);
          border-radius: 8px;
          color: #a0d0a0;
          display: inline-block;
        }

        .info-section h2,
        .technical-section h2 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          text-align: center;
          margin-bottom: 24px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .info-card {
          background: linear-gradient(135deg, #2a2520 0%, #1a1510 100%);
          border: 2px solid #4a3a2e;
          border-radius: 12px;
          padding: 20px;
        }

        .info-card h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 12px;
          font-size: 1rem;
        }

        .info-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-card li {
          color: #c5baa8;
          padding-left: 16px;
          position: relative;
          margin-bottom: 8px;
          font-size: 0.9rem;
        }

        .info-card li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #d4af37;
        }

        .scroll-box {
          background: linear-gradient(180deg, #f5e6c8 0%, #e8d9b8 100%);
          border-radius: 8px;
          padding: 24px;
          color: #3d2e0f;
        }

        .scroll-box p {
          margin-bottom: 12px;
          line-height: 1.7;
        }

        .scroll-box p:last-child {
          margin-bottom: 0;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .consent-modal {
          background: linear-gradient(180deg, #2a2520 0%, #1a1510 100%);
          border: 2px solid #5a4a3e;
          border-radius: 16px;
          max-width: 550px;
          width: 100%;
          padding: 32px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .consent-modal h2 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          text-align: center;
          margin-bottom: 20px;
        }

        .consent-content {
          color: #c5baa8;
        }

        .consent-statement {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 16px;
          margin: 16px 0;
        }

        .consent-statement ul {
          margin: 12px 0 0 0;
          padding-left: 20px;
        }

        .consent-statement li {
          margin-bottom: 8px;
        }

        .data-notice {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 8px;
          padding: 16px;
          margin-top: 16px;
        }

        .data-notice h4 {
          color: #d4af37;
          margin-bottom: 8px;
        }

        .data-notice p {
          font-size: 0.9rem;
          margin: 0;
        }

        .consent-actions {
          display: flex;
          gap: 16px;
          margin-top: 24px;
        }

        .consent-button {
          flex: 1;
          padding: 14px 24px;
          border-radius: 8px;
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          cursor: pointer;
          border: 2px solid;
        }

        .consent-button.cancel {
          background: transparent;
          border-color: #5a4a3e;
          color: #a89070;
        }

        .consent-button.accept {
          background: linear-gradient(135deg, #8b6914 0%, #d4af37 100%);
          border-color: #d4af37;
          color: white;
        }

        @media (max-width: 640px) {
          .consent-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * TODO: Backend implementation when laptop arrives
 * 
 * 1. Create API endpoint: POST /api/gaming-safety/enable
 * 2. Create API endpoint: POST /api/gaming-safety/disable
 * 3. Create API endpoint: GET /api/gaming-safety/status
 * 4. Create API endpoint: GET /api/gaming-safety/alerts
 * 5. Implement local chat monitoring logic
 * 6. Implement pattern detection algorithms
 * 7. Implement alert notification system
 * 8. Create parent dashboard for alert review
 */
