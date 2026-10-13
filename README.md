# blueberry1001.github.io

React + TypeScript + Viteで作る個人サイト。GitHub Pages向けにHashRouterを使用しています。

## 開発

```sh
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

`lint`は検査のみ、`lint:fix`は自動修正です。Node.js 20以降を使用します。
`master`へのpushでGitHub Actionsがビルドし、GitHub Pagesに公開します。
`dist/`とTypeScriptのビルドキャッシュは生成物のためコミットしません。

## ページ

- `/#/home`：現行ホーム
- `/#/works`：作品一覧
- `/#/atcoder-problem-link`：AtCoderの再出題URLを元のコンテストの問題URLに変換
- `/#/timeline`：経歴・実績。代表／標準／すべてと分類で絞り込み（初期は標準）
- `/#/preview`：試作ホームは終了し、現行ホームへ転送
- `/#/skills`：言語・ツール → 取り組み → 作品・活動記事を探索（選択URLを維持）
- `/#/skills?domain=unity&topic=unity`：選択状態を直接共有する例
- `/#/lumen-trace`、`/#/cucumvivor`：公開WebGLゲームの紹介ページ

試作ホームはルーティングから外しています。スキル探索のレイアウトとCSSは、そのページを開くときだけ読み込みます。
既存ページのURLと`Gamedata/`の配置は維持しています。

## 更新箇所

- `src/routes/portfolio/portfolioData.ts`：作品、記事、SNSリンク
- `src/data/timeline.json`：経歴・実績と表示量。編集方法は `docs/editing-timeline.md`
- `src/data/skills.json`：言語・ツール、取り組み、作品IDの手動関連付け
- `docs/editing-skills.md`：スキルの編集例と作品ID一覧
- `src/routes/portfolio/PreviewLayout.tsx`、`Preview.css`：スキル探索用レイアウト（遅延読み込み）
- `src/routes/portfolio/PreviewHome.tsx`：未使用の試作ソース。復元用に保持し、本番には含めません
- `src/routes/portfolio/PortfolioSkills.tsx`：スキルの選択UI
- `src/components/UnityPlayer.tsx`：ローカルWebGLの起動・進捗・再試行・終了処理
- `vite.config.ts`：Gamedata配信、Brotli展開、ビルド時のアセットコピー
- `docs/content-sources.md`：掲載情報の出典と掲載範囲

スキルの`workIds`は作品一覧の`id`と揃えます。熟練度の点数は置かず、作品と活動記事で経験を示します。

## WebGLの公開

開発サーバーは`Gamedata/`配下を配信し、要求された非圧縮ファイルが無い場合に対応する`.br`を展開します。
本番ビルドではGitHub Pagesのヘッダー制約に対応するため、非圧縮ファイルを`dist/Gamedata/`へ生成します。
壊れた圧縮データがある場合はビルドを失敗させます。

## デザイン

[Figma：ホームとスキル探索（PC・スマホ）](https://www.figma.com/design/Ffbu9OJBipxinHdzHJzFeS?node-id=2-2)

既存ホームの濃紺・青・シアンを引き継ぎ、画像を使わず文字と作品一覧を中心に構成。
スキル探索は選択URLから直接開けます。本文の遅延読み込み中もヘッダーとフッターを維持します。ホームはビルド時に本文HTMLを生成し、Reactの読み込み後に操作を引き継ぎます。ほかのURLは従来どおりReactで表示します。
初期画面の本文はすぐ表示し、画面外の要素に短い表示アニメーションを使います。ヒーローは背景の光だけが動きます。
英字のInterとヒーローのNoto Sans JP軽量版は自サイトから配信します。通常の日本語本文はOSの書体を使い、スキル探索では必要時に完全版Noto Sans JPを読み込みます。低速回線では代替フォントを使います。フォントのライセンスは `public/font-licenses/` にあります。ホームの外部記事は記事欄に近づいたときに取得します。
OSの「視差効果を減らす」設定（`prefers-reduced-motion`）では動きを抑えます。

## AtCoder問題リンク変換

問題IDの末尾の「_問題番号」を取り除き、残りのアンダースコアをハイフンに置き換えてコンテスト名を生成します。
例えば、`abc273_c`は`https://atcoder.jp/contests/abc273/tasks/abc273_c`に変換します。
対応表や外部APIは使用しません。
