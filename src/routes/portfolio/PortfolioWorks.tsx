import { NavLink } from "react-router-dom";

import { Calendar, ExternalLink, Tag } from "lucide-react";

import { works } from "./portfolioData";

const PortfolioWorks = () => {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-24">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-6xl font-black tracking-tight text-transparent">
            Works
          </h1>
          <p className="text-xl font-light leading-relaxed text-slate-300">
            これまでに制作した作品の一覧です。
            <br />
            競技プログラミング、ゲーム開発、ツール制作などに取り組んでいます。
          </p>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2">
            {works.map((work) => (
              <NavLink
                className="group relative z-0 block overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-all duration-500 hover:z-10 hover:scale-[1.02] hover:border-slate-300 hover:shadow-2xl"
                key={work.id}
                to={work.url}
              >
                <div
                  className="relative h-32 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${work.color}, ${work.color}CC)`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute right-4 top-4">
                    <span className="rounded-lg bg-white/20 p-2 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/30">
                      <ExternalLink className="text-white" size={20} />
                    </span>
                  </div>
                </div>

                <div className="p-6 pb-4">
                  <h2 className="mb-2 text-2xl font-bold text-slate-900">{work.title}</h2>
                  <p className="text-base leading-relaxed text-slate-600">{work.fullDescription}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                    <Calendar size={16} />
                    <span>{work.date}</span>
                  </div>
                </div>

                <div className="space-y-4 p-6 pt-0">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Tag size={16} />
                      <span>主な機能</span>
                    </div>
                    <ul className="space-y-2">
                      {work.features.map((feature) => (
                        <li className="flex items-start gap-2 text-sm text-slate-600" key={feature}>
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex flex-wrap gap-2">
                      {work.technologies.map((tech) => (
                        <span
                          className="rounded-lg px-3 py-1 text-xs font-medium"
                          key={tech}
                          style={{
                            backgroundColor: `${work.color}15`,
                            border: `1px solid ${work.color}30`,
                            color: work.color,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioWorks;
