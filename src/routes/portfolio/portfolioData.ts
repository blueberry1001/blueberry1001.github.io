import pdfJorikiso from "../../assets/26jorikiso_blueberry.pdf";



export type WorkItem = {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  technologies: string[];
  date: string;
  url: string;
  color: string;
  gradient: string;
};

export type ArticleItem = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  date: string;
  readTime: string;
  tags: string[];
  category: "achievement" | "competition" | "work" | "educational";
  source: "hatena" | "qiita" | "note" | "personal";
  url?: string;
};

export type ArticleDetail = {
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  thumbnail: string;
  intro: string;
  sections: { heading: string; content: string; points?: string[] }[];
  pdfUrl?: string;
  relatedLinks?: { label: string; url: string }[];
};

export const techStack = ["C++", "Python", "C#", "Unity", "AviUtl", "Blender"];

export const works: WorkItem[] = [
  {
    id: "lumen-trace",
    title: "灯の回廊 — LUMEN TRACE",
    shortDescription: "光片を集めて回廊を探索する2Dアクションゲーム",
    fullDescription:
      "光片を集めながら回廊を探索する、Unityで制作した2Dアクションゲームです。WebGL版を公開しており、ブラウザから遊べます。",
    features: [
      "2Dアクション",
      "回廊の探索",
      "光片の収集",
      "WebGLブラウザプレイ",
    ],
    technologies: ["Unity", "C#", "WebGL"],
    date: "2026年9月",
    url: "/lumen-trace",
    color: "#0F766E",
    gradient: "from-teal-700 to-slate-800",
  },
  {
    id: "set-expression",
    title: "関数による集合表現",
    shortDescription: "集合の定義と演算を試せるWebAssemblyデモ",
    fullDescription:
      "C++で実装した、内包的定義に基づく集合データ構造のインタラクティブデモです。有限集合や剰余の述語で集合を定義し、和・積・補集合と要素の包含判定をブラウザで試せます。",
    features: [
      "有限集合・述語による集合定義",
      "和・積・補集合",
      "包含判定",
      "ブラウザ上でC++を実行",
    ],
    technologies: ["C++", "WebAssembly", "React", "TypeScript"],
    date: "2026年7月",
    url: "/wasmtest",
    color: "#6366F1",
    gradient: "from-indigo-500 to-violet-700",
  },
  {
    id: "cucumvivor",
    title: "Cucumvivor",
    shortDescription: "きゅうりの武器で戦う2Dローグライクシューティング",
    fullDescription:
      "traPの2026年春ハッカソン22班で共同制作したゲームです。きゅうりにまつわる武器やアイテムを選び、野菜の敵と弾を避けながらステージを攻略します。プログラマーとして参加し、ダメージ処理などの実装を担当しました。",
    features: [
      "2Dシューティング",
      "ランダムな武器・アイテム選択",
      "チーム制作",
      "WebGLブラウザプレイ",
    ],
    technologies: ["Unity", "C#", "WebGL"],
    date: "2026年6月",
    url: "/cucumvivor",
    color: "#4D7C0F",
    gradient: "from-lime-600 to-emerald-700",
  },
  {
    id: "3d-rogue-action",
    title: "3DRougeAction",
    shortDescription: "Unityで制作した3Dローグライクアクションゲーム",
    fullDescription:
      "Unityで制作した3Dアクションゲームです。ランダム要素のあるステージを攻略していきましょう。",
    features: ["3Dアクション", "ローグライク要素", "WebGLブラウザプレイ"],
    technologies: ["Unity", "C#", "3D Physics"],
    date: "2026年6月",
    url: "/3d-rogue-action",
    color: "#F97316",
    gradient: "from-orange-500 to-amber-600",
  },
  {
    id: "distance-from-point",
    title: "地点までの距離メーター",
    shortDescription: "現在地から目標地点までの距離を計測するツール",
    fullDescription:
      "現在地と目標地点の緯度経度から、ハーサイン公式で直線距離を算出するシンプルな距離計測アプリです。Google MapsのURL貼り付けにも対応しています。",
    features: [
      "現在地を手動で1回取得",
      "1分ごとの自動更新モード",
      "Google Maps URLや緯度経度テキストの入力に対応",
      "距離をメートル単位で表示",
    ],
    technologies: ["React", "TypeScript", "Geolocation API"],
    date: "2026年5月",
    url: "/distance-from-point",
    color: "#0EA5E9",
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    id: "atcoder-rating-visualizer",
    title: "AtCoder Rating Visualizer",
    shortDescription: "2人のレーティング推移を比較できる高機能ビジュアライザ",
    fullDescription:
      "AtCoderのレーティング遷移を可視化し、重ね描画・差分描画・範囲指定に対応した比較ツールです。ユーザー履歴はキャッシュしてAPIリクエストを削減しています。",
    features: [
      "2人のレーティング推移を重ねて表示",
      "2人のレーティング差分のみを表示",
      "期間指定・直近N件での範囲絞り込み",
      "localStorage + メモリキャッシュによるリクエスト最適化",
    ],
    technologies: ["React", "TypeScript", "SVG", "AtCoder API"],
    date: "2026年5月",
    url: "/atcoder-rating-visualizer",
    color: "#7C3AED",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "blueberry-library",
    title: "Blueberry Library",
    shortDescription: "C++20向けの競技プログラミングライブラリ",
    fullDescription:
      "データ構造・グラフ・数学・文字列アルゴリズムをまとめた、自作のC++ライブラリです。各実装の使い方や計算量を公開し、用途や操作から必要なアルゴリズムを探せます。",
    features: [
      "C++20対応のアルゴリズム・データ構造",
      "使い方・計算量のドキュメント",
      "日本語検索・操作からの絞り込み",
      "Library Checkerのテストケースによる継続的な検証",
    ],
    technologies: ["C++20", "GitHub Actions", "verification-helper"],
    date: "2024年〜",
    url: "https://blueberry1001.github.io/Blueberry-library/",
    color: "#2563EB",
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    id: "invincible-tank",
    title: "InvincibleTank",
    shortDescription: "戦車を操作して敵を倒すシューティングゲーム",
    fullDescription:
      "Unityで制作した2D戦車ゲームです。どんどん自分の戦車を強化しながら進んでいきましょう。",
    features: [
      "ローグライク",
      "2Dゲーム",
      "ステージクリア型",
      "スコア表示",
      "共同制作",
    ],
    technologies: ["Unity", "C#", "2D Physics"],
    date: "2024年8月",
    url: "/invincibletank",
    color: "#3B82F6",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "prime-factorization",
    title: "素因数分解ツール",
    shortDescription: "数値を素因数分解するWebツール",
    fullDescription:
      "JavaScriptのテスト用に作ったシンプルな素因数分解ツールです。",
    features: ["高速な素因数分解", "大きい数値に対応", "計算結果の可視化"],
    technologies: ["React", "TypeScript", "アルゴリズム"],
    date: "2022年11月",
    url: "/prime",
    color: "#FBBF24",
    gradient: "from-yellow-400 to-yellow-500",
  },
  {
    id: "random-picker",
    title: "ランダムピッカー",
    shortDescription: "教員が使う用の指名ツール",
    fullDescription:
      "学校で教員が使うことを想定した指名ツールです。1から指定した数までをランダムな順番に並び替えて表示します。単純な乱数による偏りを防いでいます。",
    features: ["シンプルUI", "即時抽選", "実用重視"],
    technologies: ["React", "TypeScript"],
    date: "2023年6月",
    url: "/randompicker",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-cyan-600",
  },
  {
    id: "exam-timer",
    title: "過去問タイマー",
    shortDescription: "過去問演習向けのタイマー",
    fullDescription:
      "過去問演習用のタイマーです。大問ごとに時間と点数を記録して、秒間当たりの点数を求めることができます。",
    features: ["ワンクリック開始", "視認しやすい表示", "実用重視"],
    technologies: ["React", "TypeScript"],
    date: "2025年12月",
    url: "/timer",
    color: "#10B981",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    id: "public-ethics-tool",
    title: "共通テスト対策【公共・倫理】",
    shortDescription: "思想家学習と一問一答をまとめた対策ツール",
    fullDescription:
      "共通テスト「公共・倫理」の学習効率を高めるため、思想家一覧とクイズ機能を統合したWeb学習ツールです。",
    features: ["思想家一覧", "一問一答モード", "試験対策に特化した導線"],
    technologies: ["React", "TypeScript", "JSON"],
    date: "2024年1月",
    url: "/public_ethics",
    color: "#8B5CF6",
    gradient: "from-violet-500 to-violet-600",
  },
  {
    id: "ion-order-game",
    title: "イオン化傾向ゲーム",
    shortDescription: "ドラッグ&ドロップで覚える化学学習ツール",
    fullDescription:
      "イオン化傾向を並べ替えながら覚えるトレーニング用のWebアプリです。タイムを縮めようとしているうちにイオン化傾向の順番を覚えていけるといいなと思って作りました。",
    features: ["ドラッグ&ドロップ並べ替え", "タイム計測", "答え合わせ機能"],
    technologies: ["React", "TypeScript", "React DnD"],
    date: "2024年8月",
    url: "/chemistry_ion",
    color: "#EF4444",
    gradient: "from-red-500 to-red-600",
  },
];

