import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ExternalLink, Github, Calendar, Tag } from "lucide-react";

export function WorksPage() {
  const works = [
    {
      id: "invincible-tank",
      title: "InvincibleTank",
      shortDescription: "戦車を操作して敵を倒すシューティングゲーム",
      fullDescription: "Unityで制作した2Dシューティングゲーム。戦車を操作して敵を倒していくアクションゲームです。物理演算を活用した砲弾の動きや、敵AIの実装など、ゲーム開発の基礎を学びました。",
      features: [
        "物理演算を使った砲弾のリアルな動き",
        "複数の敵タイプと攻撃パターン",
        "ステージクリア型のゲームデザイン",
        "スコアシステムとランキング機能",
      ],
      technologies: ["Unity", "C#", "2D Physics"],
      date: "2021年4月",
      url: "#",
      githubUrl: "#",
      color: "#3B82F6",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      id: "prime-factorization",
      title: "素因数分解ツール",
      shortDescription: "数値を素因数分解するWebツール",
      fullDescription: "競技プログラミングで学んだアルゴリズムを実装したWebアプリケーション。大きな数値を高速に素因数分解できます。エラトステネスの篩や試し割り法など、複数のアルゴリズムを比較実装しました。",
      features: [
        "高速な素因数分解アルゴリズム",
        "10^18までの数値に対応",
        "計算時間の表示",
        "視覚的な結果表示",
      ],
      technologies: ["React", "TypeScript", "アルゴリズム"],
      date: "2022年11月",
      url: "#",
      githubUrl: "#",
      color: "#FBBF24",
      gradient: "from-yellow-400 to-yellow-500",
    },
    {
      id: "random-picker",
      title: "ランダムピッカー",
      shortDescription: "ランダムに選択するためのシンプルなツール",
      fullDescription: "日常的に使える実用的なアプリケーション。複数の選択肢からランダムに選ぶ際に便利なツールです。重み付け機能や履歴管理など、実用的な機能を追加しています。",
      features: [
        "シンプルで使いやすいUI",
        "重み付けによる確率調整",
        "選択履歴の記録と表示",
        "カスタマイズ可能なアニメーション",
      ],
      technologies: ["React", "TypeScript", "Local Storage"],
      date: "2023年6月",
      url: "#",
      githubUrl: "#",
      color: "#06B6D4",
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      id: "atcoder-tools",
      title: "AtCoder補助ツール",
      shortDescription: "競技プログラミングを効率化するツール集",
      fullDescription: "AtCoderでの競技プログラミングを効率化するための各種ツール。テストケースの自動実行、提出履歴の管理、よく使うアルゴリズムのスニペット管理などの機能を実装しています。",
      features: [
        "テストケースの自動ダウンロード",
        "ローカルでの自動テスト実行",
        "コードスニペット管理",
        "提出履歴の可視化",
      ],
      technologies: ["Python", "CLI", "Web Scraping"],
      date: "2023年12月",
      url: "#",
      githubUrl: "#",
      color: "#8B5CF6",
      gradient: "from-violet-500 to-violet-600",
    },
    {
      id: "video-editor-plugin",
      title: "AviUtl拡張プラグイン",
      shortDescription: "動画編集を効率化するカスタムプラグイン",
      fullDescription: "AviUtlでの動画編集作業を効率化するために開発したプラグイン。よく使うエフェクトの一括適用や、テンプレート機能などを実装しています。",
      features: [
        "エフェクトプリセット機能",
        "バッチ処理による一括適用",
        "カスタムトランジション",
        "設定の保存と読み込み",
      ],
      technologies: ["C++", "AviUtl SDK", "Win32 API"],
      date: "2024年3月",
      url: "#",
      githubUrl: "#",
      color: "#EC4899",
      gradient: "from-pink-500 to-pink-600",
    },
    {
      id: "3d-model-viewer",
      title: "3Dモデルビューア",
      shortDescription: "Blenderモデルをブラウザで閲覧",
      fullDescription: "Blenderで作成した3Dモデルをブラウザ上で表示・操作できるビューアアプリケーション。Three.jsを使用し、インタラクティブな3D表示を実現しました。",
      features: [
        "glTF/GLBフォーマット対応",
        "マウス・タッチ操作による視点変更",
        "ライティング設定の調整",
        "アニメーション再生機能",
      ],
      technologies: ["React", "Three.js", "Blender"],
      date: "2024年8月",
      url: "#",
      githubUrl: "#",
      color: "#10B981",
      gradient: "from-emerald-500 to-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6 tracking-tight">
            Works
          </h1>
          <p className="text-xl text-slate-300 font-light leading-relaxed">
            これまでに制作した作品の一覧です。<br />
            競技プログラミング、ゲーム開発、ツール制作など、様々な分野に挑戦しています。
          </p>
        </div>
      </section>

      {/* Works Grid */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {works.map((work) => (
              <Card
                key={work.id}
                className="group relative rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl overflow-hidden bg-white"
              >
                {/* Gradient header */}
                <div
                  className={`h-32 bg-gradient-to-br ${work.gradient} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    {work.githubUrl && (
                      <a
                        href={work.githubUrl}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                      >
                        <Github size={20} className="text-white" />
                      </a>
                    )}
                    {work.url && (
                      <a
                        href={work.url}
                        className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                      >
                        <ExternalLink size={20} className="text-white" />
                      </a>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                    {work.title}
                  </CardTitle>
                  <CardDescription className="text-base text-slate-600 leading-relaxed">
                    {work.fullDescription}
                  </CardDescription>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500 mt-4">
                    <Calendar size={16} />
                    <span>{work.date}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                      <Tag size={16} />
                      <span>主な機能</span>
                    </div>
                    <ul className="space-y-2">
                      {work.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="w-1.5 h-1.5 mt-2 rounded-full bg-blue-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex flex-wrap gap-2">
                      {work.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          className="px-3 py-1 text-xs font-medium rounded-lg"
                          style={{
                            backgroundColor: `${work.color}15`,
                            color: work.color,
                            border: `1px solid ${work.color}30`,
                          }}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
