import { Link } from "react-router-dom";

import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useScrollReveal } from "../../hooks/useScrollReveal";

import { profileLinks, works } from "./portfolioData";
import { skillDomains } from "./skillData";

const selectedIds = ["lumen-trace", "cucumvivor", "distance-from-point"];

export default function PreviewHome() {
  const revealRef = useScrollReveal();
  const selectedWorks = selectedIds.flatMap((id) =>
    works.filter((work) => work.id === id)
  );

  return (
    <div ref={revealRef}>
      <section className="preview-hero">
        <div className="preview-hero-copy preview-container" data-reveal>
          <h1>Blueberry</h1>
          <p>
            競技プログラミングをメインに、
            <br />
            ゲーム制作や動画編集など幅広く活動中。
          </p>
          <p className="preview-affiliation">
            東京科学大学 / デジタル創作同好会traP
          </p>
          <div
            aria-label="技術・ツールからスキルを見る"
            className="preview-tool-links"
          >
            {skillDomains.map((domain) => (
              <Link key={domain.id} to={`/skills?domain=${domain.id}`}>
                {domain.title}
              </Link>
            ))}
          </div>
          <div className="preview-actions">
            <Link className="preview-text-link" to="/works">
              作品を見る <ArrowRight aria-hidden="true" size={19} />
            </Link>
            <Link className="preview-text-link" to="/skills">
              スキルをたどる <ArrowRight aria-hidden="true" size={19} />
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="selected-works-title"
        className="preview-works preview-container"
        data-reveal
      >
        <div className="preview-section-heading">
          <h2 id="selected-works-title">Works</h2>
          <Link className="preview-small-link" to="/works">
            すべての作品 <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
        <div className="preview-work-list">
          {selectedWorks.map((work, index) => (
            <Link className="preview-work-row" key={work.id} to={work.url}>
              <span aria-hidden="true" className="preview-row-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{work.title}</h3>
                <p>{work.shortDescription}</p>
              </div>
              <span className="preview-work-tech">
                {work.technologies.slice(0, 2).join(" / ")}
              </span>
              <ArrowUpRight
                aria-hidden="true"
                className="preview-work-arrow"
                size={25}
              />
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="preview-skills-title"
        className="preview-skills-band"
        data-reveal
      >
        <div className="preview-container preview-skills-intro">
          <div>
            <h2 id="preview-skills-title">Skills</h2>
            <p>
              使っている技術から、
              <br />
              つくったものへ。
            </p>
            <Link className="preview-text-link" to="/skills">
              スキルをたどる <ArrowRight aria-hidden="true" size={19} />
            </Link>
          </div>
          <div className="preview-domain-list">
            {skillDomains.map((domain, index) => (
              <Link key={domain.id} to={`/skills?domain=${domain.id}`}>
                <span className="preview-domain-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>
                  <strong>{domain.title}</strong>
                  <small>{domain.english}</small>
                </span>
                <ArrowUpRight aria-hidden="true" size={23} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="preview-about-title"
        className="preview-about preview-container"
        data-reveal
        id="preview-about"
      >
        <h2 id="preview-about-title">About blueberry</h2>
        <div>
          <p className="preview-about-lead">
            東京科学大学で学び、デジタル創作同好会traPで活動。
          </p>
          <p>
            競技プログラミングを軸に、ゲーム、Web、映像へと興味を広げています。
          </p>
          <div className="preview-about-links">
            {profileLinks
              .filter((link) =>
                ["GitHub", "AtCoder", "Note"].includes(link.name)
              )
              .map((link) => (
                <a
                  href={link.url}
                  key={link.name}
                  rel="noreferrer"
                  target="_blank"
                >
                  {link.name}
                  <ArrowUpRight aria-hidden="true" size={16} />
                </a>
              ))}
            <Link to="/articles">
              記事を読む <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <Link to="/timeline">
              これまで <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
