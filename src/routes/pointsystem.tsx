import { useEffect, useMemo, useRef, useState } from "react";

const PROBLEM_COUNT = 50;
const STORAGE_KEY = "mystery-point-system-v5";

/*
 * 管理者PIN
 * 公演前に好きな4桁へ変更してください。
 */
const ADMIN_PIN = "4729";

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

/*
 * 初期状態
 */
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

/*
 * 状態を完全にコピー
 */
const cloneState = (state: State): State => ({
  teamName: state.teamName,
  solved: [...state.solved],
  games: {
    ...state.games,
  },
});

/*
 * 問題番号から賞金を求める。
 *
 * 1～10問目  → 1 Laq
 * 11～20問目 → 2 Laq
 * 21～30問目 → 3 Laq
 * 31～40問目 → 4 Laq
 * 41～50問目 → 5 Laq
 */
const getProblemReward = (index: number) => {
  return Math.floor(index / 10) + 1;
};

const PointSystem = () => {
  const [state, setState] = useState<State>(createDefaultState());

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const [admin, setAdmin] = useState(false);

  /*
   * 管理者認証用
   */
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState("");

  /*
   * 右上の隠し長押し
   */
  const holdTimer = useRef<number | null>(null);

  /*
   * このページだけbodyの背景等を変更。
   * PointSystemがアンマウントされたら元に戻す。
   */
  useEffect(() => {
    document.body.classList.add("point-system-body");

    return () => {
      document.body.classList.remove("point-system-body");
    };
  }, []);

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
      console.warn("保存された得点データを読み込めませんでした。");
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
   * 「賞金獲得謎の正解数」そのもの。
   */
  const itemPoints = useMemo(() => {
    return state.solved.filter(Boolean).length;
  }, [state.solved]);

  /*
   * 賞金獲得謎による賞金
   */
  const puzzlePrize = useMemo(() => {
    return state.solved.reduce((sum, solved, index) => {
      if (!solved) return sum;

      return sum + getProblemReward(index);
    }, 0);
  }, [state.solved]);

  /*
   * ゲームによる賞金
   */
  const gamePrize = useMemo(() => {
    return GAMES.reduce((sum, game) => {
      return sum + (state.games[game.key] ? game.reward : 0);
    }, 0);
  }, [state.games]);

  /*
   * 総賞金
   */
  const totalPrize = puzzlePrize + gamePrize;

  /*
   * 操作履歴を追加
   */
  const addHistory = (previous: State, description: string) => {
    const entry: HistoryEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      description,
      previous: cloneState(previous),
    };

    setHistory((prev) => [entry, ...prev]);
  };

  /*
   * 状態変更と履歴保存を同時に行う
   */
  const updateState = (updater: (next: State) => void, description: string) => {
    const previous = cloneState(state);
    const next = cloneState(state);

    updater(next);

    setState(next);
    addHistory(previous, description);
  };

  /*
   * 小問の正解／未正解を切り替える
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
   * ゲームのクリア／未クリアを切り替える
   */
  const toggleGame = (gameKey: GameKey) => {
    const nextValue = !state.games[gameKey];

    const game = GAMES.find((item) => item.key === gameKey);

    updateState(
      (next) => {
        next.games[gameKey] = nextValue;
      },
      `${game?.name ?? `ゲーム${gameKey}`}を${
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
   * 初期化
   *
   * 管理者画面からのみ実行可能。
   */
  const reset = () => {
    const previous = cloneState(state);

    setState(createDefaultState());

    setHistory((prev) => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        description: "全データを初期化",
        previous,
      },
      ...prev,
    ]);
  };

  /*
   * 隠し長押し開始
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
   * 長押しキャンセル
   */
  const cancelAdminHold = () => {
    if (holdTimer.current !== null) {
      window.clearTimeout(holdTimer.current);

      holdTimer.current = null;
    }
  };

  /*
   * 管理者認証
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
   * 管理者画面からプレイヤー画面へ
   */
  const exitAdmin = () => {
    setAdmin(false);
  };

  return (
    <div className="point-system">
      <style>{`
        /*
         * ============================================================
         * Color palette
         * ============================================================
         *
         * Casino green
         *   #006B16
         *
         * Dark green
         *   #004F10
         *
         * Wood brown
         *   #9A5B0A
         *
         * Dark wood
         *   #704006
         *
         * Card / ivory
         *   #F1F0E8
         *
         * Background
         *   #E7E5DC
         *
         * Ink
         *   #182028
         *
         * Muted
         *   #697078
         *
         * Red accent
         *   #AD3028
         */

        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
        }

        body.point-system-body {
          background: #006B16;
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
          color: #182028;
          background:
            linear-gradient(
              to bottom,
              #9A5B0A 0,
              #9A5B0A 13px,
              #704006 13px,
              #704006 17px,
              #006B16 17px,
              #006B16 100%
            );
        }

        /*
         * ============================================================
         * Secret admin area
         * ============================================================
         */

        .secret-area {
          position: fixed;
          top: 0;
          right: 0;
          z-index: 100;
          width: 90px;
          height: 90px;
          touch-action: none;
          user-select: none;
        }

        /*
         * ============================================================
         * Player screen
         * ============================================================
         */

        .container {
          width: min(
            1080px,
            calc(100% - 40px)
          );

          margin: 0 auto;
          padding: 56px 0 64px;
        }

        .header {
          margin-bottom: 28px;
          color: #F1F0E8;
        }

        .eyebrow {
          margin: 0 0 7px;

          color: rgba(
            241,
            240,
            232,
            .68
          );

          font-size: 12px;
          font-weight: 700;
          letter-spacing: .13em;
        }

        .title {
          margin: 0;

          font-size: 32px;
          line-height: 1.2;
          font-weight: 700;
          letter-spacing: -.025em;
        }

        .team-name {
          color: #272626;
        }

        /*
         * ============================================================
         * Summary
         * ============================================================
         */

        .summary {
          display: grid;

          grid-template-columns:
            1.45fr
            1fr
            1fr;

          gap: 12px;

          margin-bottom: 18px;
        }

        .summary-card {
          min-height: 120px;

          padding: 22px 24px;

          border:
            1px solid
            #C9C7BC;

          border-radius: 9px;

          background: #F1F0E8;

          box-shadow:
            0 2px 0
            rgba(0, 0, 0, .08);
        }

        .summary-card.primary {
          border-color: #704006;
        }

        .summary-label {
          margin-bottom: 10px;

          color: #697078;

          font-size: 12px;
          font-weight: 700;
          letter-spacing: .04em;
        }

        .summary-value {
          font-size: 32px;
          line-height: 1;
          font-weight: 700;
        }

        .summary-value.large {
          font-size: 43px;
        }

        .summary-unit {
          margin-left: 6px;

          color: #697078;

          font-size: 14px;
          font-weight: 500;
        }

        /*
         * ============================================================
         * Common panel
         * ============================================================
         */

        .panel {
          padding: 24px;

          margin-bottom: 14px;

          border:
            1px solid
            #C9C7BC;

          border-radius: 9px;

          background: #F1F0E8;

          box-shadow:
            0 2px 0
            rgba(0, 0, 0, .08);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;

          margin-bottom: 20px;
        }

        .panel-title {
          margin: 0;

          font-size: 18px;
          line-height: 1.2;
          font-weight: 700;
        }

        .panel-description {
          color: #697078;

          font-size: 12px;
        }

        /*
         * ============================================================
         * Problem grid
         * ============================================================
         */

        .problem-grid {
          display: grid;

          grid-template-columns:
            repeat(10, minmax(0, 1fr));

          gap: 7px;
        }

        .problem {
          position: relative;

          aspect-ratio: 1;

          min-width: 0;

          border:
            1px solid
            #C9C7BC;

          border-radius: 7px;

          background: #FAF9F3;

          color: #697078;

          overflow: hidden;
        }

        .problem.solved {
          border-color: #004F10;

          background: #006B16;

          color: #FFFFFF;
        }

        .problem-number {
          position: absolute;

          top: 7px;
          left: 8px;

          font-size: 11px;
          line-height: 1;

          font-weight: 700;
        }

        .problem-mark {
          display: flex;

          align-items: center;
          justify-content: center;

          width: 100%;
          height: 100%;

          padding-top: 4px;

          font-size: 22px;
          font-weight: 400;
        }

        .problem-points {
          position: absolute;

          right: 7px;
          bottom: 6px;

          font-size: 9px;
          line-height: 1;

          opacity: .7;
        }

        /*
         * ============================================================
         * Games
         * ============================================================
         */

        .game-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 10px;
        }

        .game-card {
          padding: 18px;

          border:
            1px solid
            #C9C7BC;

          border-radius: 8px;

          background: #FAF9F3;
        }

        .game-name {
          margin-bottom: 9px;

          font-size: 14px;
          font-weight: 700;
        }

        .game-reward {
          font-size: 25px;
          line-height: 1;

          font-weight: 700;
        }

        .game-reward span {
          margin-left: 5px;

          color: #697078;

          font-size: 12px;
          font-weight: 500;
        }

        /*
         * ============================================================
         * Admin screen
         * ============================================================
         */

        .admin-container {
          width: min(
            1080px,
            calc(100% - 40px)
          );

          margin: 0 auto;

          padding: 34px 0 60px;
        }

        .admin-header {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 20px;

          margin-bottom: 20px;

          color: #F1F0E8;
        }

        .admin-title {
          margin: 0;

          font-size: 25px;
          line-height: 1.2;
        }

        .admin-section {
          padding: 22px;

          margin-bottom: 14px;

          border:
            1px solid
            #C9C7BC;

          border-radius: 9px;

          background: #F1F0E8;

          box-shadow:
            0 2px 0
            rgba(0, 0, 0, .08);
        }

        .admin-section h2 {
          margin: 0 0 16px;

          font-size: 17px;
          line-height: 1.2;
        }

        /*
         * ============================================================
         * Buttons
         * ============================================================
         */

        .button {
          padding: 9px 14px;

          border:
            1px solid
            #BBB9AF;

          border-radius: 6px;

          background: #FFFFFF;

          color: #182028;

          cursor: pointer;

          transition:
            background .12s,
            border-color .12s;
        }

        .button:hover {
          background: #EAE9E2;
        }

        .button.primary {
          border-color: #004F10;

          background: #006B16;

          color: #FFFFFF;
        }

        .button.primary:hover {
          background: #005A13;
        }

        .button.danger {
          border-color: #8E2521;

          background: #AD3028;

          color: #FFFFFF;
        }

        .button:disabled {
          opacity: .4;
          cursor: default;
        }

        /*
         * ============================================================
         * Team name
         * ============================================================
         */

        .team-input {
          width: 100%;
          max-width: 360px;

          padding: 10px 12px;

          border:
            1px solid
            #BBB9AF;

          border-radius: 6px;

          background: #FFFFFF;

          color: #182028;

          outline: none;
        }

        .team-input:focus {
          border-color: #006B16;

          box-shadow:
            0 0 0 2px
            rgba(0, 107, 22, .12);
        }

        /*
         * ============================================================
         * Admin problem grid
         * ============================================================
         */

        .admin-problem-grid {
          display: grid;

          grid-template-columns:
            repeat(10, minmax(0, 1fr));

          gap: 6px;
        }

        .admin-problem {
          aspect-ratio: 1;

          padding: 0;

          border:
            1px solid
            #C9C7BC;

          border-radius: 6px;

          background: #FAF9F3;

          color: #697078;

          cursor: pointer;

          font-weight: 700;
        }

        .admin-problem:hover {
          border-color: #006B16;
        }

        .admin-problem.solved {
          border-color: #004F10;

          background: #006B16;

          color: #FFFFFF;
        }

        /*
         * ============================================================
         * Admin games
         * ============================================================
         */

        .admin-game-grid {
          display: grid;

          grid-template-columns:
            repeat(4, 1fr);

          gap: 10px;
        }

        .admin-game {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 12px;

          padding: 15px;

          border:
            1px solid
            #C9C7BC;

          border-radius: 8px;

          background: #FAF9F3;
        }

        .admin-game-name {
          font-size: 14px;
          font-weight: 700;
        }

        .admin-game-button {
          min-width: 78px;

          padding: 8px 11px;

          border:
            1px solid
            #BBB9AF;

          border-radius: 6px;

          background: #FFFFFF;

          color: #697078;

          cursor: pointer;
        }

        .admin-game-button.solved {
          border-color: #004F10;

          background: #006B16;

          color: #FFFFFF;
        }

        /*
         * ============================================================
         * History
         * ============================================================
         */

        .history {
          max-height: 300px;

          overflow: auto;

          border:
            1px solid
            #D6D4CA;

          border-radius: 6px;

          background: #FAF9F3;
        }

        .history-row {
          display: flex;

          gap: 16px;

          padding: 9px 12px;

          border-bottom:
            1px solid
            #E5E3DA;

          font-size: 13px;
        }

        .history-row:last-child {
          border-bottom: none;
        }

        .history-time {
          flex: 0 0 72px;

          color: #8A9198;
        }

        .admin-actions {
          display: flex;

          align-items: center;
          justify-content: space-between;

          gap: 12px;

          margin-top: 18px;
        }

        /*
         * ============================================================
         * Modal
         * ============================================================
         */

        .modal-backdrop {
          position: fixed;

          inset: 0;

          z-index: 1000;

          display: flex;

          align-items: center;
          justify-content: center;

          padding: 20px;

          background:
            rgba(24, 32, 40, .42);
        }

        .modal {
          width: min(
            360px,
            100%
          );

          padding: 28px;

          border-radius: 9px;

          background: #F1F0E8;

          box-shadow:
            0 18px 50px
            rgba(0, 0, 0, .2);
        }

        .modal h2 {
          margin: 0 0 8px;

          font-size: 20px;
        }

        .modal p {
          margin: 0 0 18px;

          color: #697078;

          font-size: 13px;
        }

        .pin-input {
          width: 100%;

          padding: 11px 12px;

          border:
            1px solid
            #BBB9AF;

          border-radius: 6px;

          background: #FFFFFF;

          color: #182028;

          text-align: center;

          font-size: 22px;

          letter-spacing: .25em;

          outline: none;
        }

        .pin-input:focus {
          border-color: #006B16;
        }

        .modal-actions {
          display: flex;

          justify-content: flex-end;

          gap: 8px;

          margin-top: 16px;
        }

        /*
         * ============================================================
         * Responsive
         * ============================================================
         */

        @media (max-width: 700px) {
          .container,
          .admin-container {
            width: calc(100% - 24px);

            padding-top: 30px;
          }

          .summary {
            grid-template-columns:
              1fr 1fr;
          }

          .summary-card.primary {
            grid-column: 1 / -1;
          }

          .summary-value.large {
            font-size: 36px;
          }

          .problem-grid {
            gap: 4px;
          }

          .problem-number {
            top: 5px;
            left: 6px;

            font-size: 9px;
          }

          .problem-mark {
            font-size: 16px;
          }

          .problem-points {
            right: 4px;
            bottom: 4px;

            font-size: 7px;
          }

          .game-grid,
          .admin-game-grid {
            grid-template-columns:
              1fr 1fr;
          }

          .admin-problem-grid {
            gap: 4px;
          }

          .admin-problem {
            font-size: 11px;
          }
        }

        @media (max-width: 430px) {
          .container,
          .admin-container {
            width: calc(100% - 16px);
          }

          .panel,
          .admin-section {
            padding: 16px;
          }

          .summary-card {
            padding: 17px;
          }

          .summary-value {
            font-size: 26px;
          }

          .summary-value.large {
            font-size: 32px;
          }

          .game-card {
            padding: 14px;
          }

          .game-reward {
            font-size: 21px;
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
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) {
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
              onChange={(event) => {
                setAdminPin(event.target.value.replace(/\D/g, ""));
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
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

/*
 * ================================================================
 * Player screen
 * ================================================================
 */

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
        <p className="eyebrow">PRIZE MANAGEMENT</p>

        <h1 className="title">
          <span className="team-name">{state.teamName}</span>
        </h1>
        <p className="eyebrow">PRIZE MANAGEMENT</p>
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

              <div className="problem-points">
                {getProblemReward(index)} Laq
              </div>
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

/*
 * ================================================================
 * Admin screen
 * ================================================================
 */

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
          onChange={(event) => setTeamName(event.target.value)}
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
              title={`第${index + 1}問 / ${getProblemReward(index)} Laq`}
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
                      color: "#697078",
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
                color: "#8A9198",
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
