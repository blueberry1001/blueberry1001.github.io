import { Link } from "react-router-dom";

import ExternalGamePlayer from "../components/ExternalGamePlayer";

export default function LumenTrace() {
  return (
    <section className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          className="text-sm text-slate-600 underline underline-offset-4"
          to="/works"
        >
          作品一覧へ
        </Link>
        <header className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <p className="mb-3 text-sm font-medium text-teal-800">
            2026年9月 · Unity / C# / WebGL
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            灯の回廊 — LUMEN TRACE
          </h1>
          <p className="mt-4 max-w-2xl leading-8 text-slate-600">
            光片を集めて回廊を探索する2Dアクションゲームです。ブラウザから遊べます。
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            A・Dで移動、Spaceでジャンプ、Escapeで一時停止。
          </p>
        </header>
        <ExternalGamePlayer
          title="灯の回廊 — LUMEN TRACE"
          url="https://blueberry1001.github.io/RAction/"
        />
        <p className="text-sm leading-7 text-slate-500">
          スマートフォンでは端末を横向きにして、別タブで開くと画面を広く使えます。
        </p>
      </div>
    </section>
  );
}
