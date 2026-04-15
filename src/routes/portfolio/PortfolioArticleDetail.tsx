import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Calendar, Clock, ExternalLink, Tag } from "lucide-react";

import { articleDetailMap } from "./portfolioData";

const PortfolioArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = id ? articleDetailMap[id] : undefined;

  if (!article) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-900">記事が見つかりません</h1>
          <button
            className="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
            onClick={() => navigate("/home")}
            type="button"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-20">
      <div className="mx-auto max-w-4xl px-6 pt-8">
        <button
          className="group flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
          onClick={() => navigate(-1)}
          type="button"
        >
          <ArrowLeft className="transition-transform group-hover:-translate-x-1" size={20} />
          <span className="font-medium">戻る</span>
        </button>
      </div>

      <article className="mx-auto max-w-4xl px-6 py-12">
        <div
          className="mb-8 flex h-64 items-center justify-center rounded-3xl"
          style={{ backgroundColor: article.thumbnail }}
        >
          <h1 className="px-6 text-center text-5xl font-black text-white drop-shadow-lg">{article.title}</h1>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={18} />
            <span className="text-sm">{article.date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock size={18} />
            <span className="text-sm">{article.readTime}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="text-slate-600" size={18} />
            {article.tags.map((tag) => (
              <span
                className="rounded-lg border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-none">
          <div className="mb-8 rounded-r-xl border-l-4 border-blue-500 bg-blue-50 p-6">
            <p className="leading-relaxed text-slate-700">{article.intro}</p>
          </div>

          {article.sections.map((section, index) => (
            <section className="mb-10" key={section.heading}>
              <h2 className="mb-4 flex items-center gap-3 text-3xl font-bold text-slate-900">
                <span className="text-blue-500">{index + 1}.</span>
                {section.heading}
              </h2>
              <p className="mb-4 text-lg leading-relaxed text-slate-700">{section.content}</p>
              {section.points ? (
                <ul className="ml-6 space-y-3">
                  {section.points.map((point) => (
                    <li className="flex items-start gap-3 leading-relaxed text-slate-700" key={point}>
                      <span className="mt-3 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <h3 className="mb-4 text-xl font-bold text-slate-900">関連リンク</h3>
          <div className="space-y-3">
            <a
              className="group flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700"
              href="https://atcoder.jp/users/blueberry1001"
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink className="transition-transform group-hover:translate-x-1" size={18} />
              <span>AtCoderプロフィール</span>
            </a>
            <a
              className="group flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700"
              href="https://github.com/blueberry1001"
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink className="transition-transform group-hover:translate-x-1" size={18} />
              <span>GitHubリポジトリ</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PortfolioArticleDetail;
