import React, { useRef, useState } from "react";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./Chemistry_ion.css";

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
      className={`ion-card${isCorrect ? " ion-card-correct" : ""}`}
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <span className="ion-card-position">{index + 1}</span>
      <span className="ion-card-symbol">{name}</span>
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
      <section aria-labelledby="ion-game-title" className="ion-game">
        <div className="ion-game-heading">
          <h1 id="ion-game-title">
            イオン化傾向 <span>並べ替えゲーム</span>
          </h1>
          <p>イオン化傾向が大きい順に、左から右・上から下へ並べよう。</p>
        </div>
        <div className="ion-game-toolbar">
          <div className="ion-game-actions">
            <button
              className="ion-start"
              disabled={started && !allCorrect}
              onClick={handleStart}
              type="button"
            >
              {allCorrect && started ? "もう一度遊ぶ" : "スタート"}
            </button>
            <button
              className="ion-answer"
              onClick={handleShowAnswer}
              type="button"
            >
              答えを見る
            </button>
          </div>
          <div className="ion-game-time">
            <span>経過時間</span>
            <strong>
              {(elapsed / 1000).toFixed(1)}
              <small> 秒</small>
            </strong>
          </div>
        </div>
        <div className="ion-game-board">
          <div className="ion-game-guide">
            <span>大きい → 小さい</span>
            <span>正しい位置のカードは緑色</span>
          </div>
          <ol aria-label="イオン化傾向の並び順" className="ion-game-cards">
            {cards.map((name, idx) => (
              <li className="ion-game-slot" key={name}>
                <Card
                  index={idx}
                  isCorrect={isCorrect(name, idx)}
                  moveCard={moveCard}
                  name={name}
                />
              </li>
            ))}
          </ol>
          <p className="ion-game-message" role="status">
            {started && allCorrect
              ? "クリア！すべて正しい順番です。"
              : "カードをドラッグして並べ替えてください。"}
          </p>
        </div>
      </section>
    </DndProvider>
  );
};
export default IonPage;
