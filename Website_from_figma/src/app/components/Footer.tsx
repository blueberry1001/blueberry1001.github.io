import { Github, Twitter, Youtube, ExternalLink } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const socialLinks = [
    { name: "AtCoder", icon: "🎯", url: "#" },
    { name: "GitHub", icon: Github, url: "#" },
    { name: "X", icon: Twitter, url: "#" },
    { name: "YouTube", icon: Youtube, url: "#" },
  ];

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const navItems = [
    { label: "Home", action: () => scrollToSection("hero") },
    { label: "Works", action: () => navigate("/works") },
    { label: "Timeline", action: () => navigate("/timeline") },
    { label: "Articles", action: () => navigate("/articles") },
    { label: "Links", action: () => scrollToSection("links") },
  ];

  return (
    <footer className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              Blueberry
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              競技プログラミングをメインに、<br />
              ゲーム制作や動画編集など<br />
              幅広く活動中。
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.action}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-blue-400 transition-all duration-300" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-4 uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20"
                  title={link.name}
                >
                  {typeof link.icon === "string" ? (
                    <span className="text-lg">{link.icon}</span>
                  ) : (
                    <link.icon size={18} className="text-slate-400" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2025 Blueberry. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors duration-300"
              >
                東京科学大学
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="#"
                className="text-xs text-slate-500 hover:text-slate-400 transition-colors duration-300 flex items-center gap-1"
              >
                traP
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}