import { useState } from "react";

const RandomPickerPage = () => {
  const [number, setnumber] = useState(40);
  const [student, setStudent] = useState([1]);
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
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // 要素の交換
    }
    setStudent(newArray);
  };
  const showstudent = () => {
    return student.map((v) => {
      return { v };
    });
  };
  return (
    <div>
      <h1>RandomPicker</h1>
      <div>
        生徒数を入力した後、初期化をクリックしてください。ランダムに並べ替えられた数が表示されます
      </div>
      <input
        onChange={(e) => setnumber(Number(e.target.value))}
        type="number"
        value={number}
      />
      <p>生徒数{number}人</p>
      <a onClick={initsystem}>しょきか</a>
      <ul>
        {showstudent().map((v) => (
          <li key={v.v}>{v.v}</li>
        ))}
      </ul>
    </div>
  );
};

export default RandomPickerPage;
