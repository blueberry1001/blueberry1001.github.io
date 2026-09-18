import { Link } from "react-router-dom";

import ExternalGamePlayer from "../components/ExternalGamePlayer";

const GAME_URL = "https://blueberry1001.github.io/cucumvivorWeb/";

export default function Cucumvivor() {
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
          <p className="mb-3 text-sm font-medium text-lime-700">
            2026年春ハッカソン · traP 22班
          </p>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Cucumvivor
          </h1>
          <p className="mt-4 max-w-2xl leading-8 text-slate-600">
            きゅうりにまつわる武器とアイテムを選び、野菜の敵を倒していく2Dシューティング。
            ランダムに現れる選択肢を組み合わせ、敵と弾を避けながらステージを攻略します。
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            チームで共同制作し、プログラマーとしてダメージ処理などを担当しました。
            Unity / C# / WebGL
          </p>
        </header>

        <ExternalGamePlayer fixedWidth title="Cucumvivor" url={GAME_URL}>
          <a
            className="text-slate-600 underline underline-offset-4"
            href="https://trap.jp/post/2978/"
            rel="noopener noreferrer"
            target="_blank"
          >
            チームの制作記事 ↗
          </a>
        </ExternalGamePlayer>
        <p className="text-sm leading-7 text-slate-500">
          PCでのプレイをおすすめします。小さい画面ではゲーム領域を横にスクロールできます。
          表示しきれない場合は、別タブで開いてください。
        </p>
      </div>
    </section>
  );
}
