import { NavLink } from "react-router-dom";

import { ArrowRight, Calendar, Clock, FileText } from "lucide-react";

import { articles } from "./portfolioData";

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    achievement: "達成",
    competition: "コンテスト",
    work: "作品",
    educational: "学習",
  };
  return labels[category] ?? "その他";
};

const PortfolioArticles = () => {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-24">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-3">
            <FileText className="text-blue-300" size={48} strokeWidth={2} />
          </div>
          <h1 className="mb-6 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-6xl font-black tracking-tight text-transparent">
            Articles
          </h1>
          <p className="text-xl font-light leading-relaxed text-slate-300">
            技術記事、学習記録、プロジェクトの振り返りなど、
            <br />
            様々な記事をまとめています。
          </p>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <NavLink
                className="group relative z-0 block h-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-all duration-500 hover:z-10 hover:scale-[1.02] hover:border-slate-300 hover:shadow-2xl"
                key={article.id}
                to={`/articles/${article.id}`}
              >
                <div className="h-2 w-full" style={{ backgroundColor: article.color }} />
                <div className="p-6 pb-4">
                  <div className="mb-3 flex items-center gap-2">
                    <span
                      className="rounded-lg px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: `${article.color}20`,
                        color: article.color,
                        border: `1px solid ${article.color}40`,
                      }}
                    >
                      {getCategoryLabel(article.category)}
                    </span>
                  </div>
                  <h2 className="mb-3 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                    {article.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-600">{article.description}</p>
                </div>
                <div className="space-y-4 p-6 pt-0">
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
                    {article.tags.slice(0, 3).map((tag) => (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 transition-all group-hover:gap-3">
                      <span>続きを読む</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioArticles;
