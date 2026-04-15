import { profileLinks } from "./portfolioData";

const PortfolioLinks = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-24">
        <div className="absolute left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-cyan-500/20 blur-3xl" />
        <div
          className="absolute bottom-0 right-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h1 className="mb-6 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-6xl font-black tracking-tight text-transparent">
            Links
          </h1>
          <p className="text-xl font-light leading-relaxed text-slate-300">
            SNS、開発アカウント、外部サービスへのリンク一覧です。
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {profileLinks.map((link) => (
              <a
                className="group relative z-0 flex h-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-500 hover:z-10 hover:scale-105 hover:bg-slate-50"
                href={link.url}
                key={link.name}
                rel="noreferrer"
                target="_blank"
              >
                <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-3xl transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                  {link.icon}
                </div>
                <span className="relative text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioLinks;
