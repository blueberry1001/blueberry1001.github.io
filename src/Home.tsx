import { Link } from "react-router-dom";
import { BrandGithub, BrandTwitter, BrandYoutube } from "tabler-icons-react";
import "./index.css";

function HomePage() {
  const games: { name: string; url: string }[] = [
    { name: "スイカゲーム", url: "suica_game" },
    { name: "ヘビゲーム", url: "snake" },
  ];
  return (
    <>
      <h1>Blueberry</h1>
      <div className="Links">
        <a
          href="https://twitter.com/bluebery1001"
          target="_blank"
          rel="noreferrer"
        >
          <BrandTwitter size="3rem" />
        </a>
        <a
          href="https://github.com/blueberry1001"
          target="_blank"
          rel="noreferrer"
        >
          <BrandGithub size="3rem" />
        </a>
        <a
          href="https://www.youtube.com/channel/UCOJw7xtcqd3EbO9h-jyWrVg1"
          target="_blank"
          rel="noreferrer"
        >
          <BrandYoutube size="3rem" />
        </a>
        <a
          href="https://note.com/bluebery1001"
          target="_blank"
          rel="noreferrer"
        >
          <img src="./note.svg" className="note" />
        </a>
      </div>
      <div>
        <h2>自己紹介</h2>
        <div>
          <p>競技プログラミングをしています！</p>
        </div>
      </div>
      <div>
        <h2>作ったゲーム</h2>
        <div>
          <ul>
            {games.map((game) => (
              <li key={game.name}>
                <a href={game.url}>{game.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <Link to="/prime">prime</Link>
      </div>
    </>
  );
}

export default HomePage;
