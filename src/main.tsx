import React from "react";
import ReactDOM from "react-dom/client";

import AppRoutes from "./AppRoutes.tsx";

import "./fonts.css";
import "./tailwind.css";
import "./index.css";

const root = document.getElementById("root")!;
const initialPath = window.location.hash.slice(1).split("?")[0];
const isHome = !initialPath || initialPath === "/" || initialPath === "/home";
const app = (
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);

if (isHome && root.dataset.prerender === "home") {
  // Match the existing root redirect before hydration so the server DOM is reused.
  if (initialPath !== "/home") {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}#/home`
    );
  }
  ReactDOM.hydrateRoot(root, app);
} else {
  ReactDOM.createRoot(root).render(app);
}
