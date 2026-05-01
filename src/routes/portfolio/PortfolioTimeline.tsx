import { Calendar, Star } from "lucide-react";

import {
  timelineCategoryMeta,
  timelineEventsByYear,
  timelineYearStyles,
} from "./portfolioData";

export default function PortfolioTimeline() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-24">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-yellow-500/20 blur-3xl" />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="bg-gradient-to-r from-yellow-300 to-blue-300 bg-clip-text text-6xl font-black tracking-tight text-transparent">
            Timeline
          </h1>
        </div>
      </section>

      <section className="bg-amber-50 px-6 py-6">
        <div className="mx-auto max-w-5xl rounded-2xl border border-amber-200 bg-white/80 p-4 text-sm leading-relaxed text-amber-900">
          このタイムラインの内容は、現時点ではAI生成の情報をもとに構成しているため、事実関係に誤りが含まれる可能性があります。
          今後、一次情報を確認しながら順次手作業で修正・更新していく予定です。
        </div>
      </section>

      <div className="pb-0">
        {Object.entries(timelineEventsByYear).map(([year, events]) => {
          const style = timelineYearStyles[year] ?? timelineYearStyles["2020"];
          return (
            <section
              className={`border-y border-slate-200 px-6 py-16 ${style.bg}`}
              key={year}
            >
              <div className="mx-auto max-w-5xl">
                <div className="mb-16 flex items-center gap-6">
                  <div
                    className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-r ${style.gradient} px-8 py-4 shadow-xl`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar
                        className="text-white"
                        size={32}
                        strokeWidth={2.5}
                      />
                      <h2 className="text-5xl font-black text-white">{year}</h2>
                    </div>
                  </div>
                  <div
                    className="h-1 flex-1 rounded-full"
                    style={{ backgroundColor: style.line }}
                  />
                </div>

                <div className="relative">
                  <div
                    className="absolute bottom-0 left-8 top-0 w-1 md:left-1/2"
                    style={{ backgroundColor: style.line }}
                  />
                  {events.map((event, index) => {
                    const category = timelineCategoryMeta[event.category];
                    return (
                      <div
                        className={`relative mb-12 last:mb-0 ${
                          index % 2 === 0
                            ? "md:pr-[50%] md:text-right"
                            : "md:ml-auto md:pl-[50%]"
                        }`}
                        key={`${year}-${event.month}-${event.title}`}
                      >
                        <div
                          className={`absolute left-0 flex items-center justify-center md:left-1/2 ${index % 2 === 0 ? "md:-translate-x-1/2" : ""}`}
                        >
                          <div
                            className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white shadow-lg"
                            style={{ backgroundColor: event.color }}
                          >
                            <event.icon
                              className="text-white"
                              size={28}
                              strokeWidth={2}
                            />
                          </div>
                        </div>
                        <div
                          className={`ml-24 md:ml-0 ${index % 2 === 0 ? "md:mr-28" : "md:ml-28"}`}
                        >
                          <div
                            className={`group rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                              event.isHighlight
                                ? "border-2 bg-white shadow-xl"
                                : "border-2 border-slate-200 bg-white/90 shadow-md backdrop-blur-sm"
                            }`}
                            style={{
                              borderColor: event.isHighlight
                                ? style.accent
                                : undefined,
                            }}
                          >
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              <span
                                className="rounded-lg px-3 py-1 text-xs font-semibold"
                                style={{
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                  border: `1px solid ${category.color}40`,
                                }}
                              >
                                {category.label}
                              </span>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar size={14} />
                                <span className="font-medium">
                                  {year}年 {event.month}
                                </span>
                              </div>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-slate-900">
                              {event.title}
                            </h3>
                            <p className="mb-4 leading-relaxed text-slate-600">
                              {event.description}
                            </p>
                            <ul className="space-y-2">
                              {event.details.map((detail) => (
                                <li
                                  className="flex items-start gap-3 text-sm text-slate-600"
                                  key={detail}
                                >
                                  <span
                                    className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                    style={{ backgroundColor: event.color }}
                                  />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                            {event.isHighlight ? (
                              <div className="mt-4 border-t border-slate-200 pt-4">
                                <div className="flex items-center gap-2">
                                  <Star
                                    fill={style.accent}
                                    size={16}
                                    style={{ color: style.accent }}
                                  />
                                  <span
                                    className="text-xs font-semibold"
                                    style={{ color: style.accent }}
                                  >
                                    ハイライト
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
