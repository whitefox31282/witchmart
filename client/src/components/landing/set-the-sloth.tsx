import { motion } from "framer-motion";
import slothImage from "@/assets/landing/set-the-sloth.png";
import carpetImage from "@/assets/landing/magic-carpet.png";

interface SetTheSlothProps {
  onTap: () => void;
}

export default function SetTheSloth({ onTap }: SetTheSlothProps) {
  return (
    <motion.button
      className="sloth-wrapper"
      onClick={onTap}
      aria-label="Open SetAI scroll"
      initial={{ y: 0 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      data-testid="button-set-sloth"
    >
      <div className="sloth-glow" />
      <div className="sloth-body">
        <img src={slothImage} alt="Set the Sloth" className="sloth-image" />
        <img src={carpetImage} alt="Magic carpet" className="sloth-carpet" />
      </div>
    </motion.button>
  );
}
