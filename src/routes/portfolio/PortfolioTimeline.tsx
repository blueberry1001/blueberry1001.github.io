import { Award, Calendar, Code, GraduationCap, Star, Trophy } from "lucide-react";

const eventsByYear: Record<
  string,
  {
    month: string;
    category: string;
    title: string;
    description: string;
    details: string[];
    isHighlight: boolean;
    icon: typeof Award;
    color: string;
  }[]
> = {
  "2020": [
    {
      month: "4月",
      category: "education",
      title: "筑波大学附属中学校に入学",
      description: "中学校に入学。この頃からプログラミングに興味を持ち始める。",
      details: ["Unityでのゲーム開発を開始", "AviUtlでの動画編集を開始", "プログラミング基礎を独学で学習"],
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
      details: ["ABC参加を開始", "基本アルゴリズムとデータ構造を学習"],
      isHighlight: false,
      icon: Code,
      color: "#6366F1",
    },
  ],
  "2023": [
    {
      month: "4月",
      category: "education",
      title: "筑波大学附属高等学校に入学",
      description: "高校に進学し、競技プログラミングにより注力。",
      details: ["学業との両立", "継続的にコンテスト参加"],
      isHighlight: false,
      icon: GraduationCap,
      color: "#64748B",
    },
    {
      month: "9月",
      category: "achievement",
      title: "AtCoder 青色達成",
      description: "念願の青色コーダーに到達。",
      details: ["レート1600+", "高度データ構造の実装力向上"],
      isHighlight: true,
      icon: Star,
      color: "#3B82F6",
    },
    {
      month: "11月",
      category: "competition",
      title: "SuperCon本選出場",
      description: "スーパーコンピューティングコンテスト本選へ。",
      details: ["予選突破", "チームで最適化開発に挑戦"],
      isHighlight: false,
      icon: Award,
      color: "#8B5CF6",
    },
  ],
  "2024": [
    {
      month: "2月",
      category: "competition",
      title: "SuperCon本選で2位に 🏆",
      description: "本選で準優勝を獲得。",
      details: ["アルゴリズム最適化が評価", "チーム連携で高得点"],
      isHighlight: true,
      icon: Trophy,
      color: "#F59E0B",
    },
    {
      month: "7月",
      category: "achievement",
      title: "AtCoder 黄色達成 ⭐",
      description: "ついに黄色コーダーへ到達。",
      details: ["レート2000+", "安定したパフォーマンスを維持"],
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
      description: "日本情報オリンピック春合宿へ進出。",
      details: ["本選突破", "上位層との競技経験を獲得"],
      isHighlight: true,
      icon: Award,
      color: "#EC4899",
    },
  ],
};

const getCategory = (category: string) => {
  const map = {
    education: { label: "学業", color: "#64748B" },
    programming: { label: "プログラミング", color: "#6366F1" },
    achievement: { label: "達成", color: "#10B981" },
    competition: { label: "コンテスト", color: "#F59E0B" },
  } as const;
  return map[category as keyof typeof map] ?? map.education;
};

const getYearStyle = (year: string) => {
  const map: Record<string, { bg: string; gradient: string; line: string; accent: string }> = {
    "2020": { bg: "bg-slate-50", gradient: "from-slate-400 to-slate-500", line: "#64748B", accent: "#64748B" },
    "2022": { bg: "bg-blue-50", gradient: "from-blue-400 to-blue-500", line: "#3B82F6", accent: "#3B82F6" },
    "2023": { bg: "bg-cyan-50", gradient: "from-cyan-400 to-cyan-500", line: "#06B6D4", accent: "#06B6D4" },
    "2024": { bg: "bg-yellow-50", gradient: "from-yellow-400 to-yellow-500", line: "#FBBF24", accent: "#FBBF24" },
    "2025": { bg: "bg-pink-50", gradient: "from-pink-400 to-pink-500", line: "#EC4899", accent: "#EC4899" },
  };
  return map[year] ?? map["2020"];
};

const PortfolioTimeline = () => {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-24">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-yellow-500/20 blur-3xl" />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 bg-gradient-to-r from-yellow-300 to-blue-300 bg-clip-text text-6xl font-black tracking-tight text-transparent">
            Timeline
          </h1>
          <p className="text-xl font-light leading-relaxed text-slate-300">
            これまでの歩みを時系列で振り返ります。
            <br />
            競技プログラミングを中心に様々な経験を積んできました。
          </p>
        </div>
      </section>

      <div className="pb-0">
        {Object.entries(eventsByYear).map(([year, events]) => {
          const style = getYearStyle(year);
          return (
            <section className={`border-y border-slate-200 px-6 py-16 ${style.bg}`} key={year}>
              <div className="mx-auto max-w-5xl">
                <div className="mb-16 flex items-center gap-6">
                  <div className={`inline-flex items-center justify-center rounded-2xl bg-gradient-to-r ${style.gradient} px-8 py-4 shadow-xl`}>
                    <div className="flex items-center gap-3">
                      <Calendar className="text-white" size={32} strokeWidth={2.5} />
                      <h2 className="text-5xl font-black text-white">{year}</h2>
                    </div>
                  </div>
                  <div className="h-1 flex-1 rounded-full" style={{ backgroundColor: style.line }} />
                </div>

                <div className="relative">
                  <div className="absolute bottom-0 left-8 top-0 w-1 md:left-1/2" style={{ backgroundColor: style.line }} />
                  {events.map((event, index) => {
                    const category = getCategory(event.category);
                    return (
                      <div
                        className={`relative mb-12 last:mb-0 ${
                          index % 2 === 0 ? "md:pr-[50%] md:text-right" : "md:ml-auto md:pl-[50%]"
                        }`}
                        key={`${year}-${event.month}-${event.title}`}
                      >
                        <div className={`absolute left-0 flex items-center justify-center md:left-1/2 ${index % 2 === 0 ? "md:-translate-x-1/2" : ""}`}>
                          <div
                            className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white shadow-lg"
                            style={{ backgroundColor: event.color }}
                          >
                            <event.icon className="text-white" size={28} strokeWidth={2} />
                          </div>
                        </div>
                        <div className={`ml-24 md:ml-0 ${index % 2 === 0 ? "md:mr-28" : "md:ml-28"}`}>
                          <div
                            className={`group rounded-2xl p-6 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl ${
                              event.isHighlight
                                ? "border-2 bg-white shadow-xl"
                                : "border-2 border-slate-200 bg-white/90 shadow-md backdrop-blur-sm"
                            }`}
                            style={{ borderColor: event.isHighlight ? style.accent : undefined }}
                          >
                            <div className="mb-3 flex flex-wrap items-center gap-3">
                              <span
                                className="rounded-lg px-3 py-1 text-xs font-semibold"
                                style={{
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                  border: `1px solid ${category.color}40`,
                                }}
                              >
                                {category.label}
                              </span>
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Calendar size={14} />
                                <span className="font-medium">
                                  {year}年 {event.month}
                                </span>
                              </div>
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-slate-900">{event.title}</h3>
                            <p className="mb-4 leading-relaxed text-slate-600">{event.description}</p>
                            <ul className="space-y-2">
                              {event.details.map((detail) => (
                                <li className="flex items-start gap-3 text-sm text-slate-600" key={detail}>
                                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: event.color }} />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                            {event.isHighlight ? (
                              <div className="mt-4 border-t border-slate-200 pt-4">
                                <div className="flex items-center gap-2">
                                  <Star fill={style.accent} size={16} style={{ color: style.accent }} />
                                  <span className="text-xs font-semibold" style={{ color: style.accent }}>
                                    ハイライト
                                  </span>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioTimeline;
