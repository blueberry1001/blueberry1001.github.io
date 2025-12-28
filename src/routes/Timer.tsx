import { useEffect, useRef, useState } from 'react';
import './Timer.css';

interface LapData {
  questionNumber: number;
  duration: number;
  score: string;
}

const TimerPage = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapData[]>([]);
  const [subject, setSubject] = useState('数学 I・A');
  const [examType, setExamType] = useState<'past' | 'workbook'>('past');
  const [source, setSource] = useState('本試験');
  const [year, setYear] = useState('2025');
  const [edition, setEdition] = useState('第1回');
  const [showModal, setShowModal] = useState(false);
  const timerRef = useRef<number | null>(null);

  const SUBJECTS = [
    '数学 I・A',
    '数学 II・B・C',
    '英語 (Reading)',
    '英語 (Listening)',
    '国語',
    '物理',
    '化学',
    '生物',
    '地学',
    '公共・倫理',
    '日本史',
    '世界史',
    '地理',
    '倫理・政治経済',
    '公共',
    '情報',
  ];

  const PAST_EXAM_SOURCES = ['本試験', '追試験', '試行調査'];

  const WORKBOOK_SOURCES = [
    '実戦問題集（駿台）',
    '実戦模試（Z会）',
    '実戦模試（河合塾）',
    '予想問題集（Z会）',
    'その他',
  ];

  const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];

  const EDITIONS = ['第1回', '第2回', '第3回', '第4回', '第5回', '第6回'];

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    const lastLapTime = laps.length > 0 ? laps.reduce((sum, lap) => sum + lap.duration, 0) : 0;
    const duration = time - lastLapTime;
    setLaps([...laps, { questionNumber: laps.length + 1, duration, score: '' }]);
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
    let title = '';
    if (examType === 'past') {
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
      const pointsPerMin = !isNaN(scoreNum) && lap.duration > 0 
        ? (scoreNum / lap.duration * 60).toFixed(2) 
        : '-';
      text += `大問${lap.questionNumber}: ${lap.score || '-'}点(${formatTime(lap.duration)}) ${pointsPerMin}点/分\n`;
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
            <select value={subject} onChange={(e) => setSubject(e.target.value)}>
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
              value={examType}
              onChange={(e) => {
                const newType = e.target.value as 'past' | 'workbook';
                setExamType(newType);
                setSource(newType === 'past' ? '本試験' : '実戦問題集（駿台）');
              }}
            >
              <option value="past">過去問</option>
              <option value="workbook">問題集</option>
            </select>
          </div>
          <div className="setting-group">
            <label>{examType === 'past' ? '試験' : '問題集'}</label>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              {(examType === 'past' ? PAST_EXAM_SOURCES : WORKBOOK_SOURCES).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="setting-group">
            <label>{examType === 'past' ? '年度' : '回'}</label>
            {examType === 'past' ? (
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}年
                  </option>
                ))}
              </select>
            ) : (
              <select value={edition} onChange={(e) => setEdition(e.target.value)}>
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

      <div className="timer-display">{formatTime(time)}</div>

      <div className="timer-controls">
        {!isRunning ? (
          <button className="btn btn-primary" onClick={handleStart}>
            {time === 0 ? 'スタート' : '再開'}
          </button>
        ) : (
          <>
            <button className="btn btn-accent" onClick={handleLap}>
              次の大問
            </button>
            <button className="btn btn-danger" onClick={handleStop}>
              ストップ
            </button>
          </>
        )}
        <button className="btn btn-secondary" onClick={handleReset} disabled={isRunning}>
          リセット
        </button>
      </div>

      <div className="laps-section">
        <h2>大問ごとの記録</h2>
        {laps.length === 0 ? (
          <p className="empty-message">スタートボタンを押して開始してください</p>
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
                <tr key={index}>
                  <td>大問 {lap.questionNumber}</td>
                  <td className="time-cell">{formatTime(lap.duration)}</td>
                  <td>
                    <input
                      type="text"
                      className="score-input"
                      value={lap.score}
                      onChange={(e) => handleScoreChange(index, e.target.value)}
                      placeholder="-"
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
