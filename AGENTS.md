# Codex作業ガイド

## このプロジェクト

ユーザー指定の作業場所は `C:\Users\kubar\Documents\GitHub\blueberry1001.github.io`。このフォルダをコマンドの実行先にする。

個人サイトの本体はルートpackage.jsonとsrc。React 18、TypeScript 5、Vite 5、Tailwind CSS 3、React Router DOM 6のHashRouterを使用し、GitHub Pagesで公開する。

作業開始時は `docs/codex-project-notes.md` を読み、変更対象に応じてREADMEとdocsの編集ガイドを確認する。メモは2026-10-13時点の記録で、最新のコードとユーザーの指示を優先する。

## 編集の入口

- ルーティング: src/AppRoutes.tsx
- 作品・記事・リンク: src/routes/portfolio/portfolioData.ts
- 経歴: src/data/timeline.json、docs/editing-timeline.md
- スキル: src/data/skills.json、docs/editing-skills.md
- 掲載情報の根拠: docs/content-sources.md
- 現行画面: src/routes/portfolio/Portfolio*.tsx
- 試作ホーム・スキル: PreviewLayout、PreviewHome、Preview.css、PortfolioSkills
- Unity WebGL: src/components/UnityPlayer.tsx、Gamedata、vite.config.ts
- GA: src/components/Analytics.tsx、docs/analytics.md

Website_from_figmaは別プロジェクトの参照資料。本体の編集先や依存関係と混同しない。存在する旧ファイルが現在のページで使われているかはAppRoutesとimportで判断する。

## 作業と確認

ルートでnpm ci、npm run dev。ソース変更時の基本確認はnpm run lintとnpm run build。画面変更は対象のハッシュURLをブラウザで確認する。testスクリプトは未定義。

既存のURLとGamedata配置、スキル・年表の共有URL、prefers-reduced-motion対応を保つ。記事idと本文キー、workIdsと作品idの整合を確認する。実績や担当範囲は根拠に沿って記載する。

masterへのpushは自動公開につながる。公開・pushはユーザーの依頼範囲に従う。dist、node_modules、*.tsbuildinfoは生成物。全体formatやlint:fixは対象外の差分を増やすことがあるため実行範囲を確認する。

作業開始時にGitのブランチ・既存差分を確認する。2026-10-13に制限外の読取確認でmasterと今回のメモ2件のみの未追跡状態を確認した。制限内ではGitのPermission deniedやghの認証失敗が出る場合がある。リポジトリ設定や認証を変更する前に、実行環境のアクセス制限を切り分ける。


## NEON RECLAIMERの紹介・更新履歴

ゲームの公開更新に合わせ、このサイトの履歴も更新する。手順は `docs/neon-reclaimer-update-workflow.md`、公開データは `src/data/neon-reclaimer/releases.json`。紹介・履歴・日付別の詳細は `src/routes/NeonReclaimer.tsx`。2026-10-15にユーザーが既存サイトに合わせる方針を確認済み。履歴の先頭から紹介の最新更新が自動表示される。ゲーム本体は別のneon-reclaimer-playで配信し、このサイトにはビルドを複製しない。
