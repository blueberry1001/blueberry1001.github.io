import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function ArticlesSection() {
  const navigate = useNavigate();

  const featuredArticles = [
    {
      id: "atcoder-yellow",
      title: "AtCoder黄色達成までの道のり",
      description: "2年半でレート2000に到達するまでの学習方法と意識したこと",
      date: "2024年7月15日",
      readTime: "8分",
      tags: ["競技プログラミング", "AtCoder"],
      color: "#FBBF24",
    },
    {
      id: "supercon-2024",
      title: "SuperCon2024で準優勝した話",
      description: "チーム開発や最適化の取り組みについて振り返る",
      date: "2024年2月28日",
      readTime: "10分",
      tags: ["コンテスト", "チーム開発"],
      color: "#F59E0B",
    },
    {
      id: "invincible-tank-dev",
      title: "InvincibleTank開発記",
      description: "初めて作った本格的なゲームプロジェクトの開発過程",
      date: "2021年8月10日",
      readTime: "15分",
      tags: ["ゲーム開発", "Unity"],
      color: "#3B82F6",
    },
  ];

  return (
    <section id="articles" className="w-full py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-5xl font-bold text-slate-900 tracking-tight">
            Articles
          </h2>
          <button
            onClick={() => navigate("/articles")}
            className="flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-semibold rounded-xl hover:bg-purple-600 transition-all duration-300 hover:scale-105 group"
          >
            <span>すべて見る</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <Card
              key={article.id}
              onClick={() => navigate(`/articles/${article.id}`)}
              className="group cursor-pointer rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden bg-white"
            >
              <div
                className="h-2 w-full"
                style={{ backgroundColor: article.color }}
              />

              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {article.title}
                </CardTitle>
                <CardDescription className="text-sm text-slate-600 leading-relaxed">
                  {article.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 group-hover:gap-3 transition-all">
                    <span>続きを読む</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
