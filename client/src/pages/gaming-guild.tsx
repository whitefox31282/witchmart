import { Link } from "wouter";

/**
 * Gaming Guild Landing Page
 * A grid of game categories for community gaming
 */

const GAME_CATEGORIES = [
  { name: "Tabletop RPGs", icon: "🎲", desc: "D&D, Pathfinder, and indie RPG systems" },
  { name: "MMORPGs", icon: "⚔️", desc: "Massively multiplayer online adventures" },
  { name: "Strategy Games", icon: "♟️", desc: "Turn-based and real-time strategy" },
  { name: "Card Games", icon: "🃏", desc: "TCGs, CCGs, and traditional card games" },
  { name: "Survival & Craft", icon: "🏕️", desc: "Minecraft, Valheim, and survival builders" },
  { name: "Retro Gaming", icon: "👾", desc: "Classic games and emulation communities" },
  { name: "Indie Games", icon: "🎮", desc: "Supporting independent game developers" },
  { name: "Board Games", icon: "🎯", desc: "Virtual and physical board game nights" },
];

export default function GamingGuild() {
  return (
    <div className="gaming-guild-page">
      <header className="gaming-header">
        <Link href="/" style={{ textDecoration: "none" }}>
          <button className="back-button" data-testid="button-back-home">
            ← Back to Village
          </button>
        </Link>
        <h1>Gaming Guild</h1>
        <p>Digital realms, tabletop adventures, and community gaming</p>
      </header>

      <div className="gaming-content">
        <div className="gaming-intro">
          <p>
            The Gaming Guild brings together players across all platforms and genres. 
            Whether you roll dice at a tabletop or explore digital worlds, you're welcome here.
          </p>
        </div>

        <h2>Game Communities</h2>
        <div className="game-grid">
          {GAME_CATEGORIES.map((game, i) => (
            <div key={i} className="game-card" data-testid={`game-card-${i}`}>
              <span className="game-icon">{game.icon}</span>
              <h3>{game.name}</h3>
              <p>{game.desc}</p>
            </div>
          ))}
        </div>

        <div className="safety-notice">
          <h3>🛡️ Gaming Safety</h3>
          <p>
            All Gaming Guild spaces follow WitchMart's safety standards. 
            For families, check out the <Link href="/gaming-safety">SetAI Gaming Safety Agent</Link> 
            — a parental tool for monitoring in-game chat for minors.
          </p>
        </div>
      </div>

      <style>{`
        .gaming-guild-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a15 0%, #1a1525 50%, #0a0a15 100%);
          padding: 20px;
          color: #e8dcc8;
        }

        .gaming-header {
          text-align: center;
          padding: 40px 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .gaming-header h1 {
          font-family: 'Cinzel', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          color: #d4af37;
          margin-bottom: 12px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        .gaming-header p {
          color: #a89070;
          font-size: 1.1rem;
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
          transition: all 0.3s ease;
        }

        .back-button:hover {
          border-color: #d4af37;
          box-shadow: 0 0 16px rgba(212, 175, 55, 0.2);
        }

        .gaming-content {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
        }

        .gaming-intro {
          background: linear-gradient(180deg, #f5e6c8 0%, #e8d9b8 100%);
          border-radius: 8px;
          padding: 24px;
          color: #3d2e0f;
          margin-bottom: 32px;
          text-align: center;
        }

        .gaming-content h2 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 24px;
          text-align: center;
        }

        .game-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .game-card {
          background: linear-gradient(135deg, #2a2520 0%, #1a1510 100%);
          border: 2px solid #4a3a2e;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .game-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.15);
          border-color: #6a5a4e;
        }

        .game-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 12px;
        }

        .game-card h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 8px;
          font-size: 1.1rem;
        }

        .game-card p {
          color: #a89070;
          font-size: 0.9rem;
          margin: 0;
        }

        .safety-notice {
          background: linear-gradient(135deg, #2a2520 0%, #1a1510 100%);
          border: 2px solid #4a3a2e;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
        }

        .safety-notice h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 12px;
        }

        .safety-notice p {
          color: #c5baa8;
          line-height: 1.7;
        }

        .safety-notice a {
          color: #d4af37;
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .game-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .game-card {
            padding: 16px;
          }

          .game-icon {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
