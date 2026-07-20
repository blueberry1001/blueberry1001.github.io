import { useEffect, useState } from "react";

import ModuleFactory from "../wasm/module";

const sample = `5
1 2 3 4 5
5
1 1 5
2 2 100
1 1 5
2 4 1000
1 3 5`;

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
        <h1 className="text-3xl font-bold">WebAssembly 動作確認</h1>

        <p className="text-slate-600">
          WebAssemblyの実行テストです。セグ木で一点更新・区間取得するC++コードをJavaScriptから動かしています。
          <br></br>
          1行目に配列の長さN、2行目には配列の初期値、3行目にはクエリの数Q、4行目以降にはクエリをQ行書いてください。
          <br></br>1 l rで[l,r]の区間和を出力、<br></br>2 i xでA[i]=xです。
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
