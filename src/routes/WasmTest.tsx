import { useEffect, useState } from "react";

import ModuleFactory from "../wasm/module";

const DEFAULT_SAMPLE = `a={1,2,3}
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
  const [input, setInput] = useState(DEFAULT_SAMPLE);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    ModuleFactory().then(setModule);
  }, []);

  const run = () => {
    if (!module) return;
    try {
      const result = module.ccall("solve_c", "string", ["string"], [input]);
      setOutput(result);
    } catch (err) {
      setOutput(`[Error] 構文エラーまたは実行エラーが発生しました:\n${err}`);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* ヘッダーエリア */}
        <header className="border-b border-slate-200 pb-6">
          <div className="inline-block rounded-md bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 mb-2">
            Wasm Playground
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            関数による集合表現
          </h1>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            C++で実装された「内包的定義に基づいた集合データ構造」のインタラクティブデモです。
            <br />
            有限集合だけでなく、述語による無限集合や補集合・論理積・論理和などの集合演算に対応しています。
          </p>
        </header>

        {/* 簡易構文ガイド */}
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs sm:text-sm text-slate-600 shadow-sm">
          <p className="font-bold text-slate-800 mb-1">使える構文・演算子</p>
          <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2 list-disc list-inside">
            <li>
              有限集合:{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded">
                a=&#123;1,2,3&#125;
              </code>
            </li>
            <li>
              無限集合 (剰余のみ対応):{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded">
                b=&#123;x%3==1&#125;
              </code>
            </li>
            <li>
              集合演算:{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded">&</code> (積),{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded">|</code> (和),{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded">!</code> (補),{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded">-</code> (差)
            </li>
            <li>
              判定コマンド:{" "}
              <code className="bg-slate-100 px-1 py-0.5 rounded">
                contains(集合名, 値)
              </code>
            </li>
          </ul>
        </div>

        {/* メイン入力エリア */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">入力スクリプト</h2>
            <div className="space-x-2">
              <button
                className="text-xs text-slate-500 hover:text-slate-700 underline"
                onClick={() => setInput(DEFAULT_SAMPLE)}
                type="button"
              >
                サンプルに戻す
              </button>
              <button
                className="text-xs text-red-500 hover:text-red-700 underline"
                onClick={() => setInput("")}
                type="button"
              >
                クリア
              </button>
            </div>
          </div>

          <textarea
            className="h-56 w-full rounded-lg border border-slate-300 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            onChange={(e) => setInput(e.target.value)}
            placeholder="ここにスクリプトを入力..."
            value={input}
          />
        </div>

        {/* 実行ボタン */}
        <div>
          <button
            className="w-full sm:w-auto rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            disabled={!module}
            onClick={run}
          >
            {module ? "実行" : "読み込み中..."}
          </button>
        </div>

        {/* 出力結果エリア */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-700">出力結果</h2>
            {output && (
              <button
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                onClick={handleCopy}
                type="button"
              >
                {copied ? "コピーしました！" : "結果をコピー"}
              </button>
            )}
          </div>

          <textarea
            className="h-48 w-full rounded-lg border border-slate-300 bg-slate-900 p-3 font-mono text-sm text-green-400 focus:outline-none"
            placeholder="実行結果がここに表示されます"
            readOnly
            value={output}
          />
        </div>
      </div>
    </section>
  );
}
