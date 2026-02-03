import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Plus, X } from "lucide-react";
import BackToVillage from "../BackToVillage";

interface PricingTentProps {
  onReturn: () => void;
}

interface ReceiptEntry {
  id: string;
  date: string;
  item: string;
  reason: string;
  cost: number;
  receiptUrl?: string;
  submittedBy: string;
}

export default function PricingTent({ onReturn }: PricingTentProps) {
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [receiptData, setReceiptData] = useState({
    item: "",
    reason: "",
    cost: "",
    submittedBy: "",
  });

  // Mock data for display - TODO: Connect to real API
  const [receipts] = useState<ReceiptEntry[]>([
    { id: "1", date: "2024-01-15", item: "Laptop for Development", reason: "Required for SetAI development and site management", cost: 899.99, submittedBy: "Helper A" },
    { id: "2", date: "2024-01-12", item: "Gas - Site Visit", reason: "Travel to sanctuary node meeting", cost: 45.50, submittedBy: "Helper B" },
    { id: "3", date: "2024-01-10", item: "Office Supplies", reason: "Printer ink and paper for documentation", cost: 67.23, submittedBy: "Helper A" },
  ]);

  const handleSubmitReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission when API is ready
    console.log("Receipt submitted:", receiptData);
    setShowReceiptForm(false);
    setReceiptData({ item: "", reason: "", cost: "", submittedBy: "" });
  };

  return (
    <div className="tent-interior tent-counting" data-testid="tent-pricing">
      <BackToVillage onReturn={onReturn} />
      
      <div className="tent-content">
        <header className="tent-header">
          <h1>Pricing & Transparency</h1>
          <p>The Counting House</p>
        </header>

        <div className="scroll-display" style={{ marginBottom: 24 }}>
          <p>
            Where your dollar goes, how funds are governed, and how we keep the system accessible.
          </p>
        </div>

        <div className="wooden-table">
          <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", marginBottom: 20 }}>
            Where Your Dollar Goes
          </h2>
          
          <div style={{ display: "grid", gap: 16 }}>
            {[
              { label: "Platform Development", percent: 40, desc: "Building and maintaining the cooperative infrastructure" },
              { label: "Node Support", percent: 25, desc: "Resources for local sanctuary nodes and community hubs" },
              { label: "Safety & Moderation", percent: 15, desc: "Ensuring community guidelines and member protection" },
              { label: "Cooperative Reserve", percent: 15, desc: "Emergency fund and future expansion" },
              { label: "Governance Operations", percent: 5, desc: "Member voting systems and transparency reporting" },
            ].map((item, i) => (
              <div key={i} className="runestone">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <h3 style={{ margin: 0, color: "#e8dcc8" }}>{item.label}</h3>
                  <span style={{ color: "#d4af37", fontWeight: "bold" }}>{item.percent}%</span>
                </div>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#c5baa8" }}>{item.desc}</p>
                <div style={{ 
                  marginTop: 8, 
                  height: 8, 
                  background: "rgba(0,0,0,0.3)", 
                  borderRadius: 4,
                  overflow: "hidden"
                }}>
                  <div style={{ 
                    width: `${item.percent}%`, 
                    height: "100%", 
                    background: "linear-gradient(90deg, #8b6914, #d4af37)",
                    borderRadius: 4
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Receipt Logging Section */}
        <div className="wooden-table" style={{ marginTop: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", margin: 0 }}>
              Public Expense Ledger
            </h2>
            <button
              onClick={() => setShowReceiptForm(true)}
              className="back-to-village"
              style={{ position: "relative", top: 0, left: 0 }}
              data-testid="button-add-receipt"
            >
              <Plus size={16} />
              <span>Log Receipt</span>
            </button>
          </div>

          <p style={{ color: "#c5baa8", marginBottom: 20 }}>
            All helper purchases are logged here for full transparency. Gas, supplies, tools, snacks — everything.
          </p>

          <div className="ledger-table">
            <div className="ledger-header">
              <span>Date</span>
              <span>Item</span>
              <span>Reason</span>
              <span>Cost</span>
              <span>By</span>
            </div>
            {receipts.map((receipt) => (
              <div key={receipt.id} className="ledger-row" data-testid={`receipt-${receipt.id}`}>
                <span>{receipt.date}</span>
                <span>{receipt.item}</span>
                <span>{receipt.reason}</span>
                <span style={{ color: "#d4af37" }}>${receipt.cost.toFixed(2)}</span>
                <span>{receipt.submittedBy}</span>
              </div>
            ))}
            <div className="ledger-total">
              <span>Total:</span>
              <span style={{ color: "#d4af37", fontWeight: "bold" }}>
                ${receipts.reduce((sum, r) => sum + r.cost, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="runestone" style={{ marginTop: 24 }}>
          <h3 style={{ color: "#e8dcc8" }}>Member Oversight</h3>
          <p style={{ color: "#c5baa8" }}>
            As a cooperative, members have the right to review financial decisions and vote on major 
            expenditures. Quarterly transparency reports will be published openly once Phase 5 launches.
          </p>
        </div>

        <div className="runestone">
          <h3 style={{ color: "#e8dcc8" }}>The Cooperative Model</h3>
          <p style={{ marginBottom: 12, color: "#c5baa8" }}>
            WitchMart operates on cooperative principles:
          </p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {[
              "One member, one vote",
              "Transparent budgeting",
              "No hidden fees or algorithms",
              "Value stays in the community",
              "Decisions accountable to members"
            ].map((item, i) => (
              <li key={i} style={{ paddingLeft: 16, marginBottom: 4, position: "relative", color: "#c5baa8" }}>
                <span style={{ position: "absolute", left: 0, color: "#d4af37" }}>•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Receipt Form Modal */}
      {showReceiptForm && (
        <div 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            zIndex: 200
          }}
          onClick={() => setShowReceiptForm(false)}
        >
          <div 
            className="wooden-table"
            style={{ maxWidth: 500, width: "100%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Cinzel', serif", color: "#d4af37", margin: 0 }}>
                Log a Receipt
              </h2>
              <button
                onClick={() => setShowReceiptForm(false)}
                style={{ background: "none", border: "none", color: "#c5baa8", cursor: "pointer" }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmitReceipt}>
              <div style={{ display: "grid", gap: 16 }}>
                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6 }}>What was purchased *</label>
                  <input
                    type="text"
                    value={receiptData.item}
                    onChange={(e) => setReceiptData(prev => ({ ...prev, item: e.target.value }))}
                    placeholder="Gas, snacks, tools, supplies..."
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#e8dcc8",
                      fontSize: "1rem"
                    }}
                    data-testid="input-receipt-item"
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6 }}>Why *</label>
                  <textarea
                    value={receiptData.reason}
                    onChange={(e) => setReceiptData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Explain the purpose of this purchase..."
                    rows={2}
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#e8dcc8",
                      fontSize: "1rem",
                      resize: "vertical"
                    }}
                    data-testid="textarea-receipt-reason"
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6 }}>Cost ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={receiptData.cost}
                    onChange={(e) => setReceiptData(prev => ({ ...prev, cost: e.target.value }))}
                    placeholder="0.00"
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#e8dcc8",
                      fontSize: "1rem"
                    }}
                    data-testid="input-receipt-cost"
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6 }}>Your Name *</label>
                  <input
                    type="text"
                    value={receiptData.submittedBy}
                    onChange={(e) => setReceiptData(prev => ({ ...prev, submittedBy: e.target.value }))}
                    placeholder="Who made this purchase"
                    style={{
                      width: "100%",
                      padding: 12,
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid #4a3a2e",
                      borderRadius: 6,
                      color: "#e8dcc8",
                      fontSize: "1rem"
                    }}
                    data-testid="input-receipt-name"
                  />
                </div>

                <div>
                  <label style={{ display: "block", color: "#d4af37", marginBottom: 6 }}>Upload Receipt (optional)</label>
                  <div style={{
                    padding: 24,
                    border: "2px dashed #4a3a2e",
                    borderRadius: 8,
                    textAlign: "center",
                    color: "#a89070"
                  }}>
                    <Upload size={24} style={{ marginBottom: 8 }} />
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>Click or drag to upload receipt image</p>
                    <p style={{ margin: "4px 0 0", fontSize: "0.8rem" }}>TODO: File upload coming soon</p>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    padding: "14px 24px",
                    background: "linear-gradient(135deg, #8b6914 0%, #d4af37 100%)",
                    border: "none",
                    borderRadius: 8,
                    color: "#fff",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "1rem",
                    cursor: "pointer"
                  }}
                  data-testid="button-submit-receipt"
                >
                  Log to Public Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .ledger-table {
          border: 1px solid #4a3a2e;
          border-radius: 8px;
          overflow: hidden;
        }

        .ledger-header {
          display: grid;
          grid-template-columns: 100px 1fr 1fr 80px 100px;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.3);
          font-family: 'Cinzel', serif;
          color: #d4af37;
          font-size: 0.85rem;
        }

        .ledger-row {
          display: grid;
          grid-template-columns: 100px 1fr 1fr 80px 100px;
          gap: 12px;
          padding: 12px 16px;
          border-top: 1px solid #3a2a1e;
          font-size: 0.9rem;
          color: #c5baa8;
        }

        .ledger-row:hover {
          background: rgba(212, 175, 55, 0.05);
        }

        .ledger-total {
          display: flex;
          justify-content: space-between;
          padding: 16px;
          border-top: 2px solid #4a3a2e;
          background: rgba(0, 0, 0, 0.2);
          font-family: 'Cinzel', serif;
          color: #e8dcc8;
        }

        @media (max-width: 768px) {
          .ledger-header,
          .ledger-row {
            grid-template-columns: 1fr;
            gap: 4px;
          }

          .ledger-header span:not(:first-child),
          .ledger-row span:not(:first-child):not(:nth-child(2)) {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
