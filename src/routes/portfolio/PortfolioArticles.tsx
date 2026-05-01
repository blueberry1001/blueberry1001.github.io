import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import { ArrowRight, Calendar, Clock } from "lucide-react";

import {
  articleSourceMeta,
  articles,
  getArticles,
  type ArticleItem,
} from "./portfolioData";

const ARTICLES_PER_PAGE = 12;

const PortfolioArticles = () => {
  const [articleItems, setArticleItems] = useState<ArticleItem[]>(articles);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let active = true;
    void getArticles().then((items) => {
      if (active) setArticleItems(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(articleItems.length / ARTICLES_PER_PAGE));
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const pagedArticles = articleItems.slice(startIndex, startIndex + ARTICLES_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-24">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl" />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-6xl font-black tracking-tight text-transparent">
            Articles
          </h1>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pagedArticles.map((article) => {
              const articleUrl = article.url ?? `/articles/${article.id}`;
              const isExternal = /^https?:\/\//.test(articleUrl);
              const sourceMeta = articleSourceMeta[article.source];
              const cardClasses =
                "group relative z-0 flex h-full flex-col overflow-hidden rounded-2xl border-2 border-slate-200 bg-white transition-all duration-500 hover:z-10 hover:scale-[1.02] hover:border-slate-300 hover:shadow-2xl";
              const cardContent = (
                <>
                  <div
                    className="h-2 w-full"
                    style={{ backgroundColor: sourceMeta.color }}
                  />
                  <div className="p-6 pb-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span
                        className="rounded-lg px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: `${sourceMeta.color}20`,
                          color: sourceMeta.color,
                          border: `1px solid ${sourceMeta.color}40`,
                        }}
                      >
                        {sourceMeta.label}
                      </span>
                    </div>
                    <h2 className="min-h-[3.5rem] text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-blue-600">
                      {article.title}
                    </h2>
                  </div>
                  <div className="mt-auto space-y-4 p-6 pt-0">
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
                    <div className="flex h-14 flex-wrap content-start gap-2 overflow-hidden">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                          key={tag}
                        >
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
                </>
              );

              if (isExternal) {
                return (
                  <a
                    className={cardClasses}
                    href={articleUrl}
                    key={article.id}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {cardContent}
                  </a>
                );
              }

              return (
                <NavLink
                  className={cardClasses}
                  key={article.id}
                  to={articleUrl}
                >
                  {cardContent}
                </NavLink>
              );
            })}
          </div>
          {totalPages > 1 ? (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                type="button"
              >
                前へ
              </button>
              <span className="text-sm font-medium text-slate-600">
                {currentPage} / {totalPages}
              </span>
              <button
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                type="button"
              >
                次へ
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default PortfolioArticles;
