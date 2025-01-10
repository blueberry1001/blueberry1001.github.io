import { useState } from "react";

const PrimePage = () => {
  const [value, setValue] = useState(57);
  function prime_factrization(n: number) {
    if (n > 1000000000000) {
      return "入力された数が大きすぎます。";
    }
    let ret = "";
    for (let i = 2; i * i <= n; i++) {
      while (n % i === 0) {
        ret += (ret ? "*" : "") + String(i);
        n /= i;
      }
    }
    if (n > 1) ret += (ret ? "*" : "") + String(n);
    return ret;
  }
  return (
    <div>
      <h1>素因数分解</h1>
      <div>
        入力された数を素因数分解します。桁数上限は11桁、計算量はO(√N)です。
      </div>
      <input
        onChange={(e) => setValue(Number(e.target.value))}
        type="number"
        value={value}
      />
      <p>{prime_factrization(value)}</p>
    </div>
  );
};

export default PrimePage;
