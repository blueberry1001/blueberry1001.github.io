import { useSearchParams } from "react-router-dom";

import { ArrowUpRight, ChevronDown, SlidersHorizontal } from "lucide-react";

import { useScrollReveal } from "../../hooks/useScrollReveal";

import {
  includesAtDensity,
  timelineCategories,
  timelineDensities,
  timelineRecords,
} from "./timelineData";
import "./Timeline.css";

export default function PortfolioTimeline() {
  const [params, setParams] = useSearchParams();
  const requestedDensity = params.get("density");
  const density =
    timelineDensities.find((item) => item.id === requestedDensity) ??
    timelineDensities[1];
  const requestedCategory = params.get("category") ?? "all";
  const category = Object.prototype.hasOwnProperty.call(
    timelineCategories,
    requestedCategory
  )
    ? requestedCategory
    : "all";
  const revealRef = useScrollReveal<HTMLDivElement>(
    `${density.id}:${category}`
  );
  const visible = timelineRecords.filter(
    (event) =>
      includesAtDensity(event, density.id) &&
      (category === "all" || event.category === category)
  );
  const years = [...new Set(visible.map((event) => event.year))].sort(
    (a, b) => (b ?? 0) - (a ?? 0)
  );

  function changeFilter(key: "density" | "category", value: string) {
    setParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (
          (key === "density" && value === "standard") ||
          (key === "category" && value === "all")
        )
          next.delete(key);
        else next.set(key, value);
        return next;
      },
      { preventScrollReset: true }
    );
  }

  return (
    <div className="portfolio-timeline" ref={revealRef}>
      <section className="timeline-hero">
        <div className="timeline-container" data-reveal>
          <h1>Timeline</h1>
          <p>大会への挑戦、ものづくり、その周りの活動。</p>
          <span>高校時代から、大学での取り組みまで。</span>
        </div>
      </section>
      <section
        aria-label="経歴の絞り込み"
        className="timeline-filters timeline-container"
      >
        <div className="timeline-filter-heading">
          <h2>
            <SlidersHorizontal aria-hidden="true" size={19} />
            表示する実績
          </h2>
          <p aria-atomic="true" aria-live="polite">
            {visible.length}
            <span> / {timelineRecords.length}件</span>
          </p>
        </div>
        <div
          aria-label="表示の詳しさ"
          className="timeline-density"
          role="group"
        >
          {timelineDensities.map((item) => (
            <button
              aria-pressed={density.id === item.id}
              key={item.id}
              onClick={() => changeFilter("density", item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <p className="timeline-filter-description">{density.description}</p>
        <div
          aria-label="実績の分類"
          className="timeline-categories"
          role="group"
        >
          <button
            aria-pressed={category === "all"}
            onClick={() => changeFilter("category", "all")}
            type="button"
          >
            全分野
          </button>
          {Object.entries(timelineCategories).map(([id, item]) => (
            <button
              aria-pressed={category === id}
              key={id}
              onClick={() => changeFilter("category", id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>
      <div
        className="timeline-container timeline-results"
        id="timeline-results"
      >
        {visible.length === 0 ? (
          <div className="timeline-empty">
            <h2>この条件に該当する実績はありません。</h2>
            <p>
              表示の詳しさを「すべて」にすると、この分野の活動も確認できます。
            </p>
            <button
              onClick={() => changeFilter("density", "all")}
              type="button"
            >
              すべての詳しさで表示
            </button>
          </div>
        ) : (
          years.map((year) => (
            <section
              aria-labelledby={`timeline-year-${year ?? "undated"}`}
              className="timeline-year"
              key={year ?? "undated"}
            >
              <div className="timeline-year-label">
                <h2 id={`timeline-year-${year ?? "undated"}`}>
                  {year ?? "高校在学中"}
                </h2>
                <p>
                  {year === null
                    ? "時期未整理"
                    : year >= 2026
                      ? "高校卒業・大学へ"
                      : year === 2023
                        ? "高校入学"
                        : year >= 2024
                          ? "高校時代"
                          : "高校入学前"}
                </p>
              </div>
              <ol className="timeline-event-list">
                {visible
                  .filter((event) => event.year === year)
                  .map((event) => {
                    const meta = timelineCategories[event.category];
                    return (
                      <li className="timeline-event" data-reveal key={event.id}>
                        <article>
                          <div className="timeline-event-meta">
                            <span>{event.dateLabel}</span>
                            <span
                              className="timeline-category"
                              style={{ color: meta?.color }}
                            >
                              {meta?.label ?? event.category}
                            </span>
                            {event.visibility === "featured" ? (
                              <span className="timeline-featured">
                                主な実績
                              </span>
                            ) : null}
                          </div>
                          <h3>{event.title}</h3>
                          <p className="timeline-summary">{event.summary}</p>
                          {event.details.length || event.sources.length ? (
                            <details className="timeline-details">
                              <summary>
                                詳細・参考リンク
                                <ChevronDown aria-hidden="true" size={16} />
                              </summary>
                              <div className="timeline-detail-body">
                                {event.details.length ? (
                                  <ul>
                                    {event.details.map((detail) => (
                                      <li key={detail}>{detail}</li>
                                    ))}
                                  </ul>
                                ) : null}
                                {event.sources.length ? (
                                  <div className="timeline-sources">
                                    {event.sources.map((source) => (
                                      <a
                                        href={source.url}
                                        key={source.url}
                                        rel="noreferrer"
                                        target="_blank"
                                      >
                                        {source.label}
                                        <ArrowUpRight
                                          aria-hidden="true"
                                          size={14}
                                        />
                                      </a>
                                    ))}
                                  </div>
                                ) : null}
                              </div>
                            </details>
                          ) : null}
                        </article>
                      </li>
                    );
                  })}
              </ol>
            </section>
          ))
        )}
        <p className="timeline-editorial-note">
          本人の記録をもとに、公開されている大会情報・参加記とあわせて整理しています。日付が確定していない活動は、分かる範囲の時期で掲載しています。
        </p>
      </div>
    </div>
  );
}
