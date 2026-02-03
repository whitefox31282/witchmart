import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VillageExterior from "@/components/village/VillageExterior";
import AboutTent from "@/components/village/tents/AboutTent";
import SanctuaryTent from "@/components/village/tents/SanctuaryTent";
import MakersTent from "@/components/village/tents/MakersTent";
import PricingTent from "@/components/village/tents/PricingTent";
import SetAITent from "@/components/village/tents/SetAITent";
import MissionTent from "@/components/village/tents/MissionTent";
import JoinTent from "@/components/village/tents/JoinTent";
import "./norse-village.css";

export type TentId = 
  | "village" 
  | "about" 
  | "sanctuary" 
  | "makers" 
  | "pricing" 
  | "setai" 
  | "mission" 
  | "join";

export default function NorseVillage() {
  const [currentTent, setCurrentTent] = useState<TentId>("village");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && currentTent !== "village") {
        setCurrentTent("village");
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [currentTent]);

  const enterTent = (tentId: TentId) => {
    setCurrentTent(tentId);
  };

  const returnToVillage = () => {
    setCurrentTent("village");
  };

  const renderTentContent = () => {
    switch (currentTent) {
      case "about":
        return <AboutTent onReturn={returnToVillage} />;
      case "sanctuary":
        return <SanctuaryTent onReturn={returnToVillage} />;
      case "makers":
        return <MakersTent onReturn={returnToVillage} />;
      case "pricing":
        return <PricingTent onReturn={returnToVillage} />;
      case "setai":
        return <SetAITent onReturn={returnToVillage} />;
      case "mission":
        return <MissionTent onReturn={returnToVillage} />;
      case "join":
        return <JoinTent onReturn={returnToVillage} />;
      default:
        return null;
    }
  };

  return (
    <div 
      className={`norse-village ${reducedMotion ? "reduced-motion" : ""}`} 
      data-testid="norse-village"
    >
      <div className="village-grain" />
      
      <AnimatePresence mode="wait">
        {currentTent === "village" ? (
          <motion.div
            key="exterior"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5 }}
            className="village-scene"
          >
            <VillageExterior onEnterTent={enterTent} />
          </motion.div>
        ) : (
          <motion.div
            key={currentTent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5 }}
            className="tent-scene"
          >
            {renderTentContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
