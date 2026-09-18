import { useEffect, useId, useRef, useState } from "react";

type UnityInstance = {
  Quit: () => Promise<void>;
  SetFullscreen: (value: number) => void;
};
type UnityConfig = {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl?: string;
  productName?: string;
  companyName?: string;
  productVersion?: string;
};
type UnityFactory = (
  canvas: HTMLCanvasElement,
  config: UnityConfig,
  onProgress: (progress: number) => void
) => Promise<UnityInstance>;
type Props = {
  title: string;
  loaderUrl: string;
  config: UnityConfig;
  width?: number;
  height?: number;
};

export default function UnityPlayer({
  title,
  loaderUrl,
  config,
  width = 960,
  height = 600,
}: Props) {
  // Emscripten looks up keyboard events using `#${canvas.id}`. React IDs
  // contain colons, so normalize them before using one as a CSS selector.
  const canvasId = `unity-canvas-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<UnityInstance | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!attempt || !canvasRef.current) return;
    let disposed = false;
    let instance: UnityInstance | null = null;
    const script = document.createElement("script");
    const fail = () => {
      if (!disposed) setStatus("error");
    };
    script.src = loaderUrl;
    script.async = true;
    script.onerror = fail;
    script.onload = async () => {
      if (disposed || !canvasRef.current) return;
      try {
        const factory = (
          window as Window & { createUnityInstance?: UnityFactory }
        ).createUnityInstance;
        if (!factory) throw new Error("Unity loader unavailable");
        const loaded = await factory(canvasRef.current, config, (value) => {
          if (!disposed) setProgress(Math.min(100, Math.round(value * 100)));
        });
        if (disposed) {
          await loaded.Quit();
          return;
        }
        instance = loaded;
        instanceRef.current = loaded;
        setStatus("ready");
      } catch {
        fail();
      }
    };
    document.body.appendChild(script);
    return () => {
      disposed = true;
      script.onload = null;
      script.onerror = null;
      script.remove();
      instanceRef.current = null;
      if (instance) void instance.Quit().catch(() => undefined);
    };
  }, [attempt, loaderUrl, config]);

  const start = () => {
    setProgress(0);
    setStatus("loading");
    setAttempt((value) => value + 1);
  };
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-black shadow-sm">
      <div
        className="relative w-full"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {attempt > 0 && (
          <canvas
            aria-label={title}
            height={height}
            id={canvasId}
            key={attempt}
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
              background: "#231f20",
            }}
            width={width}
          />
        )}
        {status !== "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/85 p-4 text-center text-white">
            {status === "loading" ? (
              <p role="status">読み込み中… {progress}%</p>
            ) : (
              <>
                {status === "error" && (
                  <p role="alert">
                    ゲームを読み込めませんでした。接続を確認して、もう一度お試しください。
                  </p>
                )}
                <button
                  className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700"
                  onClick={start}
                  type="button"
                >
                  {status === "error" ? "再試行" : "ゲーム開始"}
                </button>
              </>
            )}
          </div>
        )}
        {status === "ready" && (
          <button
            className="absolute right-4 top-4 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900"
            onClick={() => instanceRef.current?.SetFullscreen(1)}
            type="button"
          >
            全画面表示
          </button>
        )}
      </div>
    </div>
  );
}
