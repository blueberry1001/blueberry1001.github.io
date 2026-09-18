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
- `/#/timeline`：経歴・実績。代表／標準／すべてと分類で絞り込み（初期は標準）
- `/#/preview`：既存ホームの雰囲気を引き継いだ改善案
- `/#/skills`：言語・ツール → 取り組み → 作品・活動記事を探索する試作ページ
- `/#/skills?domain=unity&topic=unity`：選択状態を直接共有する例
- `/#/lumen-trace`、`/#/cucumvivor`：公開WebGLゲームの紹介ページ

現行ホームへの新デザイン／スキル探索の目立つ導線は、試作確認後に追加する想定です。
既存ページのURLと`Gamedata/`の配置は維持しています。

## 更新箇所

- `src/routes/portfolio/portfolioData.ts`：作品、記事、SNSリンク
- `src/data/timeline.json`：経歴・実績と表示量。編集方法は `docs/editing-timeline.md`
- `src/data/skills.json`：言語・ツール、取り組み、作品IDの手動関連付け
- `docs/editing-skills.md`：スキルの編集例と作品ID一覧
- `src/routes/portfolio/Preview*.tsx`、`Preview.css`：試作ホームと共通レイアウト
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
技術名からスキル探索へ移動できます。本文の遅延読み込み中もヘッダーとフッターを維持します。
スクロール時の一度だけの表示アニメーションと、選択・詳細展開の短い動きを追加しています。
OSの「視差効果を減らす」設定（`prefers-reduced-motion`）では動きを抑えます。
