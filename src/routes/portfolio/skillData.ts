/** Public evidence and existing works, rather than self-assigned proficiency scores. */
export type SkillTopic = {
  id: string;
  title: string;
  summary: string;
  practices: string[];
  workIds: string[];
  sources: { label: string; url: string }[];
};

export type SkillDomain = {
  id: string;
  title: string;
  english: string;
  description: string;
  topics: SkillTopic[];
};

const admission = {
  label: "本人の合格体験記・制作活動について",
  url: "https://note.com/bluebery1001/n/n9cd291e9a0bc",
};
const learningTools = {
  label: "本人による学習ツールの紹介",
  url: "https://note.com/bluebery1001/n/nc3fd9f71bab4",
};

export const skillDomains: SkillDomain[] = [
  {
    id: "games",
    title: "ゲーム制作",
    english: "Game development",
    description: "アイデアを、遊べる体験に。",
    topics: [
      {
        id: "unity",
        title: "Unity / C#",
        summary: "2Dも3Dも。ブラウザで遊べるゲームをつくって届ける。",
        practices: [
          "UnityとC#を使ったゲーム実装",
          "2D・3Dアクションの制作",
          "WebGLビルドの公開",
        ],
        workIds: [
          "lumen-trace",
          "cucumvivor",
          "3d-rogue-action",
          "invincible-tank",
        ],
        sources: [
          {
            label: "Cucumvivor 制作記事（traP）",
            url: "https://trap.jp/post/2978/",
          },
        ],
      },
      {
        id: "team-development",
        title: "共同制作・ゲームの仕組み",
        summary: "チームで役割を分け、遊びを支える仕組みを実装する。",
        practices: [
          "春ハッカソンでのチーム制作",
          "Cucumvivorのダメージクラス実装",
          "ローグライクのあるゲームづくり",
        ],
        workIds: ["cucumvivor", "invincible-tank"],
        sources: [
          {
            label: "担当内容を読む（traP）",
            url: "https://trap.jp/post/2978/",
          },
        ],
      },
    ],
  },
  {
    id: "web",
    title: "Web開発",
    english: "Web & tools",
    description: "身近な不便を、小さな道具に。",
    topics: [
      {
        id: "react",
        title: "React / TypeScript",
        summary: "入力から結果まで、手を動かして使えるWebツールをつくる。",
        practices: [
          "入力と状態に応じたUIの実装",
          "タイマー・計測・データ表示",
          "Geolocation APIによる現在地取得",
        ],
        workIds: ["distance-from-point", "exam-timer", "random-picker"],
        sources: [
          {
            label: "このサイトのソースコード",
            url: "https://github.com/blueberry1001/blueberry1001.github.io",
          },
        ],
      },
      {
        id: "learning",
        title: "学習体験・データ整理",
        summary: "自分が欲しかった道具から、ほかの人にも使える学習体験へ。",
        practices: [
          "クイズと思想家データの整理",
          "ドラッグ操作による学習ゲーム",
          "利用者の声をもとにした改善",
        ],
        workIds: ["public-ethics-tool", "ion-order-game", "exam-timer"],
        sources: [learningTools],
      },
      {
        id: "webassembly",
        title: "C++ / WebAssembly",
        summary: "C++で書いた集合の仕組みを、ブラウザで試せるかたちにする。",
        practices: [
          "有限集合・述語による集合の定義",
          "和・積・補集合と包含判定",
          "ReactのUIとWebAssemblyの連携",
        ],
        workIds: ["set-expression"],
        sources: [
          {
            label: "集合表現デモのソースコード",
            url: "https://github.com/blueberry1001/blueberry1001.github.io/blob/master/src/routes/WasmTest.tsx",
          },
        ],
      },
    ],
  },
  {
    id: "algorithms",
    title: "競技プログラミング",
    english: "Algorithms & problem solving",
    description: "問題を分け、解き方を考える。",
    topics: [
      {
        id: "cpp",
        title: "C++ / アルゴリズム",
        summary: "コンテストで考えたことを、コードと記録に残す。",
        practices: [
          "AtCoderへの参加",
          "アルゴリズム・データ構造の実装",
          "コンテストの振り返りと発信",
        ],
        workIds: ["atcoder-rating-visualizer"],
        sources: [
          {
            label: "AtCoder プロフィール・現在の成績",
            url: "https://atcoder.jp/users/blueberry1001",
          },
          {
            label: "Blueberry-library",
            url: "https://github.com/blueberry1001/Blueberry-library",
          },
        ],
      },
      {
        id: "parallel",
        title: "探索・並列計算",
        summary: "限られた計算時間で、よりよい答えを探す。",
        practices: [
          "SuperCon 2024でのチーム開発",
          "焼きなまし法の並列化",
          "MPIを用いた実装の経験",
        ],
        workIds: [],
        sources: [admission],
      },
    ],
  },
  {
    id: "creative",
    title: "映像・3D",
    english: "Visual creation",
    description: "コードの外にも、表現を広げる。",
    topics: [
      {
        id: "video",
        title: "AviUtl / 動画編集",
        summary: "ゲーム制作とあわせて、映像でも表現する。",
        practices: ["AviUtlを使った動画編集", "制作や学びの記録・発信"],
        workIds: [],
        sources: [
          admission,
          {
            label: "YouTube チャンネル",
            url: "https://www.youtube.com/@blueberry-1001",
          },
        ],
      },
      {
        id: "blender",
        title: "Blender / 3DCG",
        summary: "3DCGや画像編集を、ものづくりに組み合わせる。",
        practices: [
          "Blenderを使った3DCG制作の経験",
          "ゲーム・映像と組み合わせた表現",
        ],
        workIds: [],
        sources: [admission],
      },
    ],
  },
];
