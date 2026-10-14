# Codex project notes

確認日: 2026-10-13。ローカルのソース・設定・既存文書を確認した記録。最新状態は作業時に再確認する。

## 作業場所と目的

- ユーザー指定の作業フォルダ: `C:\Users\kubar\Documents\GitHub\blueberry1001.github.io`
- 個人サイト。ポートフォリオ、活動記事、経歴、学習用ツール、Unity WebGLゲームを掲載。
- origin: https://github.com/blueberry1001/blueberry1001.github.io.git
- 公開先: https://blueberry1001.github.io/
- この会話の初期cwd `C:\Users\kubar\Documents\ChatGPT\個人サイト` は別フォルダ。コマンド実行先を明示する。

## 技術と開発

本体はReact 18、TypeScript 5、Vite 5、React Router DOM 6。バージョンはpackage.jsonの指定系列であり、実際の固定バージョンはpackage-lock.jsonを参照。

- ViteのReact変換はSWC。ES modules（type: module）。
- Tailwind CSS 3、PostCSS、Autoprefixer、通常のCSSを併用。
- lucide-react、tabler-icons-react、react-dndを使用。styled-componentsも開発依存に登録。
- TypeScriptはstrict、未使用変数・引数の検査を有効化。`@/*` は `src/*`。
- ESLint 8、Prettier 3。ダブルクォート、セミコロン、trailingComma: es5。
- Node.js 20以降（README）。CIはNode.js 20、npm ci。

ルートで実行:

```powershell
npm ci
npm run dev
npm run lint
npm run build
npm run preview
```

`build` は `tsc -b && vite build`。`lint:fix` は自動修正、`format` はsrc内のTS/TSX全体を書き換える。用途に応じて対象を絞る。testスクリプトは未定義。scratchの検証スクリプトは正式なテストスイートとみなさない。

## ディレクトリと編集先

| 場所 | 用途 |
| --- | --- |
| src/main.tsx | React起動、StrictMode、共通CSS読み込み |
| src/AppRoutes.tsx | HashRouter、lazy読み込み、レイアウト、リダイレクト、GA |
| src/routes/portfolio/ | 現行ポートフォリオと試作UI、コンテンツ定義 |
| src/routes/portfolio/portfolioData.ts | works、articles、articleDetailMap、profileLinks |
| src/data/timeline.json | 経歴・実績 |
| src/data/skills.json | 言語・ツール、取り組み、関連作品ID |
| src/routes/ | 個別ツール、学習ページ、ゲーム紹介、旧ページ |
| src/components/ | UnityPlayer、ExternalGamePlayer、Analytics、PageLoadingなど |
| src/hooks/ | スクロール表示アニメーションとCSS |
| src/assets/ | 思想家データJSON/CSV、変換Python、TeXなど |
| src/wasm/ | WebAssemblyバイナリ、JSラッパー、型定義 |
| public/ | そのまま配信するSVG、InvincibleTank動画 |
| Gamedata/3DRougeAction/ | Unity WebGLビルドとテンプレート |
| Website_from_figma/ | Figma由来の別Viteプロジェクト。現行本体と混同しない |
| scratch/ | fetch・ブラウザ検証用スクリプト |
| docs/ | コンテンツ更新・出典・GAの運用文書 |
| .github/workflows/ | masterへのpushでlint、build、GitHub Pages公開 |

Website_from_figmaは独自package.jsonを持ち、Vite 6、Tailwind 4、React Router 7、RadixなどのUI部品が含まれる。本体はルートpackage.jsonとsrcを使うため、参照側の依存やUIをそのまま本体の技術と解釈しない。

## ページ構成

URLは `/#/home` のようなハッシュ形式。入口 `/` は `/home` へ移動。

- 現行: `/home`、`/works`、`/timeline`、`/articles`、`/articles/:id`、`/links`。PortfolioLayoutを使用。
- 試作: `/preview`、`/skills`。PreviewLayoutとPreview.cssを使用。現行ホームへの目立つ導線の追加はREADMEでは試作確認後の想定。
- 学習・ツール: `/prime`、`/wasmtest`、`/timer`、`/randompicker`、`/atcoder-rating-visualizer`、`/distance-from-point`、`/chemistry_ion`、`/public_ethics`、`/thinkers`、`/thinkers_quiz`と一部の`_final`版。
- ゲーム: `/invincibletank`、`/3d-rogue-action`、`/cucumvivor`、`/lumen-trace`。
- `/pointsystem` は独立ページで、共通ヘッダー・フッターの外。
- 旧ページ: `/legacy/home`、`/legacy/links`。旧Header・Sidebar関連のファイルも残る。
- `/products`、`/about`、`/projects`、`/legacy/products` は `/works`、`/contact` は `/links`へ移動。
- ファイルが存在しても使用中とは限らない。実際の接続はAppRoutesとimportを確認する。

