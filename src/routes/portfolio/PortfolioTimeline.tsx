import { useSearchParams } from "react-router-dom";

import { SlidersHorizontal } from "lucide-react";

import { useScrollReveal } from "../../hooks/useScrollReveal";

import TimelineList from "./TimelineList";
import {
  includesAtDensity,
  timelineCategories,
  timelineDensities,
  timelineRecords,
} from "./timelineData";

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
          <p>経歴・実績</p>
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
          <TimelineList records={visible} />
        )}
      </div>
    </div>
  );
}
