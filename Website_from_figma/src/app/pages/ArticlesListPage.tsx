import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Calendar, Clock, ArrowRight, FileText } from "lucide-react";

export function ArticlesListPage() {
  const navigate = useNavigate();

  const articles = [
    {
      id: "atcoder-yellow",
      title: "AtCoder黄色達成までの道のり",
      description: "2022年1月にAtCoderを始めてから約2年半、ついに黄色（レート2000）に到達するまでの学習方法と意識したことをまとめました。",
      date: "2024年7月15日",
      readTime: "8分",
      tags: ["競技プログラミング", "AtCoder", "学習記録"],
      category: "achievement",
      color: "#FBBF24",
    },
    {
      id: "supercon-2024",
      title: "SuperCon2024で準優勝した話",
      description: "スーパーコンピューティングコンテスト2024に参加し、準優勝という結果を残すことができました。チーム開発や最適化の取り組みについて。",
      date: "2024年2月28日",
      readTime: "10分",
      tags: ["コンテスト", "スーパーコンピュータ", "チーム開発"],
      category: "competition",
      color: "#F59E0B",
    },
    {
      id: "joi-spring-camp",
      title: "JOI春合宿進出までの軌跡",
      description: "日本情報オリンピックの春合宿に進出するまでの道のりと、本選での経験、学んだことについて振り返ります。",
      date: "2025年2月20日",
      readTime: "12分",
      tags: ["JOI", "競技プログラミング", "コンテスト"],
      category: "competition",
      color: "#EC4899",
    },
    {
      id: "invincible-tank-dev",
      title: "InvincibleTank開発記",
      description: "初めて作った本格的なゲームプロジェクト。Unityでの開発過程、直面した課題、そして学んだことをまとめました。",
      date: "2021年8月10日",
      readTime: "15分",
      tags: ["ゲーム開発", "Unity", "C#"],
      category: "work",
      color: "#3B82F6",
    },
    {
      id: "competitive-programming-tips",
      title: "競技プログラミング上達のコツ10選",
      description: "競技プログラミングを2年以上続けてきて分かった、効率的な学習方法と上達のコツをまとめました。",
      date: "2024年5月3日",
      readTime: "10分",
      tags: ["競技プログラミング", "学習方法", "Tips"],
      category: "educational",
      color: "#8B5CF6",
    },
    {
      id: "from-blue-to-yellow",
      title: "AtCoder青から黄への壁の乗り越え方",
      description: "青色から黄色への到達は大きな壁でした。その壁を乗り越えるために意識したことと、具体的な学習内容について。",
      date: "2024年6月20日",
      readTime: "9分",
      tags: ["AtCoder", "競技プログラミング", "学習記録"],
      category: "achievement",
      color: "#FBBF24",
    },
  ];

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      achievement: "達成",
      competition: "コンテスト",
      work: "作品",
      educational: "学習",
    };
    return labels[category] || "その他";
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <FileText size={48} className="text-blue-300" strokeWidth={2} />
          </div>
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 mb-6 tracking-tight">
            Articles
          </h1>
          <p className="text-xl text-slate-300 font-light leading-relaxed">
            技術記事、学習記録、プロジェクトの振り返りなど、<br />
            様々な記事をまとめています。
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Card
                key={article.id}
                onClick={() => navigate(`/articles/${article.id}`)}
                className="group cursor-pointer rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl overflow-hidden bg-white"
              >
                {/* Color accent bar */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: article.color }}
                />

                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      className="px-3 py-1 text-xs font-semibold rounded-lg"
                      style={{
                        backgroundColor: `${article.color}20`,
                        color: article.color,
                        border: `1px solid ${article.color}40`,
                      }}
                    >
                      {getCategoryLabel(article.category)}
                    </Badge>
                  </div>

                  <CardTitle className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </CardTitle>

                  <CardDescription className="text-sm text-slate-600 leading-relaxed">
                    {article.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Meta info */}
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

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read more */}
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
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
    </div>
  );
}
