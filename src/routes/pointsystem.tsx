import { useEffect, useMemo, useRef, useState } from "react";

const PROBLEM_COUNT = 50;
const STORAGE_KEY = "mystery-point-system-v4";

type GameKey = "A" | "B" | "C" | "D";

type Game = {
  key: GameKey;
  name: string;
  reward: number;
};

type State = {
  teamName: string;
  solved: boolean[];
  games: Record<GameKey, boolean>;
};

type HistoryEntry = {
  id: number;
  time: string;
  description: string;
  previous: State;
};

const GAMES: Game[] = [
  {
    key: "A",
    name: "ゲームA",
    reward: 30,
  },
  {
    key: "B",
    name: "ゲームB",
    reward: 30,
  },
  {
    key: "C",
    name: "ゲームC",
    reward: 40,
  },
  {
    key: "D",
    name: "ゲームD",
    reward: 50,
  },
];

const createDefaultState = (): State => ({
  teamName: "TEAM",
  solved: Array(PROBLEM_COUNT).fill(false),
  games: {
    A: false,
    B: false,
    C: false,
    D: false,
  },
});

const cloneState = (state: State): State => ({
  teamName: state.teamName,
  solved: [...state.solved],
  games: {
    ...state.games,
  },
});

/*
 * 問題番号から賞金を取得。
 *
 * 1～10問目  → 1 Laq
 * 11～20問目 → 2 Laq
 * 21～30問目 → 3 Laq
 * 31～40問目 → 4 Laq
 * 41～50問目 → 5 Laq
 */
const problemReward = (index: number) => {
  return Math.floor(index / 10) + 1;
};

