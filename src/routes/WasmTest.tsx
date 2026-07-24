import { useEffect, useState } from "react";

import ModuleFactory from "../wasm/module";

const sample = `a={1,2,3}
contains(a,1)
contains(a,4)
b={x%3==1}
c=a&b
contains(c,1)
d=a|b
e=(a|b)&d
f=!a
`;

export default function WasmTest() {
  const [module, setModule] = useState<any>();
  const [input, setInput] = useState(sample);
  const [output, setOutput] = useState("");

  useEffect(() => {
    ModuleFactory().then(setModule);
  }, []);

  const run = () => {
    if (!module) return;

    const result = module.ccall("solve_c", "string", ["string"], [input]);

    setOutput(result);
  };

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-bold">関数による集合表現</h1>

        <p className="text-slate-600">
          情報理工学基礎レポート「C++
          における内包的定義に基づいた柔軟な集合データ構造の設計と実装」のデモページです。
        </p>

        <div>
          <h2 className="mb-2 font-semibold">入力</h2>

          <textarea
            className="h-64 w-full rounded border p-3 font-mono"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
        </div>

        <button
          className="rounded bg-blue-600 px-5 py-2 text-white disabled:bg-gray-400"
          disabled={!module}
          onClick={run}
        >
          {module ? "実行" : "読み込み中..."}
        </button>

        <div>
          <h2 className="mb-2 font-semibold">出力</h2>

          <textarea
            className="h-64 w-full rounded border p-3 font-mono"
            readOnly
            value={output}
          />
        </div>
      </div>
    </section>
  );
}
