import { useLayoutEffect, useRef, useState } from "react";

import thinkersData from "@/assets/thinkers.json";

type Thinker = {
  id: string;
  name: string;
  description: string[];
  books: string[];
  religion: string;
  era?: string;
  region?: string;
};

const thinkers = thinkersData as Thinker[];

const ThinkersListPage = () => {
  const [openedId, setOpenedId] = useState<string | null>(null);
  const [prevOpenedId, setPrevOpenedId] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const detailRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 開くアニメーションを開始（DOM更新直後に実行）
  useLayoutEffect(() => {
    if (openingId && detailRefs.current[openingId]) {
      const element = detailRefs.current[openingId];
      // 次のフレームで.openクラスを適用（アニメーションを開始）
      requestAnimationFrame(() => {
        if (element) {
          element.classList.remove("opening");
          element.classList.add("open");
        }
      });
    }
  }, [openingId]);

  const toggleOpen = (id: string) => {
    // 前のタイマーをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (openedId === id) {
      // 同じアイテムを閉じる処理
      setPrevOpenedId(id);
      setOpenedId(null);
      setOpeningId(null);
      // アニメーション完了後にprevOpenedIdをクリア
      timeoutRef.current = setTimeout(() => {
        setPrevOpenedId(null);
        timeoutRef.current = null;
      }, 400);
    } else {
      // 別のアイテムを開く処理
      if (openedId) {
        // 既に開いているアイテムを閉じる（同時に新しいアイテムを開く）
        setPrevOpenedId(openedId);
        setOpeningId(id);
        setOpenedId(id); // 新しいアイテムを即座に開く（閉じるアニメーションと同時に）
        // アニメーション完了後にprevOpenedIdとopeningIdをクリア
        timeoutRef.current = setTimeout(() => {
          setPrevOpenedId(null);
          setOpeningId(null);
          timeoutRef.current = null;
        }, 400);
      } else {
        // 何も開いていない場合は即座に開く
        setOpeningId(id);
        setOpenedId(id);
        // 開くアニメーション完了後にopeningIdをクリア
        timeoutRef.current = setTimeout(() => {
          setOpeningId(null);
          timeoutRef.current = null;
        }, 400);
      }
    }
  };

  return (
    <div className="thinkers-page">
      <h1>公共・倫理 思想家 一覧</h1>
      <p className="thinkers-intro">
        共通テスト「公共・倫理」でよく出る思想家を一覧で確認できます。
        名前をクリックすると、「説明」「主著」「宗教」などの情報が表示されます。
      </p>
      <ul className="thinkers-list">
        {thinkers.map((t) => {
          const isOpen = openedId === t.id;
          return (
            <li className="thinker-item" key={t.id}>
              <button
                className="thinker-name-button"
                onClick={() => toggleOpen(t.id)}
                type="button"
              >
                {t.name}
                <span
                  className={`thinker-toggle-mark ${isOpen ? "rotated" : ""}`}
                >
                  {isOpen ? "▲" : "▼"}
                </span>
              </button>
              {(isOpen || prevOpenedId === t.id || openingId === t.id) && (
                <div
                  className={`thinker-detail ${
                    isOpen && openingId !== t.id
                      ? "open"
                      : prevOpenedId === t.id
                        ? "closing"
                        : "opening"
                  }`}
                  ref={(el) => {
                    if (openingId === t.id) {
                      detailRefs.current[t.id] = el;
                    }
                  }}
                >
                  <div className="thinker-section">
                    <h3>説明</h3>
                    <ul>
                      {t.description.map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="thinker-section">
                    <h3>主著</h3>
                    {t.books.length > 0 ? (
                      <ul>
                        {t.books.map((b) => (
                          <li key={b}>{b}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>主著のデータは登録されていません。</p>
                    )}
                  </div>
                  <div className="thinker-section">
                    <h3>宗教</h3>
                    <p>{t.religion || "特になし"}</p>
                  </div>
                  {(t.era || t.region) && (
                    <div className="thinker-meta">
                      {t.era && <span>時代: {t.era}</span>}
                      {t.region && <span> / 地域: {t.region}</span>}
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ThinkersListPage;
