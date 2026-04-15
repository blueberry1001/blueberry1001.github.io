import { Github, Twitter, Youtube, FileText, Music, Cloud } from "lucide-react";

export function LinksSection() {
  const links = [
    { name: "AtCoder", icon: "🎯", url: "#", color: "#3B82F6" },
    { name: "GitHub", icon: Github, url: "#", color: "#6366F1" },
    { name: "X", icon: Twitter, url: "#", color: "#1DA1F2" },
    { name: "Zenn", icon: FileText, url: "#", color: "#3EA8FF" },
    { name: "YouTube", icon: Youtube, url: "#", color: "#EF4444" },
    { name: "Note", icon: FileText, url: "#", color: "#10B981" },
    { name: "mixi2", icon: Music, url: "#", color: "#F59E0B" },
    { name: "BlueSky", icon: Cloud, url: "#", color: "#0EA5E9" },
  ];

  return (
    <section id="links" className="w-full py-20 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl font-bold text-slate-900 mb-14 text-center tracking-tight">
          Links
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-white hover:bg-slate-50 transition-all duration-500 hover:scale-105 border border-slate-200 overflow-hidden"
            >
              {/* Gradient hover effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, ${link.color}08, transparent 70%)`,
                }}
              />
              
              <div
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                style={{ 
                  backgroundColor: `${link.color}10`,
                  boxShadow: `0 0 0 0 ${link.color}40`,
                }}
              >
                {typeof link.icon === "string" ? (
                  <span className="text-3xl">{link.icon}</span>
                ) : (
                  <link.icon size={28} style={{ color: link.color }} strokeWidth={2} />
                )}
              </div>
              
              <span className="relative text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                {link.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}