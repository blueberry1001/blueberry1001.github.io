import { Link } from "react-router-dom";

const PublicEthicsPage = () => {
  return (
    <div className="public-ethics-page">
      <h1>共通テスト対策【公共・倫理】</h1>
      
      <div className="public-ethics-intro">
        <p>
          共通テスト「公共・倫理」の対策に役立つ学習ツールです。
          思想家の知識を効率的に覚え、一問一答形式で理解を深めることができます。
        </p>
        <p>
          各ツールを活用して、試験本番に備えましょう！
        </p>
      </div>

      <div className="public-ethics-cards">
        <Link className="public-ethics-card" to="/thinkers">
          <div className="card-icon">📚</div>
          <h2>思想家一覧</h2>
          <p>
            共通テストでよく出題される思想家の情報を一覧で確認できます。
            各思想家の説明、主著、宗教などの詳細情報をまとめて学習できます。
          </p>
          <div className="card-link">一覧を見る →</div>
        </Link>

        <Link className="public-ethics-card" to="/thinkers_quiz">
          <div className="card-icon">✏️</div>
          <h2>一問一答</h2>
          <p>
            ランダムに出題される問題に答えて、知識を定着させましょう。
            「説明→思想家」「主著→思想家」「思想家→主著」など、様々なモードで学習できます。
          </p>
          <div className="card-link">問題を解く →</div>
        </Link>
      </div>

      <div className="public-ethics-tips">
        <h3>学習のコツ</h3>
        <ul>
          <li>まずは「思想家一覧」で全体像を把握しましょう</li>
          <li>「一問一答」で繰り返し練習して記憶を定着させましょう</li>
          <li>間違えた問題は、一覧ページで確認して理解を深めましょう</li>
        </ul>
      </div>
    </div>
  );
};

export default PublicEthicsPage;


