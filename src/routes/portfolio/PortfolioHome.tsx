import { NavLink } from "react-router-dom";

const PortfolioHome = () => {
  return (
    <section className="pf-hero">
      <div className="pf-badge">Competitive Programmer</div>
      <h1>Blueberry</h1>
      <p className="pf-hero-subtitle">
        競技プログラミングを中心に、ゲーム制作や学習ツール開発を行っています。
      </p>
      <div className="pf-actions">
        <NavLink className="pf-primary-action" to="/projects">
          View Projects
        </NavLink>
        <NavLink className="pf-secondary-action" to="/contact">
          Contact
        </NavLink>
      </div>
      <div className="pf-stats">
        <article>
          <h2>Achievements</h2>
          <p>JOI本選 / 春合宿、SuperCon本戦出場・2位 など</p>
        </article>
        <article>
          <h2>Focus</h2>
          <p>アルゴリズム・ヒューリスティック・教育向けWeb開発</p>
        </article>
      </div>
    </section>
  );
};

export default PortfolioHome;
