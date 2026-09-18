import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ErrorBoundary } from "./components/ErrorBoundary";

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

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.warn('Unhandled promise rejection:', e.reason);
  e.preventDefault();
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