const debugSampleArticle: ArticleItem = {
  id: "debug-sample-personal",
  title: "デバッグ用サンプル記事（個人サイト）",
  description: "外部記事読み込み時の表示確認用に残しているサンプル記事です。",
  publishedAt: "2000-01-01T00:00:00+09:00",
  date: "2000年1月1日",
  readTime: "1分",
  tags: ["debug", "sample"],
  category: "educational",
  source: "personal",
};

const jorikisoArticle: ArticleItem = {
  id: "b1-1q-jorikiso",
  title: "B1-1Q 情報理工学基礎",
  description: "B1-1Q 情報理工学基礎の課題や資料についてのページです。",
  publishedAt: new Date().toISOString(),
  date: `${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`,
  readTime: "3分",
  tags: ["情報理工学基礎", "大学課題", "pdf"],
  category: "educational",
  source: "personal",
};

export const articles: ArticleItem[] = import.meta.env.DEV
  ? [jorikisoArticle, debugSampleArticle]
  : [jorikisoArticle];

export const articleCategoryLabels: Record<ArticleItem["category"], string> = {
  achievement: "達成",
  competition: "コンテスト",
  work: "作品",
  educational: "学習",
};

export const articleSourceMeta: Record<
  ArticleItem["source"],
  { label: string; color: string }