## コンテンツ更新の要点

- 記事はarticlesとarticleDetailMapを同じidで追加。片方だけでは詳細が表示できない。
- スキルのworkIdsはworksのidと一致させる。技術名から自動推定されない。
- スキル熟練度の点数は置かず、作品と活動記事で経験を示す。
- 年表はfeatured / standard / detail、初期表示standard。年は降順、同じ年はJSON順。ホーム要約も同じデータを使う。
- スキルや年表のフィルターはURLクエリに反映される。戻る・進むと共有も確認する。
- 掲載実績・本人の担当範囲はdocs/content-sources.mdに従う。非公開プロジェクトや未確認の能力・担当を推測で掲載しない。
- docs/editing-timeline.md、docs/editing-skills.md、PORTFOLIO_CONTENT_GUIDE.mdを対象変更に応じて読む。

## ゲーム・外部連携・デザイン

- vite.config.tsの独自gamedataプラグインが開発時にGamedataを配信。非圧縮ファイルがなければ対応する.brを展開する。
- 本番ビルドはGitHub PagesのContent-Encoding制約に対応し、dist/Gamedataへ非圧縮ファイルを生成。元の.brも維持。壊れた圧縮データはビルド失敗になる。
- UnityPlayerはローカルWebGLの起動・進捗・再試行・終了を扱う。外部ゲームの埋め込みはExternalGamePlayerを確認する。
- AtCoder履歴API処理はsrc/routes/atcoderRatingApi.ts。Jinaプロキシ、memory/localStorageキャッシュ、6時間TTL、リクエスト共有を持つ。外部サービスの現状は変更時に再確認する。
- GA4はsrc/components/Analytics.tsx。本番ビルドかつblueberry1001.github.ioでのみ有効。HashRouterのpathnameを仮想URLとして計測し、フィルターだけの変更は計測しない。GA管理画面の設定・受信確認はdocs/analytics.mdを参照。
- デザインは濃紺・青・シアン。スクロール表示と短い状態遷移があり、prefers-reduced-motionへの対応を維持する。
- READMEのFigma参照: https://www.figma.com/design/Ffbu9OJBipxinHdzHJzFeS?node-id=2-2 （この調査ではFigma自体は未読）。
- DESIGN_METAL_ION.mdはイオン化傾向ゲームの設計資料。

## 公開と確認

masterへのpushでActionsがnpm ci、lint、buildを実行し、distをPagesへ公開する。pushは公開につながるため、メモ作成を理由に実行しない。

ソース変更時はnpm run lintとnpm run buildを基本確認とし、UI変更は対象ページ、スマホ幅、リンク、フィルター、キーボード操作を確認する。生成物dist、node_modules、*.tsbuildinfoをコミットしない。

今回の調査は読取と文書作成。ビルド・lint・ゲーム実行・公開サイト確認は未実施。通常のgit statusはこの実行環境で「must be run in a work tree」、work-tree明示時は「cannot come back to cwd: Permission denied」となったため、ブランチと既存差分は未確認。Git設定は変更していない。追記: 同日、サンドボックス制限外の読み取り専用確認でGitは正常に動作し、ブランチmaster、未追跡ファイルは今回追加したAGENTS.mdとdocs/codex-project-notes.mdのみと確認。先のPermission deniedは実行環境のアクセス制限によるもの。gh 2.90.0も使用可能で、blueberry1001としてkeyring認証済み。制限内のgh auth statusは認証失敗と出たが、制限外では成功した。


## 2026-10-15 NEON RECLAIMERの追加

`/neon-reclaimer`、`/neon-reclaimer/updates`、`/neon-reclaimer/updates/:releaseId` を追加。編集先はNeonReclaimer.tsxと専用CSS、履歴の正はsrc/data/neon-reclaimer/releases.json。公開更新時の手順はdocs/neon-reclaimer-update-workflow.md。buildには履歴データの検査と既存ホームのプリレンダーが含まれる。今回の方針は既存サイトのデザインを継承し、起動と履歴を中心にするもの。ゲームバイナリは別リポジトリの配信を維持する。
