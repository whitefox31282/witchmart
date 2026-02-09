import { Link } from "wouter";import { Link } from "wouter";



















































































































































}  );    </div>      `}</style>        }          }            padding: 16px;          .tent-section {          }            padding: 15px;          .tent-content {          }            padding: 30px 15px;          .tent-header {        @media (max-width: 640px) {        }          margin: 0;          line-height: 1.8;          color: #c5baa8;        .tent-section p {        }          margin-top: 0;          margin-bottom: 12px;          color: #d4af37;          font-family: 'Cinzel', serif;        .tent-section h3 {        }          margin-bottom: 24px;          padding: 24px;          border-radius: 12px;          border: 2px solid #4a3a2e;          background: linear-gradient(135deg, #2a2520 0%, #1a1510 100%);        .tent-section {        }          line-height: 1.8;          margin-bottom: 32px;          color: #3d2e0f;          padding: 24px;          border-radius: 8px;          background: linear-gradient(180deg, #f5e6c8 0%, #e8d9b8 100%);        .tent-intro {        }          padding: 20px;          margin: 0 auto;          max-width: 900px;        .tent-content {        }          box-shadow: 0 0 16px rgba(212, 175, 55, 0.2);          border-color: #d4af37;        .back-button:hover {        }          transition: all 0.3s ease;          margin-bottom: 20px;          cursor: pointer;          padding: 10px 20px;          font-size: 0.9rem;          font-family: 'Cinzel', serif;          color: #d4af37;          border-radius: 8px;          border: 2px solid #5a4a3e;          background: linear-gradient(135deg, rgba(58, 42, 30, 0.9) 0%, rgba(42, 26, 18, 0.9) 100%);        .back-button {        }          font-weight: normal;          margin: 0;          color: #a89070;          font-size: clamp(1rem, 3vw, 1.5rem);          font-family: 'Cinzel', serif;        .tent-header h2 {        }          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);          margin-bottom: 12px;          color: #d4af37;          font-size: clamp(2rem, 5vw, 3rem);          font-family: 'Cinzel', serif;        .tent-header h1 {        }          margin: 0 auto;          max-width: 800px;          padding: 40px 20px;          text-align: center;        .tent-header {        }          color: #e8dcc8;          padding: 20px;          background: linear-gradient(180deg, #0a0a15 0%, #1a1525 50%, #0a0a15 100%);          min-height: 100vh;        .tent-page {      <style>{`      </div>        </section>          </p>            This is a space for all who believe in the transformative power of stories.            Every storyteller, poet, writer, and listener who cherishes the art of narrative.           <p>          <h3>Who Belongs</h3>        <section className="tent-section">        </section>          </p>            This is where the past meets the present, and where we weave the threads of our collective future.            Storytelling circles, poetry readings, myth-sharing sessions, and creative writing workshops.           <p>          <h3>What Happens Here</h3>        <section className="tent-section">        </div>          </p>            Here, we honor the power of words to connect, inspire, and preserve the essence of our communities.            The Storytellers Tent is a sacred space for the keepers of stories, myths, and oral traditions.           <p>        <div className="tent-intro">      <div className="tent-content">      </header>        <h2>Guardians of lore, myth, and community memory.</h2>        <h1>Storytellers Tent</h1>        </Link>          </button>            ← Back to Village          <button className="back-button" data-testid="button-back-home">        <Link href="/" style={{ textDecoration: "none" }}>      <header className="tent-header">    <div className="tent-page">  return (export default function StorytellersTent() { */ * A space for lore, myth, and community memory * Storytellers Tent/**
/**
 * Storytellers Tent
 * A space for lore, myth, and community memory
 */

export default function StorytellersTent() {
  return (
    <div className="tent-page">
      <header className="tent-header">
        <Link href="/" style={{ textDecoration: "none" }}>
          <button className="back-button" data-testid="button-back-home">
            ← Back to Village
          </button>
        </Link>
        <h1>Storytellers Tent</h1>
        <h2>Guardians of lore, myth, and community memory.</h2>
      </header>

      <div className="tent-content">
        <div className="tent-intro">
          <p>
            The Storytellers Tent is a sacred space for the keepers of stories, myths, and oral traditions. 
            Here, we honor the power of words to connect, inspire, and preserve the essence of our communities.
          </p>
        </div>

        <section className="tent-section">
          <h3>What Happens Here</h3>
          <p>
            Storytelling circles, poetry readings, myth-sharing sessions, and creative writing workshops. 
            This is where the past meets the present, and where we weave the threads of our collective future.
          </p>
        </section>

        <section className="tent-section">
          <h3>Who Belongs</h3>
          <p>
            Every storyteller, poet, writer, and listener who cherishes the art of narrative. 
            This is a space for all who believe in the transformative power of stories.
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
