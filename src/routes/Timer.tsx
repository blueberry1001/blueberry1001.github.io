import { useEffect, useRef, useState } from "react";
import "./Timer.css";

interface LapData {
  questionNumber: number;
  duration: number;
  score: string;
}

const TimerPage = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapData[]>([]);
  const [subject, setSubject] = useState("数学 I・A");
  const [examType, setExamType] = useState<"past" | "past_second" | "workbook">(
    "past_second"
  );
  const [source, setSource] = useState("本試験");
  const [year, setYear] = useState("2025");
  const [edition, setEdition] = useState("第1回");
  const [showModal, setShowModal] = useState(false);
  const [timerMode, setTimerMode] = useState<"normal" | "extended">("extended");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const SUBJECTS = [
    "数学 I・A",
    "数学 II・B・C",
    "英語 (Reading)",
    "英語 (Listening)",
    "国語",
    "物理",
    "化学",
    "生物",
    "地学",
    "公共・倫理",
    "公共・政治経済",
    "日本史",
    "世界史",
    "地理",
    "倫理・政治経済",
    "公共",
    "情報",
  ];

  const PAST_EXAM_SOURCES = ["本試験", "追試験", "試行調査"];

  const WORKBOOK_SOURCES = [
    "実戦問題集（駿台）",
    "実戦模試（Z会）",
    "実戦模試（河合塾）",
    "予想問題集（Z会）",
    "その他",
  ];

  const YEARS = [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
  ];

  const EDITIONS = ["第1回", "第2回", "第3回", "第4回", "第5回", "第6回"];

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
        if (timerMode === "extended") {
          setLaps((prevLaps) => {
            const newLaps = [...prevLaps];
            if (newLaps[currentQuestionIndex]) {
              newLaps[currentQuestionIndex] = {
                ...newLaps[currentQuestionIndex],
                duration: newLaps[currentQuestionIndex].duration + 1,
              };
            }
            return newLaps;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerMode, currentQuestionIndex]);

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (timerMode === "extended" && laps.length === 0) {
      setLaps([{ questionNumber: 1, duration: 0, score: "" }]);
      setCurrentQuestionIndex(0);
    }
    setIsRunning(true);
  };

  const handleStop = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setCurrentQuestionIndex(0);
  };

  const handleLap = () => {
    if (timerMode === "normal") {
      const lastLapTime =
        laps.length > 0 ? laps.reduce((sum, lap) => sum + lap.duration, 0) : 0;
      const duration = time - lastLapTime;
      setLaps([
        ...laps,
        { questionNumber: laps.length + 1, duration, score: "" },
      ]);
    } else {
      if (currentQuestionIndex === laps.length - 1) {
        setLaps([
          ...laps,
          { questionNumber: laps.length + 1, duration: 0, score: "" },
        ]);
        setCurrentQuestionIndex(laps.length);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const handleScoreChange = (index: number, value: string) => {
    const newLaps = [...laps];
    newLaps[index].score = value;
    setLaps(newLaps);
  };

  const getTotalScore = () => {
    let total = 0;
    laps.forEach((lap) => {
      const score = parseInt(lap.score);
      if (!isNaN(score)) total += score;
    });
    return total;
  };

  const handleExport = () => {
    // タイトル生成
    let title = "";
    if (examType === "past" || examType === "past_second") {
      title = `${year}年 ${source}`;
    } else {
      title = `${source} ${edition}`;
    }

    let text = title;
    text += `【${subject}】`;
    text += ` ${formatTime(time)}\n`;
    text += `合計得点: ${getTotalScore()}\n`;
    text += `-----------------------------\n`;

    laps.forEach((lap) => {
      const scoreNum = parseInt(lap.score);
      const pointsPerMin =
        !isNaN(scoreNum) && lap.duration > 0
          ? ((scoreNum / lap.duration) * 60).toFixed(2)
          : "-";
      text += `大問${lap.questionNumber}: ${lap.score || "-"}点(${formatTime(lap.duration)}) ${pointsPerMin}点/分\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      setShowModal(true);
    });
  };

  return (
    <div className="timer-container">
      <div className="timer-header">
        <h1>過去問タイマー(共テ用)</h1>
        <div className="timer-settings">
          <div className="setting-group">
            <label>科目</label>
            <select
              onChange={(e) => setSubject(e.target.value)}
              value={subject}
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="setting-group">
            <label>種類</label>
            <select
              onChange={(e) => {
                const newType = e.target.value as
                  | "past"
                  | "past_second"
                  | "workbook";
                setExamType(newType);
                setSource(newType === "past" ? "本試験" : "実戦問題集（駿台）");
              }}
              value={examType}
            >
              <option value="past">過去問(共通テスト)</option>
              <option value="past_second">過去問(二次試験)</option>
              <option value="workbook">問題集</option>
            </select>
          </div>
          <div className="setting-group">
            <label>
              {examType === "past" || examType === "past_second"
                ? "試験"
                : "問題集"}
            </label>
            <select onChange={(e) => setSource(e.target.value)} value={source}>
              {(examType === "past" || examType === "past_second"
                ? PAST_EXAM_SOURCES
                : WORKBOOK_SOURCES
              ).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="setting-group">
            <label>
              {examType === "past" || examType === "past_second"
                ? "年度"
                : "回"}
            </label>
            {examType === "past" || examType === "past_second" ? (
              <select onChange={(e) => setYear(e.target.value)} value={year}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}年
                  </option>
                ))}
              </select>
            ) : (
              <select
                onChange={(e) => setEdition(e.target.value)}
                value={edition}
              >
                {EDITIONS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="mode-selector">
        <button
          className={`mode-btn ${timerMode === "normal" ? "active" : ""}`}
          disabled={isRunning || time > 0}
          onClick={() => setTimerMode("normal")}
        >
          通常版
        </button>
        <button
          className={`mode-btn ${timerMode === "extended" ? "active" : ""}`}
          disabled={isRunning || time > 0}
          onClick={() => setTimerMode("extended")}
        >
          拡張版
        </button>
      </div>

      {timerMode === "extended" && laps.length > 0 && (
        <div className="question-nav">
          {laps.map((_, i) => (
            <button
              className={`nav-btn ${currentQuestionIndex === i ? "active" : ""}`}
              key={i}
              onClick={() => setCurrentQuestionIndex(i)}
            >
              {i + 1}
            </button>
          ))}
          {!isRunning && (
            <button
              className="nav-btn"
              onClick={() => {
                const nextNum = laps.length + 1;
                setLaps([
                  ...laps,
                  { questionNumber: nextNum, duration: 0, score: "" },
                ]);
                setCurrentQuestionIndex(laps.length);
              }}
              style={{ color: "#764ba2" }}
            >
              +
            </button>
          )}
        </div>
      )}

      <div className="timer-display-container">
        {timerMode === "extended" && laps.length > 0 && (
          <div className="current-question-info">
            大問 {currentQuestionIndex + 1} を解答中
          </div>
        )}
        <div className="timer-display">
          {timerMode === "extended" && laps[currentQuestionIndex]
            ? formatTime(laps[currentQuestionIndex].duration)
            : formatTime(time)}
        </div>
        {timerMode === "extended" && (
          <div className="total-time-mini">合計時間: {formatTime(time)}</div>
        )}
      </div>

      <div className="timer-controls">
        {!isRunning ? (
          <button className="btn btn-primary" onClick={handleStart}>
            {time === 0 ? "スタート" : "再開"}
          </button>
        ) : (
          <>
            <button className="btn btn-accent" onClick={handleLap}>
              {timerMode === "normal"
                ? "次の大問"
                : currentQuestionIndex === laps.length - 1
                  ? "次の大問へ"
                  : "次へ進む"}
            </button>
            <button className="btn btn-danger" onClick={handleStop}>
              ストップ
            </button>
          </>
        )}
        <button
          className="btn btn-secondary"
          disabled={isRunning}
          onClick={handleReset}
        >
          リセット
        </button>
      </div>

      <div className="laps-section">
        <h2>大問ごとの記録</h2>
        {laps.length === 0 ? (
          <p className="empty-message">
            スタートボタンを押して開始してください
          </p>
        ) : (
          <table className="laps-table">
            <thead>
              <tr>
                <th>大問</th>
                <th>時間</th>
                <th>得点</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap, index) => (
                <tr
                  className={`${timerMode === "extended" && currentQuestionIndex === index ? "active-row" : ""} ${timerMode === "extended" ? "clickable-row" : ""}`}
                  key={index}
                  onClick={() =>
                    timerMode === "extended" && setCurrentQuestionIndex(index)
                  }
                  title={
                    timerMode === "extended"
                      ? `大問 ${lap.questionNumber} に切り替え`
                      : ""
                  }
                >
                  <td>大問 {lap.questionNumber}</td>
                  <td className="time-cell">{formatTime(lap.duration)}</td>
                  <td>
                    <input
                      className="score-input"
                      onChange={(e) => handleScoreChange(index, e.target.value)}
                      onClick={(e) => e.stopPropagation()} // 文字入力時に行クリックイベントが走らないようにする
                      placeholder="-"
                      type="text"
                      value={lap.score}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {laps.length > 0 && (
          <div className="total-score">
            <span>合計得点:</span>
            <span className="score-value">{getTotalScore()}</span>
          </div>
        )}
      </div>

      {laps.length > 0 && (
        <div className="export-section">
          <button className="btn btn-export" onClick={handleExport}>
            結果をコピー
          </button>
        </div>
      )}

      {showModal && (
        <div className="toast-notification">
          <div className="toast-icon">✓</div>
          <span>コピーしました</span>
          <button className="toast-close" onClick={() => setShowModal(false)}>
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default TimerPage;
