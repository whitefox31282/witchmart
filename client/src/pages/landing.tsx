import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import SetTheSloth from "@/components/landing/set-the-sloth";
import ScrollOfContinuity from "@/components/landing/scroll-of-continuity";
import MenuDrawer from "@/components/landing/menu-drawer";
import FooterRune from "@/components/landing/footer-rune";
import Starfield from "@/components/landing/starfield";
import cosmicBackground from "@/assets/landing/cosmic-background.png";
import witchmartLogo from "@/assets/landing/witchmart-logo.jpg";

export default function LandingPage() {
  const [isScrollOpen, setIsScrollOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsScrollOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="ritual-vault" data-testid="landing-page">
      <div 
        className="cosmic-bg" 
        style={{ backgroundImage: `url(${cosmicBackground})` }}
      />
      <Starfield count={80} />
      <div className="grain-overlay" />
      <div className="aurora-overlay" />

      <header className="landing-header">
        <div className="header-center">
          <SetTheSloth onTap={() => setIsScrollOpen(true)} />
        </div>
        <button
          className="runic-hamburger font-cinzel"
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          data-testid="button-hamburger"
        >
          ☰
        </button>
      </header>

      <main className="landing-content">
        <section className="landing-section fade-up">
          <img 
            src={witchmartLogo} 
            alt="WitchMart - Pagans Helping People" 
            className="witchmart-logo"
          />
          <h1 className="font-cinzel">WitchMart</h1>
          <p className="subtitle">
            A People-Powered, Pagan-Aligned Cooperative Economy
          </p>
          <p>
            WitchMart is a community cooperative marketplace and sanctuary
            network—built for transparency, resilience, and mutual care.
          </p>
        </section>

        <section className="landing-section fade-up">
          <h2 className="font-cinzel">Mission + Transparency</h2>
          <p>
            We publish clear rules, member oversight, and community safety
            standards. Pricing is designed to sustain the network without
            exploitation.
          </p>
        </section>

        <section className="landing-section fade-up">
          <h2 className="font-cinzel">Safety &amp; Legal Disclaimer</h2>
          <p>
            Prototype content only. Follow local laws and published safety
            guidance. Nothing here is legal or medical advice.
          </p>
        </section>

        <section className="landing-section fade-up">
          <h2 className="font-cinzel">Ecosystem</h2>
          <p className="ecosystem-list">Ravens Evermore · Ma'at · SetAI · Lady Liberty League</p>
        </section>

        <section className="landing-section fade-up">
          <h2 className="font-cinzel">Sanctuary Nodes</h2>
          <p>
            Local, welcoming points of contact: events, mutual aid, marketplace
            pickup, and community care.
          </p>
          <Link href="/sanctuary-nodes">
            <button className="primary-btn font-cinzel" data-testid="button-browse-nodes">
              Browse nodes
            </button>
          </Link>
        </section>

        <section className="landing-section fade-up">
          <h2 className="font-cinzel">Makers &amp; Guilds</h2>
          <p>
            Profiles, craft categories, reputation, and reviews—designed for
            human trust rather than corporate metrics.
          </p>
          <Link href="/makers-guilds">
            <button className="primary-btn font-cinzel" data-testid="button-meet-makers">
              Meet makers
            </button>
          </Link>
        </section>

        <section className="landing-section fade-up">
          <h2 className="font-cinzel">Pricing &amp; Transparency</h2>
          <p>
            Where your dollar goes, how funds are governed, and how we keep the
            system accessible.
          </p>
          <Link href="/pricing-transparency">
            <button className="primary-btn font-cinzel" data-testid="button-see-model">
              See the model
            </button>
          </Link>
        </section>
      </main>

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: isScrollOpen ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="scroll-wrapper"
      >
        <ScrollOfContinuity onClose={() => setIsScrollOpen(false)} />
      </motion.div>

      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <FooterRune />
    </div>
  );
}
