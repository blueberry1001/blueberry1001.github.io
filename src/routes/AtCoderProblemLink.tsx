import { useState } from "react";
import type { FormEvent } from "react";

import { ArrowRight, ExternalLink, Link2 } from "lucide-react";

import { convertAtCoderProblemUrl } from "./atcoderProblemUrl";

export default function AtCoderProblemLink() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  function convert(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCopyStatus("");
    try {
      setResult(convertAtCoderProblemUrl(input));
      setError("");
    } catch (cause) {
      setResult("");
      setError(
        cause instanceof Error ? cause.message : "URLを確認してください。"
      );
    }
  }

  function updateInput(value: string) {
    setInput(value);
    setResult("");
    setError("");
    setCopyStatus("");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result);
      setCopyStatus("コピーしました。");
    } catch {
      setCopyStatus(
        "コピーできませんでした。表示されたリンクを選択してコピーしてください。"
      );
    }
  }

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <Link2 aria-hidden="true" size={24} />
        </div>
        <h1 className="mb-3 text-2xl font-black text-slate-900 sm:text-3xl">
          AtCoder問題リンク変換
        </h1>
        <p className="mb-8 leading-relaxed text-slate-600">
          AtCoder Daily
          Trainingなどの問題URLを、元のコンテストの問題URLに変換します。
        </p>
        <form noValidate onSubmit={convert}>
          <label
            className="mb-2 block text-sm font-semibold text-slate-700"
            htmlFor="problem-url"
          >
            AtCoderの問題URL
          </label>
          <input
            aria-describedby={error ? "url-error" : undefined}
            aria-invalid={Boolean(error)}
            autoCapitalize="none"
            autoComplete="off"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            id="problem-url"
            onChange={(event) => updateInput(event.target.value)}
            placeholder="https://atcoder.jp/contests/…/tasks/…"
            spellCheck={false}
            type="text"
            value={input}
          />
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              type="submit"
            >
              リンクを変換 <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </form>
        {error && (
          <p
            className="mt-6 rounded-xl bg-red-50 p-4 text-red-700"
            id="url-error"
            role="alert"
          >
            {error}
          </p>
        )}
        <div aria-live="polite" className="mt-8">
          {result && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="mb-3 text-lg font-bold text-slate-900">
                元のコンテストの問題URL
              </h2>
              <a
                className="break-all text-blue-700 underline underline-offset-4"
                href={result}
              >
                {result}
              </a>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                  href={result}
                >
                  問題を開く <ExternalLink aria-hidden="true" size={18} />
                </a>
                <button
                  className="rounded-xl border border-blue-200 bg-white px-5 py-3 font-semibold text-blue-700 hover:bg-blue-100"
                  onClick={() => void copy()}
                  type="button"
                >
                  URLをコピー
                </button>
              </div>
              {copyStatus && (
                <p className="mt-3 text-sm text-slate-600">{copyStatus}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
