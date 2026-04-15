import { Badge } from "./ui/badge";

export function HeroSection() {
  const techStack = ["C++", "Python", "C#", "Unity", "AviUtl", "Blender"];

  return (
    <section id="hero" className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-32 px-6 overflow-hidden mt-16">
      {/* Animated background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block mb-4 px-4 py-1.5 bg-blue-500/10 border border-blue-400/20 rounded-full">
          <span className="text-blue-300 text-sm font-medium">Competitive Programmer</span>
        </div>
        
        <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 mb-8 tracking-tight">
          Blueberry
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-4 leading-relaxed font-light">
          競技プログラミングをメインに、<br className="md:hidden" />
          ゲーム制作や動画編集など幅広く活動中。
        </p>
        
        <div className="flex items-center justify-center gap-2 text-slate-400 mb-10">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <p className="text-base md:text-lg font-medium">
            東京科学大学 / デジタル創作同好会traP
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2.5 justify-center">
          {techStack.map((tech, index) => (
            <Badge
              key={tech}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
              style={{
                backgroundColor: `${getStackColor(index)}15`,
                borderColor: getStackColor(index),
                color: getStackColor(index),
              }}
            >
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

function getStackColor(index: number): string {
  const colors = ["#60A5FA", "#3B82F6", "#FBBF24", "#F59E0B", "#34D399", "#10B981"];
  return colors[index % colors.length];
}