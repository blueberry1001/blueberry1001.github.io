import { Badge } from "../components/ui/badge";
import { Calendar, Award, GraduationCap, Code, Trophy, Star } from "lucide-react";

export function TimelinePage() {
  const eventsByYear: Record<string, any[]> = {
    "2020": [
      {
        month: "4月",
        category: "education",
        title: "筑波大学附属中学校に入学",
        description: "中学校に入学。この頃からプログラミングに興味を持ち始める。",
        details: [
          "Unityでのゲーム開発を開始",
          "AviUtlでの動画編集を始める",
          "プログラミングの基礎を独学で学習",
        ],
        isHighlight: false,
        icon: GraduationCap,
        color: "#64748B",
      },
    ],
    "2022": [
      {
        month: "1月",
        category: "programming",
        title: "AtCoderを開始",
        description: "競技プログラミングの世界に足を踏み入れる。",
        details: [
          "ABC（AtCoder Beginner Contest）への参加を開始",
          "基本的なアルゴリズムとデータ構造を学習",
          "C++での実装力を向上",
        ],
        isHighlight: false,
        icon: Code,
        color: "#6366F1",
      },
      {
        month: "8月",
        category: "achievement",
        title: "AtCoder 茶色達成",
        description: "レート400を突破し、茶色コーダーに。",
        details: [
          "レート: 400+",
          "全探索、基本的なDPなどを習得",
          "コンテスト参加回数: 20回以上",
        ],
        isHighlight: false,
        icon: Trophy,
        color: "#92400E",
      },
    ],
    "2023": [
      {
        month: "4月",
        category: "education",
        title: "筑波大学附属高等学校に入学",
        description: "高校に進学。より本格的に競技プログラミングに取り組む。",
        details: [
          "学業との両立を図りながら精進",
          "部活動にも参加しつつ、プログラミングの時間を確保",
        ],
        isHighlight: false,
        icon: GraduationCap,
        color: "#64748B",
      },
      {
        month: "6月",
        category: "achievement",
        title: "AtCoder 緑・水色達成",
        description: "短期間でレートを大幅に向上させ、水色に到達。",
        details: [
          "レート: 1200+",
          "グラフ理論、高度なDPの習得",
          "典型問題を網羅的に学習",
        ],
        isHighlight: false,
        icon: Trophy,
        color: "#06B6D4",
      },
      {
        month: "9月",
        category: "achievement",
        title: "AtCoder 青色達成",
        description: "念願の青色コーダーに。中級者の仲間入り。",
        details: [
          "レート: 1600+",
          "セグメント木、Union-Findなどの高度なデータ構造を習得",
          "コンテスト参加回数: 100回以上",
        ],
        isHighlight: true,
        icon: Star,
        color: "#3B82F6",
      },
      {
        month: "11月",
        category: "competition",
        title: "SuperCon本選出場",
        description: "スーパーコンピューティングコンテストの本選に進出。",
        details: [
          "予選を突破し本選へ",
          "チームでの開発・最適化に取り組む",
          "並列処理やアルゴリズムの最適化を学ぶ",
        ],
        isHighlight: false,
        icon: Award,
        color: "#8B5CF6",
      },
      {
        month: "12月",
        category: "competition",
        title: "JOI2次予選を通過",
        description: "日本情報オリンピックの2次予選を突破。",
        details: [
          "1次予選、2次予選を通過",
          "より高度なアルゴリズム問題に挑戦",
          "春合宿進出を目指す",
        ],
        isHighlight: false,
        icon: Award,
        color: "#10B981",
      },
    ],
    "2024": [
      {
        month: "2月",
        category: "competition",
        title: "SuperCon本選で2位に 🏆",
        description: "スーパーコンピューティングコンテスト本選で準優勝を獲得。",
        details: [
          "全国から集まった強豪チームと競う",
          "効率的なアルゴリズムの実装が評価される",
          "チームワークの重要性を実感",
        ],
        isHighlight: true,
        icon: Trophy,
        color: "#F59E0B",
      },
      {
        month: "7月",
        category: "achievement",
        title: "AtCoder 黄色達成 ⭐",
        description: "ついに黄色コーダーに到達。上級者の仲間入り。",
        details: [
          "レート: 2000+",
          "より高度なアルゴリズムとデータ構造を習得",
          "安定したパフォーマンスを維持",
        ],
        isHighlight: true,
        icon: Star,
        color: "#FBBF24",
      },
    ],
    "2025": [
      {
        month: "2月",
        category: "competition",
        title: "JOI春合宿に進出 🎉",
        description: "日本情報オリンピックの春合宿に進出を決める。",
        details: [
          "本選を突破し春合宿へ",
          "国際情報オリンピック代表選考の機会を得る",
          "日本トップレベルの競技者との交流",
        ],
        isHighlight: true,
        icon: Award,
        color: "#EC4899",
      },
      {
        month: "4月",
        category: "education",
        title: "東京科学大学に入学予定",
        description: "大学でさらに深い学びを追求していく。",
        details: [
          "デジタル創作同好会traPに所属予定",
          "競技プログラミングを継続",
          "より専門的な情報科学を学ぶ",
        ],
        isHighlight: false,
        icon: GraduationCap,
        color: "#64748B",
      },
    ],
  };

  const getCategoryBadge = (category: string) => {
    const badges = {
      education: { label: "学業", color: "#64748B" },
      programming: { label: "プログラミング", color: "#6366F1" },
      achievement: { label: "達成", color: "#10B981" },
      competition: { label: "コンテスト", color: "#F59E0B" },
    };
    return badges[category as keyof typeof badges] || badges.education;
  };

  const getYearColor = (year: string) => {
    const colors: Record<string, { bg: string; gradient: string; text: string; accent: string; line: string }> = {
      "2020": { 
        bg: "bg-slate-50", 
        gradient: "from-slate-400 to-slate-500",
        text: "text-slate-700",
        accent: "#64748B",
        line: "#64748B"
      },
      "2022": { 
        bg: "bg-blue-50", 
        gradient: "from-blue-400 to-blue-500",
        text: "text-blue-700",
        accent: "#3B82F6",
        line: "#3B82F6"
      },
      "2023": { 
        bg: "bg-cyan-50", 
        gradient: "from-cyan-400 to-cyan-500",
        text: "text-cyan-700",
        accent: "#06B6D4",
        line: "#06B6D4"
      },
      "2024": { 
        bg: "bg-yellow-50", 
        gradient: "from-yellow-400 to-yellow-500",
        text: "text-yellow-700",
        accent: "#FBBF24",
        line: "#FBBF24"
      },
      "2025": { 
        bg: "bg-pink-50", 
        gradient: "from-pink-400 to-pink-500",
        text: "text-pink-700",
        accent: "#EC4899",
        line: "#EC4899"
      },
    };
    return colors[year] || colors["2020"];
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-blue-300 mb-6 tracking-tight">
            Timeline
          </h1>
          <p className="text-xl text-slate-300 font-light leading-relaxed">
            これまでの歩みを時系列で振り返ります。<br />
            競技プログラミングを中心に、様々な経験を積んできました。
          </p>
        </div>
      </section>

      {/* Timeline Section - Year by Year */}
      <div className="pb-0">
        {Object.entries(eventsByYear).map(([year, events], yearIndex) => {
          const yearStyle = getYearColor(year);
          
          return (
            <section key={year} className={`py-16 px-6 ${yearStyle.bg} border-y border-slate-200`}>
              <div className="max-w-5xl mx-auto">
                {/* Year Header */}
                <div className="flex items-center gap-6 mb-16">
                  <div 
                    className={`inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r ${yearStyle.gradient} shadow-xl`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={32} className="text-white" strokeWidth={2.5} />
                      <h2 className="text-5xl font-black text-white">
                        {year}
                      </h2>
                    </div>
                  </div>
                  <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: yearStyle.line }} />
                </div>

                {/* Events Timeline */}
                <div className="relative">
                  {/* Vertical line */}
                  <div 
                    className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1"
                    style={{ backgroundColor: yearStyle.line }}
                  />
                  
                  {events.map((event, index) => (
                    <div
                      key={index}
                      className={`relative mb-12 last:mb-0 ${
                        index % 2 === 0 ? "md:pr-1/2 md:text-right" : "md:pl-1/2 md:ml-auto"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`absolute left-0 md:left-1/2 flex items-center justify-center ${
                          index % 2 === 0 ? "md:-translate-x-1/2" : "md:translate-x-0 md:-ml-0"
                        }`}
                      >
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white"
                          style={{ backgroundColor: event.color }}
                        >
                          <event.icon size={28} className="text-white" strokeWidth={2} />
                        </div>
                      </div>

                      {/* Content card */}
                      <div
                        className={`ml-24 md:ml-0 ${
                          index % 2 === 0 ? "md:mr-28" : "md:ml-28"
                        }`}
                      >
                        <div
                          className={`group p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                            event.isHighlight
                              ? "bg-white border-2 shadow-xl"
                              : "bg-white/90 backdrop-blur-sm border-2 border-slate-200 shadow-md"
                          }`}
                          style={{
                            borderColor: event.isHighlight ? yearStyle.accent : undefined,
                          }}
                        >
                          {/* Header */}
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <Badge
                              className="px-3 py-1 text-xs font-semibold rounded-lg"
                              style={{
                                backgroundColor: `${getCategoryBadge(event.category).color}20`,
                                color: getCategoryBadge(event.category).color,
                                border: `1px solid ${getCategoryBadge(event.category).color}40`,
                              }}
                            >
                              {getCategoryBadge(event.category).label}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar size={14} />
                              <span className="font-medium">{year}年 {event.month}</span>
                            </div>
                          </div>

                          <h3 className={`text-xl font-bold mb-3 ${
                            event.isHighlight ? "text-slate-900" : "text-slate-800"
                          }`}>
                            {event.title}
                          </h3>

                          <p className="text-slate-600 leading-relaxed mb-4">
                            {event.description}
                          </p>

                          {/* Details */}
                          <ul className="space-y-2">
                            {event.details.map((detail: string, detailIndex: number) => (
                              <li
                                key={detailIndex}
                                className="flex items-start gap-3 text-sm text-slate-600"
                              >
                                <span
                                  className="w-1.5 h-1.5 mt-2 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: event.color }}
                                />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Highlight indicator */}
                          {event.isHighlight && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                              <div className="flex items-center gap-2">
                                <Star size={16} style={{ color: yearStyle.accent }} fill={yearStyle.accent} />
                                <span className="text-xs font-semibold" style={{ color: yearStyle.accent }}>
                                  ハイライト
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
