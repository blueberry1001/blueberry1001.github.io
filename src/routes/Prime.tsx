import { useState } from "react";

const PrimePage = () => {
  const [value, setValue] = useState(57);
  const primeFactorization = (n: number) => {
    if (!Number.isFinite(n) || n < 2) {
      return "2以上の整数を入力してください。";
    }
    if (n > 1000000000000) {
      return "入力された数が大きすぎます。";
    }

    let target = Math.floor(n);
    let ret = "";
    for (let i = 2; i * i <= target; i++) {
      while (target % i === 0) {
        ret += (ret ? "*" : "") + String(i);
        target /= i;
      }
    }
    if (target > 1) ret += (ret ? "*" : "") + String(target);
    return ret;
  };

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-3xl font-black text-slate-900">素因数分解ツール</h1>
        <p className="mb-8 text-slate-600">
          入力した整数を素因数分解します。上限は 10^12、計算量は O(√N) です。
        </p>

        <label className="mb-3 block text-sm font-semibold text-slate-700" htmlFor="prime-number-input">
          分解したい数
        </label>
        <input
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          id="prime-number-input"
          min={2}
          onChange={(e) => setValue(Number(e.target.value))}
          step={1}
          type="number"
          value={value}
        />

        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="mb-2 text-sm font-semibold text-blue-700">結果</p>
          <p className="break-all text-xl font-bold text-slate-900">{primeFactorization(value)}</p>
        </div>
      </div>
    </section>
  );
};

export default PrimePage;
