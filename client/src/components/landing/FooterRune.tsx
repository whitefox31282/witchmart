import { Link } from "wouter";
import "./FooterRune.css";

export default function FooterRune() {
  return (
    <footer className="footer-rune" data-testid="footer-rune">
      <Link href="/mission">
        <button className="footer-rune-btn" data-testid="button-mission-support">
          Mission + Support $RavensEvermore
        </button>
      </Link>
    </footer>
  );
}
