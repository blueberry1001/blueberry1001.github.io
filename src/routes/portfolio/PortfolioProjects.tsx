import { NavLink } from "react-router-dom";

const PortfolioProjects = () => {
  return (
    <section className="pf-page">
      <h1>Projects</h1>
      <p>既存コンテンツはそのまま保持し、ここから各ページへ遷移できます。</p>
      <div className="pf-card-grid">
        <article>
          <h2>Products</h2>
          <p>制作物一覧ページへ移動します。</p>
          <NavLink className="pf-inline-link" to="/products">
            Open /products
          </NavLink>
        </article>
        <article>
          <h2>Study Tools</h2>
          <p>公共・倫理、タイマー、ランダムピッカーなどの学習補助。</p>
          <NavLink className="pf-inline-link" to="/public_ethics">
            Open /public_ethics
          </NavLink>
        </article>
      </div>
    </section>
  );
};

export default PortfolioProjects;
