import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Register service worker for PWA support (only after consent)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Only register SW if user has consented (check sessionStorage)
    const hasConsent = sessionStorage.getItem("witchmart-consent") === "true";
    if (hasConsent) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[WitchMart] Service Worker registered:", registration.scope);
        })
        .catch((error) => {
          console.log("[WitchMart] Service Worker registration failed:", error);
        });
    }
  });
}
