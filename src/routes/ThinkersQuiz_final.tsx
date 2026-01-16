import { useMemo, useState } from "react";

import thinkersData from "@/assets/thinkers2.json";

type Thinker = {
  id: string;
  name: string;
  description: string[];
  books: string[];
  religion: string;
  era?: string;
  region?: string;
  priority?: string;
};

type Mode =
  | "description-to-thinker"
  | "book-to-thinker"
  | "thinker-to-book"
  | "thinker-to-description";

const thinkers = thinkersData as Thinker[];

type Question = {
  prompt: string;
  options: string[];
  correctIndex: number;
  promptLabel: string;
  answerLabel: string;
  questionId: string; // 問題を一意に識別するID
  mode: Mode;
  thinkerId?: string; // 思想家ID（再出題用）
  promptContent?: string; // プロンプトの内容（再出題用）
  optionThinkerIds?: string[]; // 選択肢として出てきた思想家のID
};

type PendingRetry = {
  questionId: string;
  mode: Mode;
  thinkerId: string;
  promptContent: string;
  remainingQuestions: number; // 残り何問後に再出題するか
};

const pickRandom = <T,>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

const shuffle = <T,>(items: T[]): T[] => {
  return [...items].sort(() => Math.random() - 0.5);
};

const ThinkersQuizPage_final = () => {
  const [mode, setMode] = useState<Mode>("description-to-thinker");
  const [selectedEra, setSelectedEra] = useState<string>("すべて");
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [pendingRetries, setPendingRetries] = useState<PendingRetry[]>([]);
  const [isRetryQuestion, setIsRetryQuestion] = useState(false);

  const currentThinkers = useMemo(() => {
    const filteredThinkers = thinkers.filter((t) => t.priority === "1");
    if (selectedEra === "すべて") return filteredThinkers;
    return filteredThinkers.filter((t) => t.era === selectedEra);
  }, [selectedEra]);

  const currentThinkersWithBooks = useMemo(
    () => currentThinkers.filter((t) => t.books.length > 0),
    [currentThinkers]
  );

  // 再出題キューを更新（カウントを減らし、0になったものを返す）
  const updatePendingRetries = (): PendingRetry | null => {
    const decremented = pendingRetries.map((retry) => ({
      ...retry,
      remainingQuestions: retry.remainingQuestions - 1,
    }));

    // 出題待ち（残り0以下）かつ現在の年代設定に合うものを探す
    const candidates = decremented.filter(
      (retry) => retry.remainingQuestions <= 0
    );

    let readyToRetry: PendingRetry | undefined;

    if (selectedEra === "すべて") {
      readyToRetry = candidates[0];
    } else {
      readyToRetry = candidates.find((retry) => {
        const t = thinkers.find((thinker) => thinker.id === retry.thinkerId);
        return t?.era === selectedEra;
      });
    }

    // 更新後のキューを作成
    // 1. まだ待ちのもの (remainingQuestions > 0)
    // 2. 待機中だが今回選ばれなかったもの (picked 以外)
    const nextPending = decremented.filter((retry) => {
      if (retry.remainingQuestions > 0) return true;
      if (readyToRetry && retry.questionId === readyToRetry.questionId)
        return false;
      return true;
    });

    setPendingRetries(nextPending);
    return readyToRetry || null;
  };

  // 問題を生成する関数（再出題用）
  const generateQuestionFromRetry = (retry: PendingRetry): Question | null => {
    const thinker = thinkers.find((t) => t.id === retry.thinkerId);
    if (!thinker) return null;

    // 選択肢（ダミー）は現在の年代設定の中から選ぶ
    const candidateThinkers = currentThinkers.some((t) => t.id === thinker.id)
      ? currentThinkers
      : thinkers;
    const candidateThinkersWithBooks = currentThinkersWithBooks.some(
      (t) => t.id === thinker.id
    )
      ? currentThinkersWithBooks
      : thinkers.filter((t) => t.books.length > 0);

    if (retry.mode === "description-to-thinker") {
      const desc = retry.promptContent;
      const otherThinkers = shuffle(
        candidateThinkers.filter((t) => t.id !== thinker.id)
      ).slice(0, 3);
      const options = shuffle([thinker, ...otherThinkers]).map((t) => t.name);
      const correctIndex = options.indexOf(thinker.name);

      return {
        prompt: desc,
        options,
        correctIndex,
        promptLabel: "説明",
        answerLabel: "思想家",
        questionId: `${retry.mode}-${thinker.id}-${desc}`,
        mode: retry.mode,
        thinkerId: thinker.id,
        promptContent: desc,
        optionThinkerIds: [thinker, ...otherThinkers].map((t) => t.id),
      };
    } else if (retry.mode === "book-to-thinker") {
      const book = retry.promptContent;
      const otherThinkers = shuffle(
        candidateThinkersWithBooks.filter((t) => t.id !== thinker.id)
      ).slice(0, 3);
      const options = shuffle([thinker, ...otherThinkers]).map((t) => t.name);
      const correctIndex = options.indexOf(thinker.name);

      return {
        prompt: book,
        options,
        correctIndex,
        promptLabel: "主著",
        answerLabel: "思想家",
        questionId: `${retry.mode}-${thinker.id}-${book}`,
        mode: retry.mode,
        thinkerId: thinker.id,
        promptContent: book,
        optionThinkerIds: [thinker, ...otherThinkers].map((t) => t.id),
      };
    } else if (retry.mode === "thinker-to-description") {
      const desc = retry.promptContent;
      const otherPairs = shuffle(
        candidateThinkers
          .filter((t) => t.id !== thinker.id)
          .flatMap((t) =>
            t.description.map((d) => ({ desc: d, thinkerId: t.id }))
          )
      ).slice(0, 3);
      const paired = shuffle([{ desc, thinkerId: thinker.id }, ...otherPairs]);
      const options = paired.map((p) => p.desc);
      const optionThinkerIds = paired.map((p) => p.thinkerId);
      const correctIndex = options.indexOf(desc);

      return {
        prompt: thinker.name,
        options,
        correctIndex,
        promptLabel: "思想家",
        answerLabel: "説明",
        questionId: `${retry.mode}-${thinker.id}-${desc}`,
        mode: retry.mode,
        thinkerId: thinker.id,
        promptContent: desc,
        optionThinkerIds,
      };
    } else if (retry.mode === "thinker-to-book") {
      const book = retry.promptContent;
      const otherBooks = shuffle(
        candidateThinkersWithBooks
          .filter((t) => t.id !== thinker.id)
          .flatMap((t) => t.books)
      ).slice(0, 3);
      const options = shuffle([book, ...otherBooks]);
      const correctIndex = options.indexOf(book);

      return {
        prompt: thinker.name,
        options,
        correctIndex,
        promptLabel: "思想家",
        answerLabel: "主著",
        questionId: `${retry.mode}-${thinker.id}-${book}`,
        mode: retry.mode,
        thinkerId: thinker.id,
        promptContent: book,
        optionThinkerIds: [thinker.id],
      };
    }

    return null;
  };

  const generateQuestion = (currentMode: Mode) => {
    // まず、再出題キューを更新して、再出題すべき問題があるかチェック
    const retryQuestion = updatePendingRetries();
    if (retryQuestion) {
      const q = generateQuestionFromRetry(retryQuestion);
      if (q) {
        setQuestion(q);
        setSelected(null);
        setResultMessage("");
        setIsRetryQuestion(true);
        return;
      }
    }
    setIsRetryQuestion(false);

    // 通常の問題生成
    if (currentThinkers.length === 0) {
      alert("選択された年代のデータがありません。");
      setQuestion(null);
      return;
    }

    let q: Question | null = null;

    if (currentMode === "description-to-thinker") {
      const thinker = pickRandom(currentThinkers);
      const desc = pickRandom(thinker.description);

      const otherThinkers = shuffle(
        currentThinkers.filter((t) => t.id !== thinker.id)
      ).slice(0, 3);
      const options = shuffle([thinker, ...otherThinkers]).map((t) => t.name);
      const correctIndex = options.indexOf(thinker.name);

      q = {
        prompt: desc,
        options,
        correctIndex,
        promptLabel: "説明",
        answerLabel: "思想家",
        questionId: `${currentMode}-${thinker.id}-${desc}`,
        mode: currentMode,
        thinkerId: thinker.id,
        promptContent: desc,
        optionThinkerIds: [thinker, ...otherThinkers].map((t) => t.id),
      };
    } else if (currentMode === "book-to-thinker") {
      if (currentThinkersWithBooks.length === 0) {
        q = null;
      } else {
        const thinker = pickRandom(currentThinkersWithBooks);
        const book = pickRandom(thinker.books);

        const otherThinkers = shuffle(
          currentThinkersWithBooks.filter((t) => t.id !== thinker.id)
        ).slice(0, 3);
        const options = shuffle([thinker, ...otherThinkers]).map((t) => t.name);
        const correctIndex = options.indexOf(thinker.name);

        q = {
          prompt: book,
          options,
          correctIndex,
          promptLabel: "主著",
          answerLabel: "思想家",
          questionId: `${currentMode}-${thinker.id}-${book}`,
          mode: currentMode,
          thinkerId: thinker.id,
          promptContent: book,
          optionThinkerIds: [thinker, ...otherThinkers].map((t) => t.id),
        };
      }
    } else if (currentMode === "thinker-to-description") {
      const thinker = pickRandom(currentThinkers);
      const desc = pickRandom(thinker.description);

      const otherPairs = shuffle(
        currentThinkers
          .filter((t) => t.id !== thinker.id)
          .flatMap((t) =>
            t.description.map((d) => ({ desc: d, thinkerId: t.id }))
          )
      ).slice(0, 3);
      const paired = shuffle([{ desc, thinkerId: thinker.id }, ...otherPairs]);
      const options = paired.map((p) => p.desc);
      const optionThinkerIds = paired.map((p) => p.thinkerId);
      const correctIndex = options.indexOf(desc);

      q = {
        prompt: thinker.name,
        options,
        correctIndex,
        promptLabel: "思想家",
        answerLabel: "説明",
        questionId: `${currentMode}-${thinker.id}-${desc}`,
        mode: currentMode,
        thinkerId: thinker.id,
        promptContent: desc,
        optionThinkerIds,
      };
    } else if (currentMode === "thinker-to-book") {
      if (currentThinkersWithBooks.length === 0) {
        q = null;
      } else {
        const thinker = pickRandom(currentThinkersWithBooks);
        const book = pickRandom(thinker.books);

        const otherBooks = shuffle(
          currentThinkersWithBooks
            .filter((t) => t.id !== thinker.id)
            .flatMap((t) => t.books)
        ).slice(0, 3);
        const options = shuffle([book, ...otherBooks]);
        const correctIndex = options.indexOf(book);

        q = {
          prompt: thinker.name,
          options,
          correctIndex,
          promptLabel: "思想家",
          answerLabel: "主著",
          questionId: `${currentMode}-${thinker.id}-${book}`,
          mode: currentMode,
          thinkerId: thinker.id,
          promptContent: book,
          optionThinkerIds: [thinker.id],
        };
      }
    }

    setQuestion(q);
    setSelected(null);
    setResultMessage("");
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as Mode;
    setMode(newMode);
    generateQuestion(newMode);
  };

  const handleEraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEra(e.target.value);
    setQuestion(null);
    setResultMessage("");
    setSelected(null);
  };

  const processIncorrectAnswer = () => {
    if (!question) return;
    setResultMessage(
      `不正解…。正しい${question.answerLabel}は「${
        question.options[question.correctIndex]
      }」です。`
    );

    // 誤答した問題を再出題キューに追加（3-7問後に再出題）
    if (question.thinkerId && question.promptContent) {
      // 既に同じ問題がキューにないかチェック
      const alreadyQueued = pendingRetries.some(
        (retry) => retry.questionId === question.questionId
      );
      if (!alreadyQueued) {
        const retryAfter = Math.floor(Math.random() * 5) + 3; // 3-7問後
        const newRetry: PendingRetry = {
          questionId: question.questionId,
          mode: question.mode,
          thinkerId: question.thinkerId,
          promptContent: question.promptContent,
          remainingQuestions: retryAfter,
        };
        setPendingRetries((prev) => [...prev, newRetry]);
      }
    }
  };

  const handleOptionClick = (index: number) => {
    if (!question) return;
    setSelected(index);
    if (index === question.correctIndex) {
      setResultMessage("正解！よく覚えていますね。");
    } else {
      processIncorrectAnswer();
    }
  };

  const handleDontKnow = () => {
    if (!question) return;
    setSelected(-1); // "わからない"を選択した状態（どの選択肢も選択されていないように見えるが、解説は表示される）
    processIncorrectAnswer();
  };

  return (
    <div className="thinkers-quiz-page">
      <h1>公共・倫理 思想家 一問一答</h1>
      <p className="thinkers-intro">
        共通テスト対策用の一問一答モードです。
        出題モードを選んで「次の問題」ボタンを押すと、ランダムな問題が表示されます。
        間違えた問題は、3-7問後に自動的に再出題されます。
      </p>

      <div className="quiz-controls">
        <label>
          年代:
          <select onChange={handleEraChange} value={selectedEra}>
            <option value="すべて">すべて</option>
            <option value="古代">古代</option>
            <option value="中世">中世</option>
            <option value="近代">近代</option>
            <option value="現代">現代</option>
          </select>
        </label>
        <label>
          出題モード:
          <select onChange={handleModeChange} value={mode}>
            <option value="description-to-thinker">
              説明 → 思想家 を答える
            </option>
            <option value="book-to-thinker">主著 → 思想家 を答える</option>
            <option value="thinker-to-book">思想家 → 主著 を答える</option>
            <option value="thinker-to-description">
              思想家 → 説明 を答える
            </option>
          </select>
        </label>
        {!question && (
          <button
            className="primary-button"
            onClick={() => generateQuestion(mode)}
            type="button"
          >
            問題を開始
          </button>
        )}
      </div>

      {question ? (
        <div
          className="quiz-area"
          onClick={() => {
            if (selected !== null) {
              generateQuestion(mode);
            }
          }}
        >
          <div className="quiz-prompt">
            <div className="quiz-label">
              {question.promptLabel}
              {isRetryQuestion && <span className="retry-badge">再出題</span>}
            </div>
            <p>{question.prompt}</p>
          </div>
          <div className="quiz-options">
            <div className="quiz-label">{question.answerLabel} を選ぶ</div>
            <ul>
              {question.options.map((opt, idx) => {
                const isSelected = selected === idx;
                const isCorrect = idx === question.correctIndex;
                const classNames = [
                  "quiz-option-button",
                  isSelected ? "selected" : "",
                  selected !== null && isCorrect ? "correct" : "",
                  selected !== null && isSelected && !isCorrect
                    ? "incorrect"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <li key={idx}>
                    <button
                      className={classNames}
                      disabled={selected !== null}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClick(idx);
                      }}
                      type="button"
                    >
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {resultMessage && <div className="quiz-result">{resultMessage}</div>}
          <div className="quiz-next-button-container" style={{ gap: "1rem" }}>
            <button
              className="primary-button quiz-next-button"
              onClick={(e) => {
                e.stopPropagation();
                generateQuestion(mode);
              }}
              type="button"
            >
              次の問題
            </button>
            {selected === null && (
              <button
                className="quiz-next-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDontKnow();
                }}
                style={{
                  backgroundColor: "#6c757d",
                  color: "white",
                  borderColor: "#6c757d",
                }}
                type="button"
              >
                わからない
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="quiz-hint">
          「次の問題」ボタンを押すと問題が表示されます。
          主著データが少ない場合は、モードによって問題が作れないことがあります。
        </p>
      )}

      {/* 選択肢として出てきた思想家の説明 */}
      {question && (
        <div className="quiz-thinkers-explanation">
          <h2>選択肢の思想家について</h2>
          {selected !== null && question.optionThinkerIds ? (
            <ul className="thinkers-list">
              {question.optionThinkerIds.map((thinkerId) => {
                const thinker = thinkers.find((t) => t.id === thinkerId);
                if (!thinker) return null;
                return (
                  <li className="thinker-item" key={thinkerId}>
                    <div
                      className="thinker-name-button"
                      style={{ cursor: "default" }}
                    >
                      {thinker.name}
                    </div>
                    <div className="thinker-detail open">
                      <div className="thinker-section">
                        <h3>説明</h3>
                        <ul>
                          {thinker.description.map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="thinker-section">
                        <h3>主著</h3>
                        {thinker.books.length > 0 ? (
                          <ul>
                            {thinker.books.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>主著のデータは登録されていません。</p>
                        )}
                      </div>
                      <div className="thinker-section">
                        <h3>宗教</h3>
                        <p>{thinker.religion || "特になし"}</p>
                      </div>
                      {(thinker.era || thinker.region) && (
                        <div className="thinker-meta">
                          {thinker.era && <span>時代: {thinker.era}</span>}
                          {thinker.region && (
                            <span> / 地域: {thinker.region}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p style={{ color: "#999", fontStyle: "italic" }}>
              回答を選択すると、選択肢として出てきた思想家の説明が表示されます。
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ThinkersQuizPage_final;
