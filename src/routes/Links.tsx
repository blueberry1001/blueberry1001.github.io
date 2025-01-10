function LinksPage() {
  const games: { name: string; url: string }[] = [
    { name: "スイカゲーム", url: "suica_game" },
    { name: "ヘビゲーム", url: "snake" },
  ];
  return (
    <div>
      <h1>Links</h1>
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
  );
}
export default LinksPage;
