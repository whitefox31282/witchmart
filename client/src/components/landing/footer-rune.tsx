import { Link } from "wouter";

export default function FooterRune() {
  return (
    <footer className="landing-footer">
      <Link href="/contact-support">
        <button className="footer-btn font-cinzel" data-testid="button-mission-support">
          Mission + Support $RavensEvermore
        </button>
      </Link>
    </footer>
  );
}
