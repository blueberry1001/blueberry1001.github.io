const PortfolioContact = () => {
  return (
    <section className="pf-page">
      <h1>Contact</h1>
      <p>SNSや開発アカウントはこちらから確認できます。</p>
      <div className="pf-card-grid">
        <article>
          <h2>GitHub</h2>
          <a href="https://github.com/blueberry1001" rel="noreferrer" target="_blank">
            github.com/blueberry1001
          </a>
        </article>
        <article>
          <h2>X (Twitter)</h2>
          <a href="https://twitter.com/bluebery1001" rel="noreferrer" target="_blank">
            @bluebery1001
          </a>
        </article>
        <article>
          <h2>YouTube</h2>
          <a
            href="https://www.youtube.com/channel/UCOJw7xtcqd3EbO9h-jyWrVg1"
            rel="noreferrer"
            target="_blank"
          >
            Channel
          </a>
        </article>
      </div>
    </section>
  );
};

export default PortfolioContact;
