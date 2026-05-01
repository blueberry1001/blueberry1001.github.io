import { useState } from "react";

const RandomPickerPage = () => {
  const [number, setNumber] = useState(40);
  const [student, setStudent] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const initSystem = () => {
    if (number > 1000) {
      alert("入力された数が大きすぎます。");
      return;
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
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-3xl font-black text-slate-900">ランダムピッカー</h1>
        <p className="mb-8 text-slate-600">
          生徒数を入力して初期化すると、重複なしのランダム順で番号を表示できます。
        </p>

        <div className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="student-count">
              生徒数
            </label>
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
              id="student-count"
              max="1000"
              min="1"
              onChange={(e) => setNumber(Number(e.target.value))}
              type="number"
              value={number}
            />
          </div>
          <button
            className="rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition hover:bg-cyan-700"
            onClick={initSystem}
            type="button"
          >
            初期化
          </button>
        </div>

        <p className="mb-6 text-sm text-slate-500">現在の設定: {number}人</p>

        {isInitialized ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 text-center">
              <p className="mb-2 text-sm font-medium text-slate-500">抽選結果</p>
              <div className="text-6xl font-black text-slate-900">{student[currentIndex]}</div>
            </div>
            <div className="mb-4 text-center text-sm text-slate-500">
              {currentIndex + 1} / {student.length}
            </div>
            <div className="flex justify-center">
              <button
                className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={currentIndex >= student.length - 1}
                onClick={showNextNumber}
                type="button"
              >
                次へ
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">
            初期化すると抽選結果が表示されます。
          </div>
        )}
      </div>
    </section>
  );
};

export default RandomPickerPage;
