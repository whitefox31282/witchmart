import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export function SnowballScroll() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY < 100);
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollDown = () => {
    window.scrollBy({
      top: window.innerHeight * 0.75,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed right-6 bottom-6 flex flex-col gap-2 z-40" aria-label="Scroll controls">
      {/* Snowball visual - animated rolling effect */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="wm-focus-ring group relative h-12 w-12 rounded-full bg-gradient-to-br from-white to-slate-200 shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-white transition"></div>
          <ChevronUp className="h-6 w-6 text-slate-800 mx-auto mt-3" />
        </button>
      )}

      {/* Down arrow when not at top */}
      {!isAtTop && (
        <button
          onClick={scrollDown}
          className="wm-focus-ring group relative h-12 w-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
          aria-label="Scroll down"
          title="Scroll down"
        >
          <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 bg-white transition"></div>
          <div className="h-6 w-6 mx-auto mt-2 flex items-center justify-center text-slate-100 font-bold">↓</div>
        </button>
      )}
    </div>
  );
}
