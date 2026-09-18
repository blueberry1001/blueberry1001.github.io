import { useState, type ReactNode } from "react";

type ExternalGamePlayerProps = {
  title: string;
  url: string;
  fixedWidth?: boolean;
  children?: ReactNode;
};

export default function ExternalGamePlayer({
  title,
  url,
  fixedWidth = false,
  children,
}: ExternalGamePlayerProps) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {playing ? (
        <div className="overflow-x-auto">
          <iframe
            allow="fullscreen"
            allowFullScreen
            className={
              fixedWidth
                ? "block h-[600px] w-full min-w-[980px] border-0"
                : "block aspect-video min-h-64 w-full border-0"
            }
            src={url}
            title={`${title} ゲーム画面`}
          />
        </div>
      ) : (
        <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-slate-600">
            ブラウザで遊べます。起動時にゲームデータを読み込みます。
          </p>
          <button
            className="rounded-full bg-slate-800 px-8 py-3 font-semibold text-white hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-800"
            onClick={() => setPlaying(true)}
            type="button"
          >
            ゲームを起動
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200 p-5 text-sm">
        <a
          className="text-slate-700 underline underline-offset-4"
          href={url}
          rel="noopener noreferrer"
          target="_blank"
        >
          ゲームを別タブで開く ↗
        </a>
        {children}
        {playing ? (
          <button
            className="text-slate-600 underline underline-offset-4"
            onClick={() => setPlaying(false)}
            type="button"
          >
            ゲームを終了
          </button>
        ) : null}
      </div>
    </div>
  );
}
