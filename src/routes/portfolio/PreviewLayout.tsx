import { Suspense, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { ArrowUpRight } from "lucide-react";

import PageLoading from "../../components/PageLoading";

import "./Preview.css";

export default function PreviewLayout() {
  useEffect(() => {
    document.title = "Skills — blueberry";
    return () => {
      document.title = "Blueberry's site";
    };
  }, []);

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
      <header className="preview-header">
        <div className="preview-container preview-header-inner portfolio-shell-enter">
          <Link
            aria-label="blueberry ホーム"
            className="preview-brand"
            to="/home"
          >
            Blueberry
          </Link>
          <nav aria-label="メインナビゲーション">
            <NavLink to="/works">Works</NavLink>
            <NavLink to="/skills">Skills</NavLink>
            <Link to="/home">Home</Link>
          </nav>
        </div>
      </header>
      <main id="preview-main" tabIndex={-1}>
        <Suspense fallback={<PageLoading appearance="preview" />}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="preview-footer">
        <div className="preview-container preview-footer-inner">
          <span>© {new Date().getFullYear()} blueberry</span>
          <Link to="/home">
            ホームページ <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
          <span>Skills</span>
        </div>
      </footer>
    </div>
  );
}
