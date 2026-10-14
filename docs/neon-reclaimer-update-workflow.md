# NEON RECLAIMERの紹介・更新履歴を更新する

## 対象

個人サイトの本体は `C:/Users/kubar/Documents/GitHub/blueberry1001.github.io`。紹介URLは https://blueberry1001.github.io/#/neon-reclaimer 、履歴は https://blueberry1001.github.io/#/neon-reclaimer/updates 。ゲーム本体 https://blueberry1001.github.io/neon-reclaimer-play/ とは別の公開物。

2026-10-15の依頼に基づき、今後ゲームを公開更新したときは、このサイトの履歴も同じ作業で更新する。ユーザーが今回は公開しないと指定した場合は、その指示を優先する。

## 更新するデータ

`src/data/neon-reclaimer/releases.json` が公開履歴の正。先頭が最新で、紹介ページの最新更新も自動で切り替わる。日付は実際にゲームを公開した日本時間の日付。設計日、素材を用意した日、コミット日だけで公開日を決めない。

各項目は `id / date / title / summary / sections`。idは日付または日付＋短い英数字の識別子。公開後にidを変えるとリンクが切れるため変更しない。個別URLは `/#/neon-reclaimer/updates/{id}`。同日の小さな修正は同じ項目にまとめる。

テンプレートは `docs/templates/neon-release.json`。プロジェクトの外にコピーして具体的な内容へ書き換える。

```powershell
# 追加内容の確認。まだ書き込まない
node scripts/neon-release.mjs --entry C:/path/to/release.json
# 確認した1件を追加
node scripts/neon-release.mjs --entry C:/path/to/release.json --write
npm run check:neon-releases
npm run lint
npm run build
```

既存idの上書きはスクリプトが拒否する。同日の追記は既存項目を直接編集し、差分を確認する。履歴の検査は通常のbuildにも含まれる。スクリプトはGit操作も公開も行わない。

## 内容の書き方

遊ぶ人が分かる追加・調整・修正を書く。yomiyasuを適用し、1項目に仕様を詰め込みすぎない。内部のテスト件数、ローカルパス、保存キー、開発者モードの入り方、パスワード、非公開ソースへのリンクは載せない。未公開の案や将来予定を実装済みと書かない。実機未検証の性能を保証しない。

新しい武器、操作、モードが増えたら `src/routes/NeonReclaimer.tsx` と作品一覧の `portfolioData.ts` も見直す。画像は `public/images/neon-reclaimer/`。現在の画像は2026-10-12版の実際のゲーム画面をWebPに変換したもの。ゲームのビルドファイルをこのリポジトリに複製しない。ページ訪問だけでWebGLを読み込まない。

## 公開する順序

1. 制作側でゲームの変更、必要な動作確認、WebGLビルドを終える。
2. WebGL専用リポジトリ `blueberry1001/neon-reclaimer-play` に公開し、配信内容を確認する。
3. 公開できた変更に絞ってこの履歴へ追記する。ゲームの公開が失敗したら最新履歴を先に公開しない。
4. 紹介・履歴・個別更新のPCとスマホ表示、作品一覧からの導線、ゲームリンク、キーボード操作を確認する。動きを減らす設定も維持する。
5. 既存の編集とリモート差分を確認し、対象ファイルだけコミットする。masterへのpushでActionsがlint/buildし、Pagesへ自動公開する。
6. Actions成功後、公開URLで紹介・履歴・今回の個別ページを確認する。公開結果とコミットを制作側の作業メモにも残す。

更新がサイト文章だけならUnity/WebGLの再ビルドは不要。ゲームバランスを変えた場合のDPSグラフの作成は制作側の既存方針に従う。

## 過去の履歴をまとめた根拠

初回に2026-09-27〜2026-10-12の9日分を整理した。同日の複数リリースはまとめており、全コミットの逐語的な一覧ではない。

| 掲載日 | 制作側で照合した記録 |
| --- | --- |
| 09-27 | 公開版確認コミット f23886b・7fde4eb、初期進行と空中戦の実装 |
| 09-28 | MOBILE_VALIDATION.md、武器専用強化、モーション公開確認 cec5e71 |
| 09-29 | CORE_EXPANSION_DESIGN.md、共通効果と会心、公開確認 1e857b3・5dd1486 |
| 09-30 | 日本語表示の公開確認 4979fb2 |
| 10-02 | ULTIMATE_DEPLOYMENT.json、BARRIER_BALANCE_2_DEPLOYMENT.json、RESONANCE_DEPLOYMENT.json |
| 10-03 | OCT3_DEPLOYMENT.json、OCT3_COMBAT_UPDATE.md |
| 10-04 | OCT4_DEPLOYMENT.json、OCT4_FOLLOWUP_DEPLOYMENT.json、UI_HANDOFF_DEPLOYMENT.json、UI_FLOW_DEPLOYMENT.json、UI_REFINEMENT_DEPLOYMENT.json |
| 10-05 | PRESSURE_DEPLOYMENT.json、PRESSURE_UPDATE_20261005.md |
| 10-12 | Integration/DEPLOYMENT_20261012.json、Integration/CONTENT_INTEGRATION_20261012.md |

これらの制作資料は非公開の `3DInc/Docs` にある。公開文は実装・配信を照合した要約であり、開発中の設計書の上限や旧数値を現在の仕様として転載しない。
