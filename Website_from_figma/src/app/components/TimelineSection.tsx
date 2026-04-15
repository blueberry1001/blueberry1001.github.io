import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

export function TimelineSection() {
  const navigate = useNavigate();

  const events = [
    {
      year: "2020",
      items: [
        "筑波大学附属中学校に入学",
        "Unity、AviUtlを開始",
      ],
      isHighlight: false,
    },
    {
      year: "2022",
      items: [
        "AtCoderを開始",
        "AtCoder 茶色",
      ],
      isHighlight: false,
    },
    {
      year: "2023",
      items: [
        "筑波大学附属高等学校に入学",
        "AtCoder 緑・水・青色に",
        "SuperCon本選出場",
        "JOI2次予選を通過",
      ],
      isHighlight: false,
    },
    {
      year: "2024",
      items: [
        "SuperCon本選で2位に 🏆",
        "AtCoder 黄色 ⭐",
      ],
      isHighlight: true,
    },
    {
      year: "2025",
      items: [
        "JOI春合宿に進出 🎉",
      ],
      isHighlight: true,
    },
  ];

  return (
    <section id="timeline" className="w-full py-20 px-6 bg-slate-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-5xl font-bold text-slate-900 tracking-tight">
            Timeline
          </h2>
          <button
            onClick={() => navigate("/timeline")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-all duration-300 hover:scale-105 group"
          >
            <span>詳しく見る</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="relative">
          {/* Vertical gradient line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-cyan-500 to-yellow-400" />
          
          {events.map((event, index) => (
            <div
              key={event.year}
              className={`relative mb-16 last:mb-0 ${
                index % 2 === 0 ? "md:pr-1/2 md:text-right" : "md:pl-1/2 md:ml-auto"
              }`}
            >
              {/* Year indicator */}
              <div
                className={`absolute left-0 md:left-1/2 flex items-center justify-center ${
                  index % 2 === 0 ? "md:-translate-x-1/2" : "md:translate-x-0 md:-ml-0"
                }`}
              >
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold shadow-lg backdrop-blur-sm border-2 transition-all duration-500 hover:scale-110 ${
                    event.isHighlight 
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-slate-900 border-yellow-300 shadow-yellow-200" 
                      : "bg-gradient-to-br from-blue-500 to-blue-600 text-white border-blue-400 shadow-blue-200"
                  }`}
                >
                  <span className="text-lg">{event.year}</span>
                </div>
              </div>

              {/* Content card */}
              <div
                className={`ml-28 md:ml-0 ${
                  index % 2 === 0 ? "md:mr-32" : "md:ml-32"
                }`}
              >
                <div
                  className={`group p-6 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                    event.isHighlight
                      ? "bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 shadow-lg shadow-yellow-100"
                      : "bg-white border-2 border-slate-200 shadow-md"
                  }`}
                >
                  <ul className="space-y-3">
                    {event.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className={`flex items-start gap-3 ${
                          event.isHighlight ? "text-slate-800 font-semibold" : "text-slate-700"
                        }`}
                      >
                        <span 
                          className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                            event.isHighlight ? "bg-yellow-500" : "bg-blue-500"
                          }`}
                        />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}