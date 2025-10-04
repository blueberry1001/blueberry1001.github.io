import React, { useRef, useState } from "react";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ions = [
  "Li",
  "K",
  "Ca",
  "Na",
  "Mg",
  "Al",
  "Zn",
  "Fe",
  "Ni",
  "Sn",
  "Pb",
  "H₂",
  "Cu",
  "Hg",
  "Ag",
  "Pt",
  "Au",
];

type CardProps = {
  name: string;
  index: number;
  moveCard: (from: number, to: number) => void;
  isCorrect: boolean;
};

const Card: React.FC<CardProps> = ({ name, index, moveCard, isCorrect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: "CARD",
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        background: isCorrect ? "#aaffaa" : "#fff",
        border: "1px solid #333",
        borderRadius: 8,
        width: 60,
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 8,
        fontSize: 24,
        cursor: "grab",
        boxShadow: "2px 2px 6px #ccc",
        transition: "background 0.2s",
      }}
    >
      {name}
    </div>
  );
};

const shuffle = (array: string[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const IonPage = () => {
  const [cards, setCards] = useState<string[]>(() => shuffle(ions)); // 初回ランダム
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const moveCard = (from: number, to: number) => {
    const updated = [...cards];
    const [removed] = updated.splice(from, 1);
    updated.splice(to, 0, removed);
    setCards(updated);
  };

  const isCorrect = (name: string, idx: number) => ions[idx] === name;
  const allCorrect = cards.every((name, idx) => isCorrect(name, idx));

  React.useEffect(() => {
    if (started && !allCorrect) {
      timerRef.current = setInterval(() => {
        if (startTime !== null) {
          setElapsed(Date.now() - startTime);
        }
      }, 100);
    }
    if (allCorrect && started) {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, allCorrect, startTime]);

  const handleStart = () => {
    setCards(shuffle(ions));
    setStarted(true);
    setStartTime(Date.now());
    setElapsed(0);
  };

  const handleShowAnswer = () => {
    setCards(ions);
    setStarted(false);
    setElapsed(0);
    setStartTime(null);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: 32 }}>
        <h2>イオン化傾向 並べ替えゲーム</h2>
        <button disabled={started && !allCorrect} onClick={handleStart}>
          スタート
        </button>
        <button onClick={handleShowAnswer} style={{ marginLeft: 8 }}>
          答えを見る
        </button>
        <div style={{ margin: "16px 0" }}>
          {started && (
            <span>
              経過時間: {(elapsed / 1000).toFixed(2)} 秒
              {allCorrect && (
                <span style={{ color: "green", marginLeft: 16 }}>クリア！</span>
              )}
            </span>
          )}
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            maxWidth: 1100,
          }}
        >
          {cards.map((name, idx) => (
            <React.Fragment key={name}>
              <Card
                index={idx}
                isCorrect={isCorrect(name, idx)}
                moveCard={moveCard}
                name={name}
              />
              {idx < cards.length - 1 && (
                <span
                  style={{
                    fontSize: 32,
                    margin: "0 4px",
                    display: "flex",
                    alignItems: "center",
                    height: 80, // カードと同じ高さ
                  }}
                >
                  {">"}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </DndProvider>
  );
};
export default IonPage;
