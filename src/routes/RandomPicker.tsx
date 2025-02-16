import { useState } from "react";
import "./RandomPicker.css";
const RandomPickerPage = () => {
  const [number, setnumber] = useState(40);
  const [student, setStudent] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const initsystem = () => {
    if (number > 1000) {
      return alert("入力された数が大きすぎます。");
    }
    let tmpv = [];
    for (let i = 0; i < number; i++) {
      tmpv.push(i + 1);
    }
    const newArray = [...tmpv];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    setStudent(newArray);
    setCurrentIndex(0);
    setIsInitialized(true);
  };

  const showNextNumber = () => {
    if (currentIndex < student.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="wrapper">
      <h1 className="title">ランダムピッカー</h1>
      <div className="description">
        生徒数を入力した後、初期化をクリックしてください。「次へ」ボタンで順番に数字が表示されます。
      </div>

      <div className="input-section">
        <div className="input-group">
          <input
            className="number-input"
            max="1000"
            min="1"
            onChange={(e) => setnumber(Number(e.target.value))}
            type="number"
            value={number}
          />
          <p>生徒数: {number}人</p>
        </div>

        <button className="primary-button" onClick={initsystem}>
          初期化
        </button>
      </div>

      {isInitialized && (
        <div className="display-section">
          <div className="number-display">{student[currentIndex]}</div>
          <div className="progress-text">
            {currentIndex + 1} / {student.length}
          </div>
          <button
            className="secondary-button"
            disabled={currentIndex >= student.length - 1}
            onClick={showNextNumber}
          >
            次へ
          </button>
        </div>
      )}
    </div>
  );
};

export default RandomPickerPage;
