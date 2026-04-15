import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Menu, X } from "lucide-react";

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
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/home") {
      navigate("/home");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent transition-all duration-300 hover:from-blue-300 hover:to-cyan-300"
            onClick={() => navigateToPage("/home")}
            type="button"
          >
            Blueberry
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800 hover:text-white"
                key={item.label}
                onClick={() => (item.path ? navigateToPage(item.path) : scrollToSection(item.action as string))}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button
            className="rounded-lg p-2 text-slate-300 transition-all duration-300 hover:bg-slate-800 hover:text-white md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            type="button"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMobileMenuOpen ? (
          <nav className="space-y-2 border-t border-slate-700/50 pb-4 pt-4 md:hidden">
            <div className="mx-auto max-w-7xl px-6">
              {navItems.map((item) => (
                <button
                  className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-slate-800 hover:text-white"
                  key={item.label}
                  onClick={() =>
                    item.path ? navigateToPage(item.path) : scrollToSection(item.action as string)
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
        <Outlet />
      </main>

      <footer className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-8 grid gap-8 md:grid-cols-3">
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
                        item.path ? navigateToPage(item.path) : scrollToSection(item.action as string)
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
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-200">
                Legacy
              </h4>
              <a
                className="inline-flex rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-all hover:bg-slate-700"
                href="#/legacy/home"
              >
                Legacy Siteを開く
              </a>
            </div>
          </div>
          <div className="border-t border-slate-700/50 pt-8">
            <p className="text-sm text-slate-500">© 2025 Blueberry. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioLayout;