> = {
  hatena: { label: "はてなブログ", color: "#00A4DE" },
  qiita: { label: "Qiita", color: "#55C500" },
  note: { label: "note", color: "#41C9B4" },
  personal: { label: "個人サイト", color: "#6366F1" },
};

type Rss2JsonItem = {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  categories?: string[];
};

const RSS2JSON_ENDPOINT = "https://api.rss2json.com/v1/api.json?rss_url=";
const HATENA_FEED_URL = "https://blueberry1001.hatenablog.com/feed";
const NOTE_FEED_URL = "https://note.com/bluebery1001/rss";
const QIITA_ITEMS_URL =
  "https://qiita.com/api/v2/users/bluebery1001/items?per_page=100&page=1";
const NOTE_DIARY_KEYWORDS = ["日記", "diary", "週報", "雑記"];
const NOTE_DATE_ONLY_TITLE_REGEX =
  /^\s*(\d{1,4}\s*[\/／]\s*)?\d{1,2}\s*[\/／]\s*\d{1,2}(?:\s*\([^)]*\))?\s*$/;

let articlesCache: ArticleItem[] | null = null;

const stripHtml = (text: string) =>
  text
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const formatDateJa = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

const toExternalArticle = (
  source: "hatena" | "qiita" | "note",
  item: {
    id?: string;
    title: string;
    url: string;
    publishedAt: string;
    description?: string;
    tags?: string[];
  }
): ArticleItem => {
  const fallbackId = encodeURIComponent(item.url).replace(/%/g, "");
  return {
    id: `${source}-${item.id ?? fallbackId}`,
    title: item.title,
    description:
      item.description?.trim() || `${articleSourceMeta[source].label}の記事`,
    publishedAt: item.publishedAt,
    date: formatDateJa(item.publishedAt),
    readTime: "外部",
    tags: item.tags?.slice(0, 3) ?? [],
    category: "educational",
    source,
    url: item.url,
  };
};

const fetchRssItems = async (feedUrl: string): Promise<Rss2JsonItem[]> => {
  const response = await fetch(
    `${RSS2JSON_ENDPOINT}${encodeURIComponent(feedUrl)}`
  );
  if (!response.ok) return [];
  const json = (await response.json()) as { items?: Rss2JsonItem[] };
  return json.items ?? [];
};

const fetchHatenaArticles = async (): Promise<ArticleItem[]> => {
  const items = await fetchRssItems(HATENA_FEED_URL);
  return items.map((item) =>
    toExternalArticle("hatena", {
      title: item.title,
      url: item.link,
      publishedAt: item.pubDate,
      description: stripHtml(item.description ?? ""),
      tags: item.categories ?? [],
    })
  );
};

const fetchQiitaArticles = async (): Promise<ArticleItem[]> => {
  const response = await fetch(QIITA_ITEMS_URL);
  if (!response.ok) return [];
  const items = (await response.json()) as {
    id: string;
    title: string;
    url: string;
    created_at: string;
    tags: { name: string }[];
    body: string;
  }[];

  return items.map((item) =>
    toExternalArticle("qiita", {
      id: item.id,
      title: item.title,
      url: item.url,
      publishedAt: item.created_at,
      description: stripHtml(item.body).slice(0, 120),
      tags: item.tags.map((tag) => tag.name),
    })
  );
};

