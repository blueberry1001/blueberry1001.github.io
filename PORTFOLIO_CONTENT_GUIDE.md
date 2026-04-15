# Portfolio Articles / Links 運用ガイド

このサイトの Portfolio コンテンツは主に `src/routes/portfolio/portfolioData.ts` で管理しています。

## 1. 記事一覧（Articles）を増やす

`articles` 配列に 1 件追加します。

```ts
{
  id: "new-article-id",
  title: "記事タイトル",
  description: "一覧に出す説明文",
  date: "2026年4月15日",
  readTime: "7分",
  tags: ["タグ1", "タグ2"],
  category: "achievement", // achievement | competition | work | educational
  color: "#3B82F6",
}
```

- `id` は一意にしてください
- 記事カードの遷移先は `/articles/:id` です

## 2. 記事本文（詳細ページ）を書く

`articleDetailMap` に同じ `id` のキーで追加します。

```ts
"new-article-id": {
  title: "記事タイトル",
  date: "2026年4月15日",
  readTime: "7分",
  tags: ["タグ1", "タグ2"],
  thumbnail: "#3B82F6",
  intro: "導入文",
  sections: [
    {
      heading: "見出し1",
      content: "本文",
      points: ["箇条書き1", "箇条書き2"], // 任意
    },
  ],
}
```

> `articles` だけ追加して `articleDetailMap` に同じ `id` が無い場合、詳細ページで「記事が見つかりません」表示になります。

## 3. Links を増やす / 編集する

`profileLinks` 配列を編集します。

```ts
{ name: "GitHub", icon: "💻", url: "https://github.com/blueberry1001" }
```

- `name`: 表示名
- `icon`: 絵文字 1 文字推奨
- `url`: 遷移先 URL

## 4. どこに反映されるか

- `articles`:  
  - `/home` の Articles セクション（先頭3件）  
  - `/articles` の一覧（全件）
- `articleDetailMap`:  
  - `/articles/:id` の詳細本文
- `profileLinks`:  
  - `/home` の Links セクション  
  - `/links` の一覧

