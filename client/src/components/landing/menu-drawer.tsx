import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

const menuItems = [
  { label: "Home", path: "/" },
  { label: "Sanctuary Nodes", path: "/sanctuary-nodes" },
  { label: "Makers & Guilds", path: "/makers-guilds" },
  { label: "Pricing & Transparency", path: "/pricing-transparency" },
  { label: "Join", path: "/join" },
  { label: "Our Story", path: "/about" },
  { label: "Mission + Support", path: "/contact-support" },
];

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuDrawer({ isOpen, onClose }: MenuDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="menu-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            data-testid="menu-backdrop"
          />
          <motion.nav
            className="menu-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            data-testid="menu-drawer"
          >
            <button className="menu-close" onClick={onClose} data-testid="button-close-menu">
              ✕
            </button>
            <ul>
              {menuItems.map((item) => (
                <li key={item.path} className="menu-item">
                  <Link href={item.path} onClick={onClose} data-testid={`link-${item.path.slice(1) || 'home'}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="menu-footer-tag font-cinzel">$RavensEvermore</div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
