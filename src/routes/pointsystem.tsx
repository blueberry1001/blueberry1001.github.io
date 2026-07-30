import { useEffect, useMemo, useState } from "react";

const TEAM_COUNT = 6;
const PROBLEM_COUNT = 50;

const TEAM_NAMES = ["Team A", "Team B", "Team C", "Team D", "Team E", "Team F"];

type HistoryEntry = {
  time: string;
  team: number;
  problem: number;
  value: boolean;
};

const STORAGE_KEY = "point-system-data-v1";

const PointSystem = () => {
  const [answers, setAnswers] = useState<boolean[][]>(() =>
    Array.from({ length: TEAM_COUNT }, () => Array(PROBLEM_COUNT).fill(false))
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [team, setTeam] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      if (data.answers) setAnswers(data.answers);
      if (data.history) setHistory(data.history);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers,
        history,
      })
    );
  }, [answers, history]);

  const scoreOfProblem = (problem: number) => Math.floor(problem / 10) + 1;

  const scores = useMemo(() => {
    return answers.map((teamAnswer) =>
      teamAnswer.reduce((sum, ok, i) => sum + (ok ? scoreOfProblem(i) : 0), 0)
    );
  }, [answers]);

  const toggle = (problem: number) => {
    const value = !answers[team][problem];

    const next = answers.map((v) => [...v]);
    next[team][problem] = value;
    setAnswers(next);

    setHistory((h) => [
      {
        time: new Date().toLocaleTimeString(),
        team,
        problem,
        value,
      },
      ...h,
    ]);
  };
  const undo = () => {
    if (history.length === 0) return;

    const last = history[0];

    const next = answers.map((v) => [...v]);
    next[last.team][last.problem] = !last.value;

    setAnswers(next);
    setHistory((h) => h.slice(1));
  };

  const clear = () => {
    if (!window.confirm("すべてのデータを削除しますか？")) return;

    const init = Array.from({ length: TEAM_COUNT }, () =>
      Array(PROBLEM_COUNT).fill(false)
    );

    setAnswers(init);
    setHistory([]);
  };

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "32px auto",
        padding: 24,
        fontFamily: "'Inter','Noto Sans JP',sans-serif",
        color: "#2b2d42",
      }}
    >
      <h1
        style={{
          marginBottom: 20,
          fontWeight: 600,
          fontSize: 30,
        }}
      >
        得点管理
      </h1>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        {TEAM_NAMES.map((name, i) => (
          <button
            key={i}
            onClick={() => setTeam(i)}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: team === i ? "#3d5a80" : "#dfe7ec",
              color: team === i ? "white" : "#293241",
              fontWeight: 600,
            }}
          >
            {name}
            {"  "}({scores[i]}点)
          </button>
        ))}

        <div style={{ flex: 1 }} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10,1fr)",
          gap: 8,
        }}
      >
        {Array.from({ length: PROBLEM_COUNT }).map((_, i) => {
          const ok = answers[team][i];

          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                aspectRatio: "1",
                borderRadius: 10,
                border: "1px solid #cfd8dc",
                background: ok ? "#84a98c" : "#f7f7f7",
                color: ok ? "white" : "#495057",
                cursor: "pointer",
                transition: "0.15s",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                fontSize: 14,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                {i + 1}
              </div>

              <div
                style={{
                  fontSize: 20,
                  lineHeight: 1,
                }}
              >
                {ok ? "○" : "×"}
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 11,
                  opacity: 0.8,
                }}
              >
                {scoreOfProblem(i)}点
              </div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 32,
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 24,
        }}
      >
        <div>
          <h2
            style={{
              fontSize: 20,
              marginBottom: 12,
            }}
          >
            得点一覧
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              {TEAM_NAMES.map((name, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "6px 0",
                    }}
                  >
                    {name}
                  </td>

                  <td
                    style={{
                      textAlign: "right",
                      fontWeight: 700,
                    }}
                  >
                    {scores[i]}点
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2
              style={{
                fontSize: 20,
                margin: 0,
              }}
            >
              操作履歴
            </h2>

            <button
              disabled={history.length === 0}
              onClick={undo}
              style={{
                padding: "6px 14px",
                border: "1px solid #cfd8dc",
                borderRadius: 6,
                background: history.length === 0 ? "#eceff1" : "#f7f7f7",
                color: "#2b2d42",
                cursor: history.length === 0 ? "default" : "pointer",
              }}
            >
              一つ戻す
            </button>
          </div>

          <div
            style={{
              height: 220,
              overflow: "auto",
              border: "1px solid #d8dee3",
              borderRadius: 8,
              background: "#fafafa",
            }}
          >
            {history.length === 0 ? (
              <div
                style={{
                  padding: 16,
                  color: "#777",
                }}
              >
                履歴はありません。
              </div>
            ) : (
              history.map((h, i) => (
                <div
                  key={i}
                  style={{
                    padding: "8px 12px",
                    borderBottom: "1px solid #eceff1",
                    fontSize: 14,
                  }}
                >
                  {h.time}
                  {"　"}
                  {TEAM_NAMES[h.team]}
                  {"　"}問{h.problem + 1}
                  {" → "}
                  {h.value ? "○" : "×"}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointSystem;