const isNoteDiary = (item: Rss2JsonItem) => {
  const normalizedTitle = item.title.trim();
  if (NOTE_DATE_ONLY_TITLE_REGEX.test(normalizedTitle)) return true;

  const title = normalizedTitle.toLowerCase();
  const categories = (item.categories ?? []).map((category) =>
    category.toLowerCase()
  );
  return NOTE_DIARY_KEYWORDS.some(
    (keyword) =>
      title.includes(keyword.toLowerCase()) ||
      categories.some((category) => category.includes(keyword.toLowerCase()))
  );
};

const fetchNoteArticles = async (): Promise<ArticleItem[]> => {
  const items = await fetchRssItems(NOTE_FEED_URL);
  return items
    .filter((item) => !isNoteDiary(item))
    .map((item) =>
      toExternalArticle("note", {
        title: item.title,
        url: item.link,
        publishedAt: item.pubDate,
        description: stripHtml(item.description ?? ""),
        tags: item.categories ?? [],
      })
    );
};

export const getArticles = async (): Promise<ArticleItem[]> => {
  if (articlesCache) return articlesCache;

  const [hatena, qiita, note] = await Promise.allSettled([
    fetchHatenaArticles(),
    fetchQiitaArticles(),
    fetchNoteArticles(),
  ]);

  const externalArticles = [
    ...(hatena.status === "fulfilled" ? hatena.value : []),
    ...(qiita.status === "fulfilled" ? qiita.value : []),
    ...(note.status === "fulfilled" ? note.value : []),
  ];

  const merged = [...articles, ...externalArticles];
  const deduped = Array.from(
    new Map(
      merged.map((article) => [article.url ?? article.id, article])
    ).values()
  );
  deduped.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  articlesCache = deduped;
  return deduped;
};

const debugSampleArticleDetail: ArticleDetail = {
  title: "デバッグ用サンプル記事（個人サイト）",
  date: "2000年1月1日",
  readTime: "1分",
  tags: ["debug", "sample"],
  thumbnail: "#6366F1",
  intro:
    "このサンプル記事は、外部サイトの記事を自動取り込みした際にUI表示を確認するために残しています。",
  sections: [
    {
      heading: "用途",
      content: "表示確認のためのダミー記事です。",
      points: ["個人サイト種別の色分け確認", "記事詳細ページのレイアウト確認"],
    },
    {
      heading: "運用メモ",
      content: "不要になったらこのエントリを削除してください。",
    },
  ],
  relatedLinks: [{ label: "Homeへ戻る", url: "/#/home" }],
};

const jorikisoArticleDetail: ArticleDetail = {
  title: "B1-1Q 情報理工学基礎",
  date: `${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`,
  readTime: "10分",
  tags: ["情報理工学基礎", "大学", "レポート"],
  thumbnail: "#156fd6",
  intro: "記事書く環境が全然整備できてないぜ！",
  sections: [
    {
      heading: "このページは何",
      content:
        "情報理工学基礎で提出したレポートを貼るページです。わざわざ個人サイトに載せているのは趣味です。結構ページ数はありますが、コードがページ数を食ってる影響が大きそうです。書いてて楽しいレポートではあったので、読んで楽しいレポートでもあったらいいなと思っています。",
    },
  ],
  pdfUrl: pdfJorikiso,
};

export const articleDetailMap: Record<string, ArticleDetail> = import.meta.env
  .DEV
  ? {
      "debug-sample-personal": debugSampleArticleDetail,
      "b1-1q-jorikiso": jorikisoArticleDetail,
    }
  : {
      "b1-1q-jorikiso": jorikisoArticleDetail,
    };

export const profileLinks = [
  {
    name: "AtCoder",
    iconUrl: "https://img.atcoder.jp/assets/favicon.png",
    url: "https://atcoder.jp/users/blueberry1001",
  },
  {
    name: "GitHub",
    iconUrl: "https://cdn.simpleicons.org/github/111827",
    url: "https://github.com/blueberry1001",
  },
  {
    name: "X",
    iconUrl: "https://cdn.simpleicons.org/x/111827",
    url: "https://twitter.com/bluebery1001",
  },
  {
    name: "YouTube",
    iconUrl: "https://cdn.simpleicons.org/youtube/FF0000",
    url: "https://www.youtube.com/@blueberry-1001",
  },
  {
    name: "Note",
    iconUrl: "https://cdn.simpleicons.org/note/111827",
    url: "https://note.com/bluebery1001",
  },
  {
    name: "Zenn",
    iconUrl: "https://cdn.simpleicons.org/zenn/3EA8FF",
    url: "https://zenn.dev/blueberry1001",
  },
  {
    name: "Qiita",
    iconUrl: "https://cdn.simpleicons.org/qiita/55C500",
    url: "https://qiita.com/bluebery1001",
  },
  {
    name: "BlueSky",
    iconUrl: "https://cdn.simpleicons.org/bluesky/0285FF",
    url: "https://bsky.app/profile/blueberry1001.bsky.social",
  },
];
