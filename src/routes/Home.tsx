import { BrandGithub, BrandTwitter, BrandYoutube } from "tabler-icons-react";

type Achievement = {
  year: string;
  title: string;
  meta?: string;
};

function HomePage() {
  const games: { name: string; url: string }[] = [
    { name: "スイカゲーム", url: "suica_game" },
    { name: "ヘビゲーム", url: "snake" },
  ];

  const achievements: Achievement[] = [
    {
      year:"2023-25",
      title: "SuperCon 2位/本戦出場",
      meta: "Supercomputing Contest '23 本戦出場, '24 2位, '25 本戦出場",
    },
    {
      year: "2023-25",
      title: "日本情報オリンピック 春合宿参加/本戦出場",
      meta: "JOI '24 本選, '25 春合宿",
    },
    {
      year: "2024-25",
      title: "パソコン甲子園本選出場",
      meta: "PCK '24, '25 本選",
    },
    {
      year: "2024",
      title: "情報科学の達人(5期生)",
      meta: "Simulated TemparingとSimlated Anealingの比較を行った",
    },
    {
      year: "2023-25",
      title: "AtCoder Junior League 参加",
      meta: "'23 14位, '24S 7位, '24W 7位, '25S 13位",
    },
  ];

  const skills = [
    "C++",
    "Python",
    "Unity C#",
    "AviUtl",
    "Blender",
    "競技プログラミング",
    "ゲーム制作",
    "動画・3D 制作",
  ];

  return (
    <>
      <h1>Blueberry</h1>
      <div className="Links">
        <a
          href="https://twitter.com/bluebery1001"
          rel="noreferrer"
          target="_blank"
        >
          <BrandTwitter size="3rem" />
        </a>
        <a
          href="https://github.com/blueberry1001"
          rel="noreferrer"
          target="_blank"
        >
          <BrandGithub size="3rem" />
        </a>
        <a
          href="https://www.youtube.com/channel/UCOJw7xtcqd3EbO9h-jyWrVg1"
          rel="noreferrer"
          target="_blank"
        >
          <BrandYoutube size="3rem" />
        </a>
        <a
          href="https://note.com/bluebery1001"
          rel="noreferrer"
          target="_blank"
        >
          <img className="note" src="./note.svg" />
        </a>
      </div>

      <main className="home">
        <section className="profile-section">
          <h2>自己紹介</h2>
          <div className="profile-main-card">
            <p className="profile-tag">高3 / 筑波大学附属高校 134回生・TCA責任者</p>
            <p className="profile-text">
              競技プログラミングなどをしているBlueberry です。競技プログラミングのほか、ゲーム製作や動画編集などいろいろやっています。
            </p>
            <dl className="profile-meta">
              <div>
                <dt>所属など</dt>
                <dd>筑波大学附属高校 TCA 責任者</dd>
              </div>
              <div>
                <dt>AtCoder</dt>
                <dd>アルゴリズム: 青 / ヒューリスティック: 水</dd>
              </div>
            </dl>
          </div>

          <div className="profile-subcards">
            <div className="profile-subcard">
              <h3>スキル</h3>
              <ul className="chip-list">
                {skills.map((skill) => (
                  <li className="chip" key={skill}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="achievements-section">
          <h2>大会・実績</h2>
          <ul className="achievements-list">
            {achievements.map((achievement) => (
              <li className="achievement-item" key={achievement.year + achievement.title}>
                <div className="achievement-year">{achievement.year}</div>
                <div className="achievement-body">
                  <div className="achievement-title">{achievement.title}</div>
                  {achievement.meta && (
                    <div className="achievement-meta">{achievement.meta}</div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        
      </main>
    </>
  );
}

export default HomePage;
