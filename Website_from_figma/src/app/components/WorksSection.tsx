import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ExternalLink, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function WorksSection() {
  const navigate = useNavigate();

  const works = [
    {
      title: "InvincibleTank",
      description: "戦車を操作して敵を倒すシューティングゲーム",
      url: "#",
      comment: "初めて作った本格的なゲームプロジェクト",
      color: "#3B82F6",
      gradient: "from-blue-500/10 to-blue-600/5",
    },
    {
      title: "素因数分解",
      description: "数値を素因数分解するWebツール",
      url: "#",
      comment: "競技プログラミングの学習を兼ねて制作",
      color: "#FBBF24",
      gradient: "from-yellow-400/10 to-yellow-500/5",
    },
    {
      title: "ランダムピッカー",
      description: "ランダムに選択するためのシンプルなツール",
      url: "#",
      comment: "日常的に使える実用的なアプリ",
      color: "#06B6D4",
      gradient: "from-cyan-500/10 to-cyan-600/5",
    },
  ];

  return (
    <section id="works" className="w-full py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-5xl font-bold text-slate-900 tracking-tight">
            Works
          </h2>
          <button
            onClick={() => navigate("/works")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300 hover:scale-105 group"
          >
            <span>すべて見る</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {works.map((work) => (
            <Card
              key={work.title}
              className={`group relative rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden bg-gradient-to-br ${work.gradient}`}
            >
              {/* Top accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: work.color }}
              />
              
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold flex items-start justify-between text-slate-900">
                  <span>{work.title}</span>
                  <a
                    href={work.url}
                    className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all duration-300 hover:scale-110"
                  >
                    <ExternalLink size={18} strokeWidth={2.5} />
                  </a>
                </CardTitle>
                <CardDescription className="text-base mt-3 text-slate-600 leading-relaxed">
                  {work.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-start gap-2 p-4 rounded-xl bg-slate-50/80 border border-slate-200">
                  <span className="text-lg mt-0.5">💬</span>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {work.comment}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}