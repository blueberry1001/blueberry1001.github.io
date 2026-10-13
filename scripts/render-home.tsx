import { renderToString } from "react-dom/server";
import { Router, Route, Routes } from "react-router-dom";

import PortfolioHome from "../src/routes/portfolio/PortfolioHome";
import PortfolioLayout from "../src/routes/portfolio/PortfolioLayout";

const navigator = {
  createHref: (
    to: { pathname?: string; search?: string; hash?: string } | string
  ) =>
    typeof to === "string"
      ? `#${to}`
      : `#${to.pathname ?? "/"}${to.search ?? ""}${to.hash ?? ""}`,
  go: () => {},
  push: () => {},
  replace: () => {},
};

export function renderHome() {
  return renderToString(
    <Router location="/home" navigator={navigator} static>
      <Routes>
        <Route element={<PortfolioLayout />} path="/home">
          <Route element={<PortfolioHome />} index />
        </Route>
      </Routes>
    </Router>
  );
}