const PointSystem = () => {
  const [state, setState] = useState<State>(createDefaultState);

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const [admin, setAdmin] = useState(false);

  /*
   * 管理者画面への隠し操作。
   *
   * プレイヤー画面の右上を3秒長押しすると
   * PIN入力画面が表示される。
   */
  const holdTimer = useRef<number | null>(null);

  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const [adminPin, setAdminPin] = useState("");

  /*
   * 公演スタッフにだけ共有するPIN。
   */
  const ADMIN_PIN = "4729";

  /*
   * localStorageから復元
   */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      const defaultState = createDefaultState();

      if (data.state) {
        setState({
          ...defaultState,
          ...data.state,

          solved:
            Array.isArray(data.state.solved) &&
            data.state.solved.length === PROBLEM_COUNT
              ? data.state.solved
              : defaultState.solved,

          games: {
            ...defaultState.games,
            ...(data.state.games ?? {}),
          },
        });
      }

      if (Array.isArray(data.history)) {
        setHistory(data.history);
      }
    } catch {
      console.warn("保存されたデータを読み込めませんでした。");
    }
  }, []);

  /*
   * localStorageへ保存
   */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        state,
        history,
      })
    );
  }, [state, history]);

  /*
   * アイテムポイント
   *
   * 「正解した問題の数」そのもの。
   */
  const itemPoints = useMemo(() => {
    return state.solved.filter(Boolean).length;
  }, [state.solved]);

  /*
   * 賞金獲得謎による賞金。
   *
   * 正解した問題それぞれの配点を合計する。
   */
  const puzzlePrize = useMemo(() => {
    return state.solved.reduce(
      (sum, solved, index) => sum + (solved ? problemReward(index) : 0),
      0
    );
  }, [state.solved]);

  /*
   * ゲームによる賞金。
   */
  const gamePrize = useMemo(() => {
    return GAMES.reduce(
      (sum, game) => sum + (state.games[game.key] ? game.reward : 0),
      0
    );
  }, [state.games]);

  /*
   * 最終的な獲得賞金。
   */
  const totalPrize = puzzlePrize + gamePrize;

  /*
   * 最新の操作を履歴へ追加
   */
  const addHistory = (previous: State, description: string) => {
    setHistory((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString("ja-JP"),
        description,
        previous: cloneState(previous),
      },
      ...prev,
    ]);
  };

  /*
   * 状態変更＋履歴保存
   */
  const updateState = (updater: (next: State) => void, description: string) => {
    const previous = cloneState(state);
    const next = cloneState(state);

    updater(next);

    setState(next);
    addHistory(previous, description);
  };

  /*
   * 小問の正解状態を変更
   */
  const toggleProblem = (index: number) => {
    const nextValue = !state.solved[index];

    updateState(
      (next) => {
        next.solved[index] = nextValue;
      },
      `第${index + 1}問を${nextValue ? "正解" : "未正解"}に変更`
    );
  };

  /*
   * ゲームの正解状態を変更
   */
  const toggleGame = (game: GameKey) => {
    const current = state.games[game];
    const nextValue = !current;

    const gameInfo = GAMES.find((item) => item.key === game);

    updateState(
      (next) => {
        next.games[game] = nextValue;
      },
      `${gameInfo?.name ?? `ゲーム${game}`}を${
        nextValue ? "クリア" : "未クリア"
      }に変更`
    );
  };

  /*
   * チーム名変更
   */
  const setTeamName = (value: string) => {
    const previous = cloneState(state);

    setState((current) => ({
      ...current,
      teamName: value,
    }));

    addHistory(previous, "チーム名を変更");
  };

  /*
   * 一つ戻す
   */
  const undo = () => {
    if (history.length === 0) return;

    const latest = history[0];

    setState(cloneState(latest.previous));

    setHistory((prev) => prev.slice(1));
  };

  /*
   * 全データ初期化
   */
  const reset = () => {
    const previous = cloneState(state);

    setState(createDefaultState());

    setHistory((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString("ja-JP"),
        description: "全データをリセット",
        previous,
      },
      ...prev,
    ]);
  };

  /*
   * 管理者画面への長押し開始
   */
  const startAdminHold = () => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
    }

    holdTimer.current = window.setTimeout(() => {
      setShowAdminLogin(true);
      setAdminPin("");
    }, 3000);
  };

  /*
   * 長押し終了
   */
  const cancelAdminHold = () => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  /*
   * 管理者PIN認証
   */
  const loginAdmin = () => {
    if (adminPin === ADMIN_PIN) {
      setAdmin(true);
      setShowAdminLogin(false);
      setAdminPin("");
    } else {
      setAdminPin("");
      window.alert("PINが正しくありません。");
    }
  };

  /*
   * 管理者画面から表示画面へ戻る
   */
  const exitAdmin = () => {
    setAdmin(false);

    if (window.location.hash === "#admin") {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  };

  return (
    <div className="point-system">
      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #f4f5f7;
          color: #252a34;
          font-family:
            Inter,
            "Noto Sans JP",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        button,
        input {
          font: inherit;
        }

        button {
          -webkit-tap-highlight-color: transparent;
        }

        .point-system {
          min-height: 100vh;
          background: #f4f5f7;
        }

        /*
         * プレイヤー画面右上の隠し操作領域
         */
        .secret-area {
          position: fixed;
          top: 0;
          right: 0;
          width: 90px;
          height: 90px;
          z-index: 100;
          touch-action: none;
        }

        .container {
          width: min(
            1100px,
            calc(100% - 40px)
          );
          margin: 0 auto;
          padding: 48px 0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 28px;
        }

        .eyebrow {
          margin: 0 0 7px;
          color: #6c757d;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .08em;
        }

        .title {
          margin: 0;
          font-size: 32px;
          line-height: 1.2;
          font-weight: 700;
          letter-spacing: -.02em;
        }

        .team-name {
          color: #3d5a80;
        }

        .summary {
          display: grid;
          grid-template-columns:
            1.4fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 28px;
        }

        .summary-card {
          min-height: 118px;
          padding: 22px 24px;
          border: 1px solid #dfe3e8;
          border-radius: 12px;
          background: #ffffff;
        }

        .summary-card.primary {
          border-color: #3d5a80;
        }

        .summary-label {
          color: #6c757d;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .summary-value {
          font-size: 32px;
          font-weight: 700;
          line-height: 1;
        }

        .summary-value.large {
          font-size: 42px;
        }

        .summary-unit {
          margin-left: 5px;
          color: #6c757d;
          font-size: 15px;
          font-weight: 500;
        }

        .panel {
          padding: 24px;
          border: 1px solid #dfe3e8;
          border-radius: 12px;
          background: #ffffff;
          margin-bottom: 18px;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          gap: 12px;
        }

        .panel-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .panel-description {
          color: #6c757d;
          font-size: 13px;
        }

        .problem-grid {
          display: grid;
          grid-template-columns:
            repeat(10, minmax(0, 1fr));
          gap: 8px;
        }

        .problem {
          position: relative;
          aspect-ratio: 1;
          min-width: 0;
          border: 1px solid #dfe3e8;
          border-radius: 8px;
          background: #f8f9fa;
          color: #6c757d;
        }

        .problem.solved {
          border-color: #52796f;
          background: #52796f;
          color: #ffffff;
        }

        .problem-number {
          position: absolute;
          top: 8px;
          left: 9px;
          font-size: 12px;
          font-weight: 600;
        }

        .problem-mark {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          padding-top: 4px;
          font-size: 22px;
          font-weight: 400;
        }

        .problem-points {
          position: absolute;
          right: 8px;
          bottom: 7px;
          font-size: 10px;
          opacity: .75;
        }

        .game-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 12px;
        }

        .game-card {
          padding: 18px;
          border: 1px solid #dfe3e8;
          border-radius: 10px;
          background: #fafbfc;
        }

        .game-name {
          margin-bottom: 10px;
          font-size: 14px;
          font-weight: 700;
        }

        .game-reward {
          font-size: 25px;
          font-weight: 700;
        }

        .game-reward span {
          margin-left: 4px;
          color: #6c757d;
          font-size: 12px;
          font-weight: 500;
        }

        .admin-container {
          width: min(
            1100px,
            calc(100% - 40px)
          );
          margin: 0 auto;
          padding: 32px 0 64px;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .admin-title {
          margin: 0;
          font-size: 24px;
        }

        .button {
          border: 1px solid #ccd2d8;
          border-radius: 7px;
          padding: 9px 14px;
          background: #ffffff;
          color: #252a34;
          cursor: pointer;
        }

        .button:hover {
          background: #f4f5f7;
        }

        .button.primary {
          border-color: #3d5a80;
          background: #3d5a80;
          color: white;
        }

        .button.danger {
          border-color: #bc4749;
          background: #bc4749;
          color: white;
        }

        .button:disabled {
          opacity: .45;
          cursor: default;
        }

        .admin-section {
          padding: 22px;
          margin-bottom: 16px;
          border: 1px solid #dfe3e8;
          border-radius: 10px;
          background: #ffffff;
        }

        .admin-section h2 {
          margin: 0 0 16px;
          font-size: 17px;
        }

        .team-input {
          width: 100%;
          max-width: 360px;
          padding: 10px 12px;
          border: 1px solid #ccd2d8;
          border-radius: 7px;
          outline: none;
        }

        .team-input:focus {
          border-color: #3d5a80;
        }

        .admin-problem-grid {
          display: grid;
          grid-template-columns:
            repeat(10, minmax(0, 1fr));
          gap: 7px;
        }

        .admin-problem {
          aspect-ratio: 1;
          border: 1px solid #dfe3e8;
          border-radius: 7px;
          background: #f8f9fa;
          cursor: pointer;
          color: #6c757d;
          font-weight: 600;
        }

        .admin-problem.solved {
          border-color: #52796f;
          background: #52796f;
          color: white;
        }

        .admin-game-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 12px;
        }

        .admin-game {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border: 1px solid #dfe3e8;
          border-radius: 9px;
          background: #fafbfc;
        }

        .admin-game-name {
          font-size: 14px;
          font-weight: 700;
        }

        .admin-game-button {
          min-width: 80px;
          padding: 8px 12px;
          border: 1px solid #ccd2d8;
          border-radius: 6px;
          background: #ffffff;
          color: #6c757d;
          cursor: pointer;
        }

        .admin-game-button.solved {
          border-color: #52796f;
          background: #52796f;
          color: white;
        }

        .history {
          max-height: 300px;
          overflow: auto;
          border: 1px solid #e3e7ea;
          border-radius: 7px;
        }

        .history-row {
          display: flex;
          gap: 16px;
          padding: 9px 12px;
          border-bottom: 1px solid #edf0f2;
          font-size: 13px;
        }

        .history-row:last-child {
          border-bottom: none;
        }

        .history-time {
          flex: 0 0 75px;
          color: #8a9198;
        }

        .admin-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 20px;
        }

        /*
         * PINモーダル
         */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          background: rgba(
            37,
            42,
            52,
            .35
          );
        }

        .modal {
          width: min(360px, 100%);
          padding: 28px;
          border-radius: 12px;
          background: #ffffff;
          box-shadow:
            0 12px 40px
            rgba(0, 0, 0, .15);
        }

        .modal h2 {
          margin: 0 0 8px;
          font-size: 20px;
        }

        .modal p {
          margin: 0 0 18px;
          color: #6c757d;
          font-size: 13px;
        }

        .pin-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ccd2d8;
          border-radius: 7px;
          text-align: center;
          font-size: 22px;
          letter-spacing: .25em;
          outline: none;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 16px;
        }

        @media (max-width: 700px) {
          .container,
          .admin-container {
            width: min(
              100% - 24px,
              1100px
            );
            padding-top: 24px;
          }

          .summary {
            grid-template-columns: 1fr 1fr;
          }

          .summary-card.primary {
            grid-column: 1 / -1;
          }

          .problem-grid {
            gap: 5px;
          }

          .problem-number {
            top: 5px;
            left: 6px;
            font-size: 10px;
          }

          .problem-mark {
            font-size: 17px;
          }

          .problem-points {
            right: 5px;
            bottom: 4px;
            font-size: 8px;
          }

          .game-grid,
          .admin-game-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>

      {!admin && (
        <div
          className="secret-area"
          onPointerCancel={cancelAdminHold}
          onPointerDown={startAdminHold}
          onPointerLeave={cancelAdminHold}
          onPointerUp={cancelAdminHold}
        />
      )}

      {admin ? (
        <AdminScreen
          exitAdmin={exitAdmin}
          gamePrize={gamePrize}
          history={history}
          itemPoints={itemPoints}
          puzzlePrize={puzzlePrize}
          reset={reset}
          setTeamName={setTeamName}
          solvedCount={state.solved.filter(Boolean).length}
          state={state}
          toggleGame={toggleGame}
          toggleProblem={toggleProblem}
          totalPrize={totalPrize}
          undo={undo}
        />
      ) : (
        <PlayerScreen
          gamePrize={gamePrize}
          itemPoints={itemPoints}
          puzzlePrize={puzzlePrize}
          solvedCount={state.solved.filter(Boolean).length}
          state={state}
          totalPrize={totalPrize}
        />
      )}

      {showAdminLogin && !admin && (
        <div
          className="modal-backdrop"
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowAdminLogin(false);
              setAdminPin("");
            }
          }}
        >
          <div className="modal">
            <h2>管理者認証</h2>

            <p>スタッフ用PINを入力してください。</p>

            <input
              autoFocus
              className="pin-input"
              inputMode="numeric"
              maxLength={4}
              onChange={(e) => setAdminPin(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  loginAdmin();
                }
              }}
              type="password"
              value={adminPin}
            />

            <div className="modal-actions">
              <button
                className="button"
                onClick={() => {
                  setShowAdminLogin(false);
                  setAdminPin("");
                }}
              >
                キャンセル
              </button>

              <button className="button primary" onClick={loginAdmin}>
                入る
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PlayerScreen = ({
  state,
  solvedCount,
  itemPoints,
  puzzlePrize,
  gamePrize,
  totalPrize,
}: {
  state: State;
  solvedCount: number;
  itemPoints: number;
  puzzlePrize: number;
  gamePrize: number;
  totalPrize: number;
}) => {
  return (
    <main className="container">
      <header className="header">
        <div>
          <p className="eyebrow">PRIZE MANAGEMENT</p>

          <h1 className="title">
            <span className="team-name">{state.teamName}</span>
          </h1>
        </div>
      </header>

      <section className="summary">
        <div className="summary-card primary">
          <div className="summary-label">現在の獲得賞金</div>

          <div className="summary-value large">
            {totalPrize}
            <span className="summary-unit">Laq</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">アイテムポイント</div>

          <div className="summary-value">
            {itemPoints}
            <span className="summary-unit">pt</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-label">謎の正解数</div>

          <div className="summary-value">
            {solvedCount}
            <span className="summary-unit">/ {PROBLEM_COUNT}</span>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">賞金獲得謎</h2>

          <div className="panel-description">
            謎による賞金：{puzzlePrize} Laq
          </div>
        </div>

        <div className="problem-grid">
          {state.solved.map((solved, index) => (
            <div className={`problem ${solved ? "solved" : ""}`} key={index}>
              <div className="problem-number">{index + 1}</div>

              <div className="problem-mark">{solved ? "○" : "－"}</div>

              <div className="problem-points">{problemReward(index)} Laq</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2 className="panel-title">ゲーム</h2>

          <div className="panel-description">
            ゲームによる賞金：{gamePrize} Laq
          </div>
        </div>

        <div className="game-grid">
          {GAMES.map((game) => (
            <div className="game-card" key={game.key}>
              <div className="game-name">{game.name}</div>

              <div className="game-reward">
                {state.games[game.key] ? game.reward : 0}

                <span>Laq</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

const AdminScreen = ({
  state,
  history,
  solvedCount,
  itemPoints,
  puzzlePrize,
  gamePrize,
  totalPrize,
  setTeamName,
  toggleProblem,
  toggleGame,
  undo,
  reset,
  exitAdmin,
}: {
  state: State;
  history: HistoryEntry[];
  solvedCount: number;
  itemPoints: number;
  puzzlePrize: number;
  gamePrize: number;
  totalPrize: number;
  setTeamName: (value: string) => void;
  toggleProblem: (index: number) => void;
  toggleGame: (game: GameKey) => void;
  undo: () => void;
  reset: () => void;
  exitAdmin: () => void;
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <main className="admin-container">
      <header className="admin-header">
        <div>
          <p className="eyebrow">STAFF MODE</p>

          <h1 className="admin-title">得点管理</h1>
        </div>

        <button className="button" onClick={exitAdmin}>
          表示画面へ
        </button>
      </header>

      <section className="admin-section">
        <h2>現在の状態</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          <div>
            <div className="summary-label">チーム</div>

            <strong>{state.teamName}</strong>
          </div>

          <div>
            <div className="summary-label">アイテムポイント</div>

            <strong>{itemPoints} pt</strong>
          </div>

          <div>
            <div className="summary-label">謎の賞金</div>

            <strong>{puzzlePrize} Laq</strong>
          </div>

          <div>
            <div className="summary-label">総賞金</div>

            <strong>{totalPrize} Laq</strong>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>基本情報</h2>

        <input
          className="team-input"
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="チーム名"
          value={state.teamName}
        />
      </section>

      <section className="admin-section">
        <div className="panel-header">
          <h2>賞金獲得謎</h2>

          <div className="panel-description">
            正解 {solvedCount} / {PROBLEM_COUNT} 問
          </div>
        </div>

        <div className="admin-problem-grid">
          {state.solved.map((solved, index) => (
            <button
              className={`admin-problem ${solved ? "solved" : ""}`}
              key={index}
              onClick={() => toggleProblem(index)}
              title={`第${index + 1}問 / ${problemReward(index)} Laq`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="panel-header">
          <h2>ゲーム</h2>

          <div className="panel-description">
            ゲームによる賞金：{gamePrize} Laq
          </div>
        </div>

        <div className="admin-game-grid">
          {GAMES.map((game) => {
            const solved = state.games[game.key];

            return (
              <div className="admin-game" key={game.key}>
                <div>
                  <div className="admin-game-name">{game.name}</div>

                  <div
                    style={{
                      marginTop: 4,
                      color: "#6c757d",
                      fontSize: 12,
                    }}
                  >
                    {game.reward} Laq
                  </div>
                </div>

                <button
                  className={`admin-game-button ${solved ? "solved" : ""}`}
                  onClick={() => toggleGame(game.key)}
                >
                  {solved ? "クリア" : "未クリア"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="admin-section">
        <div className="panel-header">
          <h2>操作履歴</h2>

          <button
            className="button"
            disabled={history.length === 0}
            onClick={undo}
          >
            一つ戻す
          </button>
        </div>

        <div className="history">
          {history.length === 0 ? (
            <div
              style={{
                padding: 14,
                color: "#8a9198",
                fontSize: 13,
              }}
            >
              操作履歴はありません。
            </div>
          ) : (
            history.map((entry) => (
              <div className="history-row" key={entry.id}>
                <span className="history-time">{entry.time}</span>

                <span>{entry.description}</span>
              </div>
            ))
          )}
        </div>

        <div className="admin-actions">
          <div className="panel-description">
            最新の操作から順番に取り消せます。
          </div>

          {!confirmReset ? (
            <button className="button" onClick={() => setConfirmReset(true)}>
              初期化
            </button>
          ) : (
            <div
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <button className="button" onClick={() => setConfirmReset(false)}>
                キャンセル
              </button>

              <button
                className="button danger"
                onClick={() => {
                  reset();
                  setConfirmReset(false);
                }}
              >
                初期化する
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PointSystem;
