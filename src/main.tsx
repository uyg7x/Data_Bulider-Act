import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Suppress ResizeObserver loop errors (benign but noisy)
// These occur when ResizeObserver callbacks trigger layout changes
const resizeObserverErr = (e: ErrorEvent) => {
  if (
    e.message.includes('ResizeObserver loop') ||
    e.message.includes('ResizeObserver loop completed with undelivered notifications')
  ) {
    e.stopImmediatePropagation();
  }
};

window.addEventListener('error', resizeObserverErr);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
