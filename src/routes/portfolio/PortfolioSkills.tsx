import { useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";

import { useScrollReveal } from "../../hooks/useScrollReveal";

import { works } from "./portfolioData";
import { resolveSkillSelection, skillDomains } from "./skillData";

export default function PortfolioSkills() {
  const revealRef = useScrollReveal();
  const [params, setParams] = useSearchParams();
  const { domain, topic } = resolveSkillSelection(
    params.get("domain"),
    params.get("topic")
  );
  const topicsHeading = useRef<HTMLHeadingElement>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const relatedWorks =
    topic?.workIds.flatMap((id) => works.filter((work) => work.id === id)) ??
    [];

  if (!domain)
    return <p className="skills-empty">スキルはまだ登録されていません。</p>;

  function selectDomain(id: string) {
    setParams({ domain: id }, { preventScrollReset: true });
    if (window.matchMedia("(max-width: 760px)").matches)
      topicsHeading.current?.focus();
  }

  function selectTopic(id: string) {
    setParams({ domain: domain.id, topic: id }, { preventScrollReset: true });
    if (window.matchMedia("(max-width: 760px)").matches)
      detailHeading.current?.focus();
  }

  return (
    <div className="preview-container skills-page" ref={revealRef}>
      <header className="skills-heading" data-reveal>
        <h1>興味から、作品へ。</h1>
        <p>使っている言語やツールから、取り組みと作品をたどれます。</p>
      </header>
      <nav aria-label="選択中のスキル" className="skills-breadcrumb">
        <Link to="/skills">Skills</Link>
        <ChevronRight aria-hidden="true" size={14} />
        <span>{domain.title}</span>
        {topic ? (
          <>
            <ChevronRight aria-hidden="true" size={14} />
            <span>{topic.title}</span>
          </>
        ) : null}
      </nav>

      <div className="skills-explorer" data-reveal>
        <section
          aria-labelledby="skill-domains-heading"
          className="skills-column"
        >
          <h2 className="skills-column-label" id="skill-domains-heading">
            01 <span>言語・ツール</span>
          </h2>
          <div className="skills-options">
            {skillDomains.map((item) => (
              <button
                aria-controls="skill-topics"
                aria-pressed={domain.id === item.id}
                className="skills-domain-button"
                key={item.id}
                onClick={() => selectDomain(item.id)}
                type="button"
              >
                <span>
                  <strong>{item.title}</strong>
                  <small>{item.english}</small>
                </span>
                <ChevronRight aria-hidden="true" size={18} />
              </button>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="skill-topics-heading"
          className="skills-column"
          id="skill-topics"
        >
          <h2
            className="skills-column-label"
            id="skill-topics-heading"
            ref={topicsHeading}
            tabIndex={-1}
          >
            02 <span>できること</span>
          </h2>
          <p className="skills-domain-description">{domain.description}</p>
          <div className="skills-options">
            {domain.topics.map((item) => (
              <button
                aria-controls="skill-detail"
                aria-expanded={topic?.id === item.id}
                className="skills-topic-button"
                key={item.id}
                onClick={() => selectTopic(item.id)}
                type="button"
              >
                <span>{item.title}</span>
                <ArrowRight aria-hidden="true" size={18} />
              </button>
            ))}
          </div>
          <p className="skills-hint">
            気になる技術を選ぶと、
            <br />
            取り組みと関連作品がひらきます。
          </p>
        </section>

        <section
          aria-labelledby="skill-detail-heading"
          className="skills-column skills-detail"
          id="skill-detail"
        >
          <h2
            className="skills-column-label"
            id="skill-detail-heading"
            ref={detailHeading}
            tabIndex={-1}
          >
            03 <span>制作・記録</span>
          </h2>
          {topic ? (
            <div
              className="skills-detail-content portfolio-detail-enter"
              key={`${domain.id}-${topic.id}`}
            >
              <h3>{topic.title}</h3>
              <p className="skills-summary">{topic.summary}</p>
              <ul className="skills-practices">
                {topic.practices.map((practice) => (
                  <li key={practice}>{practice}</li>
                ))}
              </ul>
              {relatedWorks.length ? (
                <div className="skills-related">
                  <h4>つながる作品</h4>
                  {relatedWorks.map((work) => (
                    <Link key={work.id} to={work.url}>
                      <span>
                        <strong>{work.title}</strong>
                        <small>{work.shortDescription}</small>
                      </span>
                      <ArrowUpRight aria-hidden="true" size={20} />
                    </Link>
                  ))}
                </div>
              ) : null}
              <div className="skills-sources">
                {topic.sources.length ? <h4>活動を読む</h4> : null}
                {topic.sources.map((source) => (
                  <a
                    href={source.url}
                    key={source.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {source.label}
                    <ArrowUpRight aria-hidden="true" size={16} />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="skills-empty">
              <ArrowRight aria-hidden="true" size={30} />
              <h3>取り組みを選んでください</h3>
              <p>
                「できること」からひとつ選んで、
                <br />
                関連する作品や活動の記録を確認できます。
              </p>
            </div>
          )}
        </section>
      </div>

      <Link className="preview-text-link" to="/preview">
        新ホームへ <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </div>
  );
}
