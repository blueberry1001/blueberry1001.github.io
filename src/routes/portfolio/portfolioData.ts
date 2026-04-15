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

export type ArticleItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  category: "achievement" | "competition" | "work" | "educational";
  color: string;
};

export const techStack = ["C++", "Python", "C#", "Unity", "AviUtl", "Blender"];

export const works: WorkItem[] = [
  {
    id: "invincible-tank",
    title: "InvincibleTank",
    shortDescription: "戦車を操作して敵を倒すシューティングゲーム",
    fullDescription:
      "Unityで制作した2Dシューティングゲーム。戦車を操作して敵を倒していくアクションゲームです。",
    features: ["物理演算を使った砲弾の動き", "複数の敵タイプ", "ステージクリア型", "スコア表示"],
    technologies: ["Unity", "C#", "2D Physics"],
    date: "2021年4月",
    url: "/invincibletank",
    color: "#3B82F6",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "prime-factorization",
    title: "素因数分解ツール",
    shortDescription: "数値を素因数分解するWebツール",
    fullDescription:
      "競技プログラミングで学んだアルゴリズムを実装したWebアプリケーションです。",
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
    shortDescription: "ランダムに選択するためのシンプルなツール",
    fullDescription: "複数の選択肢からランダムに選ぶための軽量ツールです。",
    features: ["シンプルUI", "即時抽選", "実用重視設計"],
    technologies: ["React", "TypeScript"],
    date: "2023年6月",
    url: "/randompicker",
    color: "#06B6D4",
    gradient: "from-cyan-500 to-cyan-600",
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
    items: ["筑波大学附属高等学校に入学", "AtCoder 緑・水・青色に", "SuperCon本選出場", "JOI2次予選を通過"],
    isHighlight: false,
  },
  {
    year: "2024",
    items: ["SuperCon本選で2位に 🏆", "AtCoder 黄色 ⭐"],
    isHighlight: true,
  },
  {
    year: "2025",
    items: ["JOI春合宿に進出 🎉"],
    isHighlight: true,
  },
];

export const articles: ArticleItem[] = [
  {
    id: "atcoder-yellow",
    title: "AtCoder黄色達成までの道のり",
    description: "2年半でレート2000に到達するまでの学習方法と意識したこと",
    date: "2024年7月15日",
    readTime: "8分",
    tags: ["競技プログラミング", "AtCoder", "学習記録"],
    category: "achievement",
    color: "#FBBF24",
  },
  {
    id: "supercon-2024",
    title: "SuperCon2024で準優勝した話",
    description: "チーム開発や最適化の取り組みについて振り返る",
    date: "2024年2月28日",
    readTime: "10分",
    tags: ["コンテスト", "チーム開発", "最適化"],
    category: "competition",
    color: "#F59E0B",
  },
  {
    id: "joi-spring-camp",
    title: "JOI春合宿進出までの軌跡",
    description: "本選までの準備と、取り組んだ問題タイプの整理",
    date: "2025年2月20日",
    readTime: "12分",
    tags: ["JOI", "競技プログラミング"],
    category: "competition",
    color: "#EC4899",
  },
  {
    id: "invincible-tank-dev",
    title: "InvincibleTank開発記",
    description: "初めて作った本格的なゲームプロジェクトの開発過程",
    date: "2021年8月10日",
    readTime: "15分",
    tags: ["ゲーム開発", "Unity", "C#"],
    category: "work",
    color: "#3B82F6",
  },
  {
    id: "competitive-programming-tips",
    title: "競技プログラミング上達のコツ10選",
    description: "2年以上続けて分かった、効率的な学習方法と上達のコツ",
    date: "2024年5月3日",
    readTime: "10分",
    tags: ["競技プログラミング", "学習方法", "Tips"],
    category: "educational",
    color: "#8B5CF6",
  },
  {
    id: "from-blue-to-yellow",
    title: "AtCoder青から黄への壁の乗り越え方",
    description: "青色から黄色へ到達するまでに意識したことと具体的学習",
    date: "2024年6月20日",
    readTime: "9分",
    tags: ["AtCoder", "競技プログラミング", "学習記録"],
    category: "achievement",
    color: "#FBBF24",
  },
];

export const articleDetailMap: Record<
  string,
  {
    title: string;
    date: string;
    readTime: string;
    tags: string[];
    thumbnail: string;
    intro: string;
    sections: { heading: string; content: string; points?: string[] }[];
  }
> = {
  "atcoder-yellow": {
    title: "AtCoder黄色達成までの道のり",
    date: "2024年7月15日",
    readTime: "8分",
    tags: ["競技プログラミング", "AtCoder", "学習記録"],
    thumbnail: "#FFD700",
    intro:
      "2022年1月にAtCoderを始めてから約2年半、ついに黄色（レート2000）に到達することができました。この記事では、意識したことや学習方法を振り返ります。",
    sections: [
      {
        heading: "黄色達成までの軌跡",
        content: "茶色、緑色、水色、青色と段階的にレートを上げていきました。",
        points: [
          "茶色→緑色: 基本アルゴリズムの理解と実装力",
          "緑色→水色: 典型問題のパターン認識",
          "水色→青色: 高度データ構造の習得",
          "青色→黄色: 複合問題への安定対応",
        ],
      },
      {
        heading: "学習方法",
        content: "毎週のコンテスト参加、復習、再実装を継続する方法が効果的でした。",
      },
    ],
  },
};

export const profileLinks = [
  { name: "AtCoder", icon: "🎯", url: "https://atcoder.jp/users/blueberry1001" },
  { name: "GitHub", icon: "💻", url: "https://github.com/blueberry1001" },
  { name: "X", icon: "𝕏", url: "https://twitter.com/bluebery1001" },
  { name: "YouTube", icon: "▶", url: "https://www.youtube.com/channel/UCOJw7xtcqd3EbO9h-jyWrVg1" },
  { name: "Note", icon: "📝", url: "https://note.com/" },
  { name: "Zenn", icon: "📘", url: "https://zenn.dev/" },
  { name: "mixi2", icon: "🎵", url: "https://mixi.social/" },
  { name: "BlueSky", icon: "☁️", url: "https://bsky.app/" },
];
