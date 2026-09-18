import { Suspense, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { ArrowUpRight } from "lucide-react";

import PageLoading from "../../components/PageLoading";

import "./Preview.css";

export default function PreviewLayout() {
  const { pathname, search } = useLocation();
  const isAbout = search === "?section=about";

  useEffect(() => {
    document.title =
      pathname === "/skills"
        ? "Skills — blueberry"
        : "blueberry — Design preview";
    let observer: MutationObserver | undefined;
    let frame = 0;
    if (pathname === "/preview" && isAbout) {
      const scrollToAbout = () => {
        const section = document.getElementById("preview-about");
        if (!section) return false;
        frame = requestAnimationFrame(() => section.scrollIntoView());
        return true;
      };
      if (!scrollToAbout()) {
        observer = new MutationObserver(() => {
          if (scrollToAbout()) observer?.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
    } else {
      window.scrollTo(0, 0);
    }
    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
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
      <header className="preview-header">
        <div className="preview-container preview-header-inner">
          <Link
            aria-label="blueberry 新ホーム"
            className="preview-brand"
            to="/preview"
          >
            Blueberry
          </Link>
          <nav aria-label="プレビューのナビゲーション">
            <NavLink to="/works">Works</NavLink>
            <NavLink to="/skills">Skills</NavLink>
            <Link to="/preview?section=about">About</Link>
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
            現在のホームページ <ArrowUpRight aria-hidden="true" size={15} />
          </Link>
          <span>Design preview</span>
        </div>
      </footer>
    </div>
  );
}
