import { Link } from "wouter";

/**
 * Hecate's Highway
 * A sanctuary for travelers and private guidance
 */

export default function HecatesHighway() {
  return (
    <div className="tent-page">
      <header className="tent-header">
        <Link href="/" style={{ textDecoration: "none" }}>
          <button className="back-button" data-testid="button-back-home">
            ← Back to Village
          </button>
        </Link>
        <h1>Hecate's Highway</h1>
        <h2>A traveler's sanctuary and privacy-first guidance network.</h2>
      </header>

      <div className="tent-content">
        <div className="tent-intro">
          <p>
            Hecate's Highway is a refuge for wanderers, seekers, and those in need of direction. 
            It is a place of rest, reflection, and guidance for those on their journeys.
          </p>
        </div>

        <section className="tent-section">
          <h3>What Happens Here</h3>
          <p>
            Wayfinding, spiritual guidance, and sanctuary for travelers. 
            Whether you're seeking a moment of peace or a path forward, Hecate's Highway is here for you.
          </p>
        </section>

        <section className="tent-section">
          <h3>Who Belongs</h3>
          <p>
            Every traveler, every seeker, every person in need of a safe harbor. 
            This is a space for those who value privacy, safety, and the wisdom of the journey.
          </p>
        </section>
      </div>

      <style>{`
        .tent-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #0a0a15 0%, #1a1525 50%, #0a0a15 100%);
          padding: 20px;
          color: #e8dcc8;
        }

        .tent-header {
          text-align: center;
          padding: 40px 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .tent-header h1 {
          font-family: 'Cinzel', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          color: #d4af37;
          margin-bottom: 12px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
        }

        .tent-header h2 {
          font-family: 'Cinzel', serif;
          font-size: clamp(1rem, 3vw, 1.5rem);
          color: #a89070;
          margin: 0;
          font-weight: normal;
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

        .tent-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .tent-intro {
          background: linear-gradient(180deg, #f5e6c8 0%, #e8d9b8 100%);
          border-radius: 8px;
          padding: 24px;
          color: #3d2e0f;
          margin-bottom: 32px;
          line-height: 1.8;
        }

        .tent-section {
          background: linear-gradient(135deg, #2a2520 0%, #1a1510 100%);
          border: 2px solid #4a3a2e;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
        }

        .tent-section h3 {
          font-family: 'Cinzel', serif;
          color: #d4af37;
          margin-bottom: 12px;
          margin-top: 0;
        }

        .tent-section p {
          color: #c5baa8;
          line-height: 1.8;
          margin: 0;
        }

        @media (max-width: 640px) {
          .tent-header {
            padding: 30px 15px;
          }

          .tent-content {
            padding: 15px;
          }

          .tent-section {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
