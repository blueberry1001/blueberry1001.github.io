import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { ArrowUpRight } from "lucide-react";

import "./Preview.css";

export default function PreviewLayout() {
  const { pathname, search } = useLocation();
  const isAbout = search === "?section=about";

  useEffect(() => {
    document.title =
      pathname === "/skills"
        ? "Skills — blueberry"
        : "blueberry — Design preview";
    if (pathname === "/preview" && isAbout) {
      document.getElementById("preview-about")?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
    return () => {
      document.title = "Blueberry's site";
    };
  }, [pathname, isAbout]);

  return (
    <div className="blueberry-preview">
      <a
        className="preview-skip"
        href="#preview-main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("preview-main")?.focus();
        }}
      >
        本文へ移動
      </a>
      <header className="preview-header preview-container">
        <Link
          aria-label="blueberry 新ホーム"
          className="preview-brand"
          to="/preview"
        >
          blueberry.
        </Link>
        <nav aria-label="プレビューのナビゲーション">
          <NavLink to="/works">Works</NavLink>
          <NavLink to="/skills">Skills</NavLink>
          <Link to="/preview?section=about">About</Link>
        </nav>
      </header>
      <main id="preview-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="preview-footer preview-container">
        <span>© {new Date().getFullYear()} blueberry</span>
        <Link to="/home">
          現在のホームページ <ArrowUpRight aria-hidden="true" size={15} />
        </Link>
        <span>Design preview</span>
      </footer>
    </div>
  );
}
