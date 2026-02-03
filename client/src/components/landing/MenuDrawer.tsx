import { useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import "./MenuDrawer.css";

interface MenuDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Sanctuary Nodes", path: "/sanctuary-nodes" },
  { label: "Makers & Guilds", path: "/makers" },
  { label: "Pricing & Transparency", path: "/transparency" },
  { label: "Join", path: "/join" },
  { label: "Our Story", path: "/story" },
  { label: "Mission + Support", path: "/mission" },
];

export default function MenuDrawer({ isOpen, onToggle }: MenuDrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onToggle();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="menu-hamburger"
        onClick={onToggle}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        data-testid="button-menu-hamburger"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="menu-backdrop"
          onClick={onToggle}
          data-testid="menu-backdrop"
        />
      )}

      <nav
        className={`menu-drawer ${isOpen ? "menu-drawer--open" : ""}`}
        aria-hidden={!isOpen}
        data-testid="menu-drawer"
      >
        <div className="menu-header">
          <span className="menu-title">WitchMart</span>
        </div>

        <ul className="menu-nav">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className="menu-link"
                onClick={onToggle}
                data-testid={`link-menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="menu-footer">
          <span className="menu-footer-tag">$RavensEvermore</span>
        </div>
      </nav>
    </>
  );
}
