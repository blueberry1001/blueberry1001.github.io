import thinkersData from "@/assets/thinkers.json";
import { useMemo, useState } from "react";

type Thinker = {
  id: string;
  name: string;
  description: string[];
  books: string[];
  religion: string;
  era?: string;
  region?: string;
};

type Mode =
  | "description-to-thinker"
  | "book-to-thinker"
  | "thinker-to-book";

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

const ThinkersQuizPage = () => {
  const [mode, setMode] = useState<Mode>("description-to-thinker");
  const [question, setQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [resultMessage, setResultMessage] = useState<string>("");
  const [pendingRetries, setPendingRetries] = useState<PendingRetry[]>([]);
  const [isRetryQuestion, setIsRetryQuestion] = useState(false);

  const thinkersWithBooks = useMemo(
    () => thinkers.filter((t) => t.books.length > 0),
    []
  );

  // 再出題キューを更新（カウントを減らし、0になったものを返す）
  const updatePendingRetries = (): PendingRetry | null => {
    const updated = pendingRetries
      .map((retry) => ({
        ...retry,
        remainingQuestions: retry.remainingQuestions - 1,
      }))
      .filter((retry) => retry.remainingQuestions >= 0);

    const readyToRetry = updated.find((retry) => retry.remainingQuestions === 0);
    setPendingRetries(updated.filter((retry) => retry.remainingQuestions > 0));

    return readyToRetry || null;
  };

  // 問題を生成する関数（再出題用）
  const generateQuestionFromRetry = (retry: PendingRetry): Question | null => {
    const thinker = thinkers.find((t) => t.id === retry.thinkerId);
    if (!thinker) return null;

    if (retry.mode === "description-to-thinker") {
      const desc = retry.promptContent;
      const otherThinkers = shuffle(
        thinkers.filter((t) => t.id !== thinker.id)
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
      };
    } else if (retry.mode === "book-to-thinker") {
      const book = retry.promptContent;
      const otherThinkers = shuffle(
        thinkersWithBooks.filter((t) => t.id !== thinker.id)
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
      };
    } else if (retry.mode === "thinker-to-book") {
      const book = retry.promptContent;
      const otherBooks = shuffle(
        thinkersWithBooks
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
    let q: Question | null = null;

    if (currentMode === "description-to-thinker") {
      const thinker = pickRandom(thinkers);
      const desc = pickRandom(thinker.description);

      const otherThinkers = shuffle(
        thinkers.filter((t) => t.id !== thinker.id)
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
      };
    } else if (currentMode === "book-to-thinker") {
      if (thinkersWithBooks.length === 0) {
        q = null;
      } else {
        const thinker = pickRandom(thinkersWithBooks);
        const book = pickRandom(thinker.books);

        const otherThinkers = shuffle(
          thinkersWithBooks.filter((t) => t.id !== thinker.id)
        ).slice(0, 3);
        const options = shuffle([thinker, ...otherThinkers]).map(
          (t) => t.name
        );
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
        };
      }
    } else if (currentMode === "thinker-to-book") {
      if (thinkersWithBooks.length === 0) {
        q = null;
      } else {
        const thinker = pickRandom(thinkersWithBooks);
        const book = pickRandom(thinker.books);

        const otherBooks = shuffle(
          thinkersWithBooks
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

  const handleOptionClick = (index: number) => {
    if (!question) return;
    setSelected(index);
    if (index === question.correctIndex) {
      setResultMessage("正解！よく覚えていますね。");
    } else {
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
    }
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
          出題モード:
          <select value={mode} onChange={handleModeChange}>
            <option value="description-to-thinker">
              説明 → 思想家 を答える
            </option>
            <option value="book-to-thinker">
              主著 → 思想家 を答える
            </option>
            <option value="thinker-to-book">
              思想家 → 主著 を答える
            </option>
          </select>
        </label>
        {!question && (
          <button
            type="button"
            className="primary-button"
            onClick={() => generateQuestion(mode)}
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
              {isRetryQuestion && (
                <span className="retry-badge">再出題</span>
              )}
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
                      type="button"
                      className={classNames}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOptionClick(idx);
                      }}
                      disabled={selected !== null}
                    >
                      {opt}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          {resultMessage && (
            <div className="quiz-result">{resultMessage}</div>
          )}
          <div className="quiz-next-button-container">
            <button
              type="button"
              className="primary-button quiz-next-button"
              onClick={(e) => {
                e.stopPropagation();
                generateQuestion(mode);
              }}
            >
              次の問題
            </button>
          </div>
        </div>
      ) : (
        <p className="quiz-hint">
          「次の問題」ボタンを押すと問題が表示されます。
          主著データが少ない場合は、モードによって問題が作れないことがあります。
        </p>
      )}
    </div>
  );
};

export default ThinkersQuizPage;


