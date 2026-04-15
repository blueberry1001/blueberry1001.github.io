import { NavLink, useNavigate } from "react-router-dom";

import { ArrowRight, Calendar, Clock, ExternalLink } from "lucide-react";

import { articles, profileLinks, techStack, timelineEvents, works } from "./portfolioData";

const PortfolioHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <section
        className="relative mt-16 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-32"
        id="hero"
      >
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl" />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-yellow-400/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-4 inline-block rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5">
            <span className="text-sm font-medium text-blue-300">Competitive Programmer</span>
          </div>
          <h1 className="mb-8 bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-7xl font-black tracking-tight text-transparent md:text-8xl">
            Blueberry
          </h1>
          <p className="mb-4 text-xl font-light leading-relaxed text-slate-300 md:text-2xl">
            競技プログラミングをメインに、
            <br className="md:hidden" />
            ゲーム制作や動画編集など幅広く活動中。
          </p>
          <div className="mb-10 flex items-center justify-center gap-2 text-slate-400">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            <p className="text-base font-medium md:text-lg">東京科学大学 / デジタル創作同好会traP</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {techStack.map((tech, index) => {
              const colors = ["#60A5FA", "#3B82F6", "#FBBF24", "#F59E0B", "#34D399", "#10B981"];
              const color = colors[index % colors.length];
              return (
                <span
                  className="rounded-xl border px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg"
                  key={tech}
                  style={{ backgroundColor: `${color}15`, borderColor: color, color }}
                >
                  {tech}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="w-full bg-slate-50 px-6 py-20" id="links">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-14 text-center text-5xl font-bold tracking-tight text-slate-900">Links</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {profileLinks.map((link) => (
              <a
                className="group relative z-0 flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-500 hover:z-10 hover:scale-105 hover:bg-slate-50"
                href={link.url}
                key={link.name}
                rel="noreferrer"
                target="_blank"
              >
                <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                  {link.icon}
                </div>
                <span className="relative text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white px-6 py-20" id="works">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-5xl font-bold tracking-tight text-slate-900">Works</h2>
            <button
              className="group flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-600"
              onClick={() => navigate("/works")}
              type="button"
            >
              <span>すべて見る</span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {works.map((work) => (
              <NavLink
                className="group relative z-0 block overflow-hidden rounded-2xl border-2 border-slate-200 transition-all duration-500 hover:z-10 hover:scale-105 hover:border-slate-300 hover:shadow-2xl"
                key={work.id}
                style={{
                  background: `linear-gradient(135deg, ${work.color}18, ${work.color}0D)`,
                }}
                to={work.url}
              >
                <div className="absolute left-0 right-0 top-0 h-1" style={{ backgroundColor: work.color }} />
                <div className="p-6 pb-4">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-2xl font-bold text-slate-900">{work.title}</h3>
                    <span className="rounded-lg bg-slate-100 p-2 text-slate-400 transition-all duration-300 group-hover:scale-110 group-hover:bg-slate-200 group-hover:text-slate-700">
                      <ExternalLink size={18} strokeWidth={2.5} />
                    </span>
                  </div>
                  <p className="text-base leading-relaxed text-slate-600">{work.shortDescription}</p>
                </div>
                <div className="p-6 pt-0">
                  <div className="flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                    <span className="mt-0.5 text-lg">💬</span>
                    <p className="text-sm leading-relaxed text-slate-600">{work.fullDescription}</p>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-slate-50 px-6 py-20" id="timeline">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 flex items-center justify-between">
            <h2 className="text-5xl font-bold tracking-tight text-slate-900">Timeline</h2>
            <button
              className="group flex items-center gap-2 rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-600"
              onClick={() => navigate("/timeline")}
              type="button"
            >
              <span>詳しく見る</span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
            </button>
          </div>
          <div className="relative">
            <div className="absolute bottom-0 left-8 top-0 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-yellow-400 md:left-1/2" />
            {timelineEvents.map((event, index) => (
              <div
                className={`relative mb-16 last:mb-0 ${
                  index % 2 === 0 ? "md:pr-[50%] md:text-right" : "md:ml-auto md:pl-[50%]"
                }`}
                key={event.year}
              >
                <div
                  className={`absolute left-0 flex items-center justify-center md:left-1/2 ${
                    index % 2 === 0 ? "md:-translate-x-1/2" : ""
                  }`}
                >
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl border-2 font-bold shadow-lg backdrop-blur-sm transition-all duration-500 hover:scale-110 ${
                      event.isHighlight
                        ? "border-yellow-300 bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 shadow-yellow-200"
                        : "border-blue-400 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200"
                    }`}
                  >
                    <span className="text-lg">{event.year}</span>
                  </div>
                </div>
                <div className={`ml-28 md:ml-0 ${index % 2 === 0 ? "md:mr-32" : "md:ml-32"}`}>
                  <div
                    className={`group rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                      event.isHighlight
                        ? "border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg shadow-yellow-100"
                        : "border-2 border-slate-200 bg-white shadow-md"
                    }`}
                  >
                    <ul className="space-y-3">
                      {event.items.map((item) => (
                        <li
                          className={`flex items-start gap-3 ${
                            event.isHighlight ? "font-semibold text-slate-800" : "text-slate-700"
                          }`}
                          key={item}
                        >
                          <span
                            className={`mt-2 h-2 w-2 flex-shrink-0 rounded-full ${
                              event.isHighlight ? "bg-yellow-500" : "bg-blue-500"
                            }`}
                          />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-white px-6 py-20" id="articles">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-5xl font-bold tracking-tight text-slate-900">Articles</h2>
            <button
              className="group flex items-center gap-2 rounded-xl bg-purple-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-purple-600"
              onClick={() => navigate("/articles")}
              type="button"
            >
              <span>すべて見る</span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={20} />
            </button>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <NavLink
                className="group relative z-0 block h-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-all duration-500 hover:z-10 hover:scale-105 hover:border-slate-300 hover:shadow-2xl"
                key={article.id}
                to={`/articles/${article.id}`}
              >
                <div className="h-2 w-full" style={{ backgroundColor: article.color }} />
                <div className="p-6 pb-4">
                  <h3 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-purple-600">
                    {article.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">{article.description}</p>
                </div>
                <div className="space-y-4 p-6 pt-0">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 transition-all group-hover:gap-3">
                      <span>続きを読む</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default PortfolioHome;
