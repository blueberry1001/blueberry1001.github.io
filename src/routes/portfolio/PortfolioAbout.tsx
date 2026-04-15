const PortfolioAbout = () => {
  return (
    <section className="pf-page">
      <h1>About</h1>
      <p>
        筑波大学附属高校のBlueberryです。競技プログラミング、ゲーム制作、教材開発を軸に、
        学んだことをアウトプットする活動を続けています。
      </p>
      <div className="pf-card-grid">
        <article>
          <h2>Skills</h2>
          <p>C++, Python, Unity C#, React, Blender, AviUtl</p>
        </article>
        <article>
          <h2>Interests</h2>
          <p>最適化、シミュレーション、教育コンテンツの設計</p>
        </article>
      </div>
    </section>
  );
};

export default PortfolioAbout;
