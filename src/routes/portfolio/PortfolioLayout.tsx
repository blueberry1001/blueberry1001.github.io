import { Suspense, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Menu, X } from "lucide-react";

import PageLoading from "../../components/PageLoading";

const navItems = [
  { label: "Home", action: "hero" },
  { label: "Works", path: "/works" },
  { label: "Timeline", path: "/timeline" },
  { label: "Articles", path: "/articles" },
  { label: "Links", action: "links" },
];

const PortfolioLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    const targetId: unknown = location.state?.section;
    if (
      location.pathname !== "/home" ||
      (targetId !== "hero" && targetId !== "links")
    )
      return;

    let frame = 0;
    const scroll = () => {
      const target = document.getElementById(targetId);
      if (!target) return false;
      frame = requestAnimationFrame(() => {
        const headerHeight =
          headerRef.current?.getBoundingClientRect().height ?? 64;
        window.scrollTo({
          top: Math.max(
            0,
            target.getBoundingClientRect().top + window.scrollY - headerHeight
          ),
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });
      });
      return true;
    };
    // The destination may still be loading through a lazy route.
    const observer = new MutationObserver(() => {
      if (scroll()) observer.disconnect();
    });
    if (!scroll())
      observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [location.key, location.pathname, location.state]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    navigate("/home", { state: { section: id } });
    setIsMobileMenuOpen(false);
  };
  const navigateToPage = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "border-b border-slate-700/50 bg-slate-900/95 shadow-lg backdrop-blur-lg"
            : "bg-transparent"
        }`}
        ref={headerRef}
        style={{
          backgroundColor: isScrolled ? "rgba(15, 23, 42, 0.95)" : "#0f172a",
          borderBottom: isScrolled
            ? "1px solid rgba(51, 65, 85, 0.5)"
            : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent transition-all duration-300 hover:from-blue-300 hover:to-cyan-300"
            onClick={() => navigateToPage("/home")}
            type="button"
          >
            Blueberry
          </button>
          <nav
            aria-label="メインナビゲーション"
            className="hidden items-center gap-1 md:flex"
          >
            {navItems.map((item) => (
              <button
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800 hover:text-white"
                key={item.label}
                onClick={() =>
                  item.path
                    ? navigateToPage(item.path)
                    : scrollToSection(item.action as string)
                }
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            aria-controls="portfolio-mobile-navigation"
            aria-expanded={isMobileMenuOpen}
            aria-label={
              isMobileMenuOpen ? "メニューを閉じる" : "メニューを開く"
            }
            className="rounded-lg p-2 text-slate-300 transition-all duration-300 hover:bg-slate-800 hover:text-white md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            ref={menuButtonRef}
            type="button"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMobileMenuOpen ? (
          <nav
            aria-label="モバイルナビゲーション"
            className="space-y-2 border-t border-slate-700/50 pb-4 pt-4 md:hidden"
            id="portfolio-mobile-navigation"
          >
            <div className="mx-auto max-w-7xl px-6">
              {navItems.map((item) => (
                <button
                  className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800 hover:text-white"
                  key={item.label}
                  onClick={() =>
                    item.path
                      ? navigateToPage(item.path)
                      : scrollToSection(item.action as string)
                  }
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        ) : null}
      </header>

      <main className="pt-16">
        <Suspense fallback={<PageLoading appearance="portfolio" />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-xl font-bold text-transparent">
                Blueberry
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                競技プログラミングをメインに、
                <br />
                ゲーム制作や動画編集など
                <br />
                幅広く活動中。
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-200">
                Navigation
              </h4>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <button
                      className="group flex items-center gap-2 text-sm text-slate-400 transition-colors duration-300 hover:text-blue-400"
                      onClick={() =>
                        item.path
                          ? navigateToPage(item.path)
                          : scrollToSection(item.action as string)
                      }
                      type="button"
                    >
                      <span className="h-px w-0 bg-blue-400 transition-all duration-300 group-hover:w-4" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} Blueberry. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioLayout;
