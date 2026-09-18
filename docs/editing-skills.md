# スキル探索の編集

編集ファイルは `src/data/skills.json` です。配列の順番が画面の表示順になります。
作品との関係は `workIds` で手動指定します。技術名からの自動推定はありません。

## 項目

- 外側の項目が入口の言語・ツール。`id` はURLに使うので公開後はなるべく維持してください。
- `title`: 表示名。`english`: 補助ラベル。`description`: 取り組み一覧の説明。
- `topics`: 取り組みの配列。各項目には下記の例のフィールドを記入します。
- `practices`: 詳細画面の箇条書き。
- `workIds`: 関連作品のIDを表示順に指定。未確認なら `[]` にします。「関連作品はまだ登録されていません」と表示されます。
- `sources`: 活動記事などへのリンク。`label` と `url` を持つ項目の配列です。空の `[]` でも構いません。

## 取り組みの記入例

```json
{
  "id": "webassembly",
  "title": "WebAssembly",
  "summary": "C++の集合データ構造をブラウザで試せる形にしました。",
  "practices": ["集合演算の実装", "WebAssemblyとの連携"],
  "workIds": ["set-expression"],
  "sources": [{ "label": "紹介記事", "url": "https://example.com/article" }]
}
```

入口を追加する場合は外側の項目をコピーして変更します。入口のidは全体で一意、topicのidはその入口の中で一意にします。半角英数字・ハイフンを推奨します。JSONにコメントや末尾の余分なカンマは書けません。

## 作品ID一覧

- `lumen-trace`: 灯の回廊
- `set-expression`: 関数による集合表現
- `cucumvivor`: Cucumvivor
- `3d-rogue-action`: 3DRougeAction
- `distance-from-point`: 地点までの距離メーター
- `atcoder-rating-visualizer`: AtCoder Rating Visualizer
- `invincible-tank`: InvincibleTank
- `prime-factorization`: 素因数分解ツール
- `random-picker`: ランダムピッカー
- `exam-timer`: 過去問タイマー
- `public-ethics-tool`: 公共・倫理
- `ion-order-game`: イオン化傾向ゲーム

作品本体は `src/routes/portfolio/portfolioData.ts` のworksで管理します。新しい作品は先にworksへ追加して、そのidを記入してください。作品の表示名はworksから取得します。

## URL・動作確認

例: `#/skills?domain=cpp&topic=webassembly`。
入口のidは cpp / python / unity / aviutl / blender / figma / react です。
以前の games / web / algorithms / creative と topic を含むURLも互換変換されます。

保存後は `npm run build` で構文・型を確認し、編集した入口・取り組み・作品リンクをブラウザで開いてください。
