import { ArrowUpRight, ChevronDown } from "lucide-react";

import { timelineCategories, type TimelineEvent } from "./timelineData";
import "./Timeline.css";

export default function TimelineList({
  records,
  compact = false,
}: {
  records: TimelineEvent[];
  compact?: boolean;
}) {
  const years = [...new Set(records.map((event) => event.year))].sort(
    (a, b) => (b ?? 0) - (a ?? 0)
  );
  return (
    <div className={compact ? "timeline-list-compact" : undefined}>
      {years.map((year) => (
        <section
          aria-labelledby={`${compact ? "home" : "timeline"}-year-${year ?? "undated"}`}
          className="timeline-year"
          key={year ?? "undated"}
        >
          <div className="timeline-year-label">
            <h2
              id={`${compact ? "home" : "timeline"}-year-${year ?? "undated"}`}
            >
              {year ?? "高校在学中"}
            </h2>
          </div>
          <ol className="timeline-event-list">
            {records
              .filter((event) => event.year === year)
              .map((event) => {
                const meta = timelineCategories[event.category];
                return (
                  <li className="timeline-event" data-reveal key={event.id}>
                    <article>
                      <div className="timeline-event-meta">
                        {event.dateLabel ? (
                          <span>{event.dateLabel}</span>
                        ) : null}
                        {!compact ? (
                          <span
                            className="timeline-category"
                            style={{ color: meta?.color }}
                          >
                            {meta?.label ?? event.category}
                          </span>
                        ) : null}
                      </div>
                      <h3>{event.title}</h3>
                      {!compact && event.summary ? (
                        <p className="timeline-summary">{event.summary}</p>
                      ) : null}
                      {!compact &&
                      (event.details.length || event.sources.length) ? (
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
      ))}
    </div>
  );
}
