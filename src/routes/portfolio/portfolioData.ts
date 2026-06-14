import {
  Award,
  Code,
  GraduationCap,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";

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

export type TimelineEvent = {
  year: string;
  items: string[];
  isHighlight: boolean;
};

export type TimelineEventDetail = {
  month: string;
  category: "education" | "programming" | "achievement" | "competition";
  title: string;
  description: string;
  details: string[];
  isHighlight: boolean;
  icon: LucideIcon;
  color: string;
};

export type TimelineYearStyle = {
  bg: string;
  gradient: string;
  line: string;
  accent: string;
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
  relatedLinks?: { label: string; url: string }[];
};

export const techStack = ["C++", "Python", "C#", "Unity", "AviUtl", "Blender"];

export const works: WorkItem[] = [
  {
    id: "3d-rogue-action",
    title: "3DRougeAction",
    shortDescription: "Unityで制作した3Dローグライクアクションゲーム",
    fullDescription:
      "Unityで制作した3Dアクションゲームです。ランダム要素のあるステージを攻略していきましょう。",
    features: [
      "3Dアクション",
      "ローグライク要素",
      "WebGLブラウザプレイ",
    ],
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

export const timelineEvents: TimelineEvent[] = [
  {
    year: "2020",
    items: ["筑波大学附属中学校に入学", "Unity、AviUtlを開始"],
    isHighlight: false,
  },
  {
    year: "2022",
    items: ["AtCoderを開始", "AtCoder 茶色"],
    isHighlight: false,
  },
  {
    year: "2023",
    items: [
      "筑波大学附属高等学校に入学",
      "AtCoder 緑・水・青色に",
      "SuperCon本選出場",
      "JOI2次予選を通過",
    ],
    isHighlight: false,
  },
  {
    year: "2024",
    items: ["SuperCon本選で2位に", "AtCoder 黄色"],
    isHighlight: true,
  },
  {
    year: "2025",
    items: ["JOI春合宿に進出"],
    isHighlight: true,
  },
  {
    year: "2026",
    items: ["東京科学大学に総合型で合格し入学", "traPに加入"],
    isHighlight: true,
  },
];

export const timelineEventsByYear: Record<string, TimelineEventDetail[]> = {
  "2020": [
    {
      month: "4月",
      category: "education",
      title: "筑波大学附属中学校に入学",
      description: "中学校に入学。この頃からプログラミングに興味を持ち始める。",
      details: [
        "Unityでのゲーム開発を開始",
        "AviUtlでの動画編集を開始",
        "Scratchに籠る",
        "Pythonを触る",
      ],
      isHighlight: false,
      icon: GraduationCap,
      color: "#64748B",
    },
  ],
  "2022": [
    {
      month: "1月",
      category: "programming",
      title: "AtCoderを開始",
      description: "競技プログラミングの世界に足を踏み入れる。",
      details: ["ABC参加を開始", "基本アルゴリズムとデータ構造を学習"],
      isHighlight: false,
      icon: Code,
      color: "#6366F1",
    },
  ],
  "2023": [
    {
      month: "4月",
      category: "education",
      title: "筑波大学附属高等学校に入学",
      description: "高校に進学し、競技プログラミングにより注力。",
      details: ["学業との両立", "継続的にコンテスト参加"],
      isHighlight: false,
      icon: GraduationCap,
      color: "#64748B",
    },
    {
      month: "9月",
      category: "achievement",
      title: "AtCoder 青色達成",
      description: "念願の青色コーダーに到達。",
      details: ["レート1600+", "高度データ構造の実装力向上"],
      isHighlight: true,
      icon: Star,
      color: "#3B82F6",
    },
    {
      month: "11月",
      category: "competition",
      title: "SuperCon本選出場",
      description: "スーパーコンピューティングコンテスト本選へ。",
      details: ["予選突破", "チームで最適化開発に挑戦"],
      isHighlight: false,
      icon: Award,
      color: "#8B5CF6",
    },
  ],
  "2024": [
    {
      month: "2月",
      category: "competition",
      title: "SuperCon本選で2位に",
      description: "本選で準優勝を獲得。",
      details: ["アルゴリズム最適化が評価", "チーム連携で高得点"],
      isHighlight: true,
      icon: Trophy,
      color: "#F59E0B",
    },
    {
      month: "7月",
      category: "achievement",
      title: "AtCoder 黄色達成",
      description: "ついに黄色コーダーへ到達。",
      details: ["レート2000+", "安定したパフォーマンスを維持"],
      isHighlight: true,
      icon: Star,
      color: "#FBBF24",
    },
  ],
  "2025": [
    {
      month: "2月",
      category: "competition",
      title: "JOI春合宿に進出",
      description: "日本情報オリンピック春合宿へ進出。",
      details: ["本選突破", "上位層との競技経験を獲得"],
      isHighlight: true,
      icon: Award,
      color: "#EC4899",
    },
  ],
  "2026": [
    {
      month: "4月",
      category: "education",
      title: "東京科学大学に総合型で合格し入学",
      description: "総合型選抜で合格し、東京科学大学へ進学。",
      details: ["大学生活を開始", "デジタル創作同好会traPに加入"],
      isHighlight: true,
      icon: GraduationCap,
      color: "#14B8A6",
    },
  ],
};

export const timelineCategoryMeta: Record<
  TimelineEventDetail["category"],
  { label: string; color: string }
> = {
  education: { label: "学業", color: "#64748B" },
  programming: { label: "プログラミング", color: "#6366F1" },
  achievement: { label: "達成", color: "#10B981" },
  competition: { label: "コンテスト", color: "#F59E0B" },
};

export const timelineYearStyles: Record<string, TimelineYearStyle> = {
  "2020": {
    bg: "bg-slate-50",
    gradient: "from-slate-400 to-slate-500",
    line: "#64748B",
    accent: "#64748B",
  },
  "2022": {
    bg: "bg-blue-50",
    gradient: "from-blue-400 to-blue-500",
    line: "#3B82F6",
    accent: "#3B82F6",
  },
  "2023": {
    bg: "bg-cyan-50",
    gradient: "from-cyan-400 to-cyan-500",
    line: "#06B6D4",
    accent: "#06B6D4",
  },
  "2024": {
    bg: "bg-yellow-50",
    gradient: "from-yellow-400 to-yellow-500",
    line: "#FBBF24",
    accent: "#FBBF24",
  },
  "2025": {
    bg: "bg-pink-50",
    gradient: "from-pink-400 to-pink-500",
    line: "#EC4899",
    accent: "#EC4899",
  },
  "2026": {
    bg: "bg-teal-50",
    gradient: "from-teal-400 to-teal-500",
    line: "#14B8A6",
    accent: "#14B8A6",
  },
};

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

export const articles: ArticleItem[] = import.meta.env.DEV ? [debugSampleArticle] : [];

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
      points: [
        "個人サイト種別の色分け確認",
        "記事詳細ページのレイアウト確認",
      ],
    },
    {
      heading: "運用メモ",
      content: "不要になったらこのエントリを削除してください。",
    },
  ],
  relatedLinks: [{ label: "Homeへ戻る", url: "/#/home" }],
};

export const articleDetailMap: Record<string, ArticleDetail> = import.meta.env.DEV
  ? { "debug-sample-personal": debugSampleArticleDetail }
  : {};

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
