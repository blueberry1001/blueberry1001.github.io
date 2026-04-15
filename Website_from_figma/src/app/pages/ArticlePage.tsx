import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, Clock, Tag, ExternalLink } from "lucide-react";
import { Badge } from "../components/ui/badge";

export function ArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // サンプル記事データ（実際はAPIやCMSから取得）
  const articles: Record<string, any> = {
    "atcoder-yellow": {
      title: "AtCoder黄色達成までの道のり",
      date: "2024年7月15日",
      readTime: "8分",
      tags: ["競技プログラミング", "AtCoder", "学習記録"],
      thumbnail: "#FFD700",
      content: {
        intro: "2022年1月にAtCoderを始めてから約2年半、ついに黄色（レート2000）に到達することができました。この記事では、黄色に到達するまでに意識したことや学習方法について振り返ります。",
        sections: [
          {
            heading: "黄色達成までの軌跡",
            content: "茶色、緑色、水色、青色と段階的にレートを上げていきました。各色帯で特に重要だと感じたポイントを以下にまとめます。",
            points: [
              "茶色→緑色: 基本的なアルゴリズムの理解と実装力",
              "緑色→水色: 典型問題のパターン認識と応用力",
              "水色→青色: 高度なデータ構造の習得と考察力",
              "青色→黄色: 複合的な問題への対応力と安定性",
            ],
          },
          {
            heading: "学習方法",
            content: "主に以下の方法で学習を進めました。",
            points: [
              "毎週のコンテスト参加（ABC、ARC）",
              "過去問の復習（特に解けなかった問題）",
              "典型アルゴリズムの実装練習",
              "レート上位者のコードを読む",
              "AtCoder Problemsでの問題精選",
            ],
          },
          {
            heading: "使用した教材",
            content: "特に役立った教材やリソースを紹介します。",
            points: [
              "競技プログラミングの鉄則（書籍）",
              "AtCoder Problems",
              "けんちょんさんのブログ",
              "Twitterでの情報収集",
            ],
          },
          {
            heading: "今後の目標",
            content: "黄色に到達できたことは嬉しいですが、まだまだ上を目指していきます。次の目標は橙色（レート2400）です。より高度なアルゴリズムや数学的考察が必要になってくるので、引き続き精進していきます。",
          },
        ],
      },
    },
    "supercon-2024": {
      title: "SuperCon2024で準優勝した話",
      date: "2024年2月28日",
      readTime: "10分",
      tags: ["コンテスト", "スーパーコンピュータ", "チーム開発"],
      thumbnail: "#F59E0B",
      content: {
        intro: "スーパーコンピューティングコンテスト2024に参加し、準優勝という結果を残すことができました。この記事では、コンテストの概要や取り組んだこと、学んだことについて書きます。",
        sections: [
          {
            heading: "SuperConとは",
            content: "スーパーコンピューティングコンテストは、高性能計算やアルゴリズムの最適化を競うコンテストです。予選と本選があり、本選では実際にスーパーコンピュータを使用して課題に取り組みます。",
          },
          {
            heading: "取り組んだ課題",
            content: "今年の課題は大規模なグラフ問題の最適化でした。以下のアプローチで取り組みました。",
            points: [
              "問題の数学的な性質の分析",
              "効率的なアルゴリズムの設計",
              "並列処理による高速化",
              "メモリ効率の最適化",
              "実行時間の短縮",
            ],
          },
          {
            heading: "チームでの開発",
            content: "3人チームでの開発では、役割分担とコミュニケーションが重要でした。",
            points: [
              "アルゴリズム設計担当",
              "実装・最適化担当",
              "テスト・デバッグ担当",
              "定期的なミーティングと進捗共有",
              "Gitを使った効率的な共同開発",
            ],
          },
          {
            heading: "学んだこと",
            content: "このコンテストを通じて、技術面だけでなく、チームワークの重要性も学びました。個人戦とは違い、チームメンバーとの協力が成果に直結することを実感しました。",
          },
        ],
      },
    },
  };

  const article = articles[id as string];

  if (!article) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">記事が見つかりません</h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 bg-slate-50">
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">戻る</span>
        </button>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        <div
          className="h-64 rounded-3xl mb-8 flex items-center justify-center"
          style={{ backgroundColor: article.thumbnail }}
        >
          <h1 className="text-5xl font-black text-white text-center px-6 drop-shadow-lg">
            {article.title}
          </h1>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={18} />
            <span className="text-sm">{article.date}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock size={18} />
            <span className="text-sm">{article.readTime}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={18} className="text-slate-600" />
            {article.tags.map((tag: string) => (
              <Badge
                key={tag}
                className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 rounded-lg"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          {/* Intro */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl mb-8">
            <p className="text-slate-700 leading-relaxed">{article.content.intro}</p>
          </div>

          {/* Sections */}
          {article.content.sections.map((section: any, index: number) => (
            <div key={index} className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <span className="text-blue-500">{index + 1}.</span>
                {section.heading}
              </h2>
              
              {section.content && (
                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                  {section.content}
                </p>
              )}

              {section.points && (
                <ul className="space-y-3 ml-6">
                  {section.points.map((point: string, pointIndex: number) => (
                    <li
                      key={pointIndex}
                      className="flex items-start gap-3 text-slate-700 leading-relaxed"
                    >
                      <span className="w-2 h-2 mt-3 rounded-full bg-blue-500 flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4">関連リンク</h3>
          <div className="space-y-3">
            <a
              href="#"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
              <span>AtCoderプロフィール</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
            >
              <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
              <span>GitHubリポジトリ</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
