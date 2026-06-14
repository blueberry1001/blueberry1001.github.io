import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

type ReleaseNote = {
  version: string;
  date: string;
  updates: string[];
};

const ThreeDRougeAction = () => {
  const unityInstanceRef = useRef<any>(null);
  const location = useLocation();
  const [isGameStarted, setIsGameStarted] = useState(false);

  const releaseNotes: ReleaseNote[] = [
    {
      version: "v0.1.0",
      date: "2026/06/14",
      updates: [
        "3DRougeAction を新規リリースしました。",
        "3Dアクションとローグライク要素をベースにしたゲームプレイを実装。",
        "WebGLビルドに対応し、ブラウザ上でプレイ可能になりました。",
      ],
    },
  ];

  const cleanupUnity = () => {
    if (unityInstanceRef.current) {
      unityInstanceRef.current.Quit();
      unityInstanceRef.current = null;
    }
    // 既存のスクリプトを削除
    const existingScript = document.querySelector(
      'script[src*="Build.loader.js"]'
    );
    if (existingScript) {
      document.body.removeChild(existingScript);
    }
    // Unityのcanvasをクリア
    const canvas = document.querySelector("#unity-canvas") as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsGameStarted(false);
  };

  const startGame = () => {
    setIsGameStarted(true);

    const baseUrl = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;

    const gamedataPath = `${window.location.origin}${baseUrl}Gamedata/3DRougeAction`;

    const script = document.createElement("script");
    script.src = `${gamedataPath}/Build/Build.loader.js`;
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      createUnityInstance(
        document.querySelector("#unity-canvas"),
        {
          arguments: [],
          dataUrl: `${gamedataPath}/Build/Build.data`,
          frameworkUrl: `${gamedataPath}/Build/Build.framework.js`,
          codeUrl: `${gamedataPath}/Build/Build.wasm`,
          streamingAssetsUrl: "StreamingAssets",
          companyName: "DefaultCompany",
          productName: "3DRougeAction",
          productVersion: "0.1.0",
          showBanner: (msg: string, type: string) => {
            console.warn(`Unity Banner (${type}): ${msg}`);
          },
        },
        (progress: number) => {
          console.log(`Unity Loading: ${100 * progress}%`);
        }
      ).then((unityInstance: any) => {
        unityInstanceRef.current = unityInstance;
      }).catch((err: any) => {
        console.error("Unity Instance Error:", err);
      });
    };

    document.body.appendChild(script);
  };

  const toggleFullscreen = () => {
    if (unityInstanceRef.current) {
      unityInstanceRef.current.SetFullscreen(1);
    }
  };

  useEffect(() => {
    return () => {
      cleanupUnity();
    };
  }, []);

  useEffect(() => {
    if (location.pathname !== "/3d-rogue-action") {
      cleanupUnity();
    }
  }, [location]);

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-4xl font-black text-slate-900">3DRougeAction</h1>
          <p className="text-slate-600">3Dローグライクアクションゲーム</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-black shadow-sm">
          <div className="aspect-[8/5] w-full">
            {!isGameStarted ? (
              <div className="flex h-full items-center justify-center">
                <button
                  className="rounded-xl bg-orange-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-orange-700"
                  onClick={startGame}
                  type="button"
                >
                  ゲーム開始
                </button>
              </div>
            ) : (
              <div className="relative h-full">
                <canvas
                  height={600}
                  id="unity-canvas"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#231F20",
                  }}
                  width={960}
                />
                <button
                  className="absolute right-4 top-4 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 backdrop-blur transition hover:bg-white"
                  onClick={toggleFullscreen}
                  type="button"
                >
                  全画面表示
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">更新履歴</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-left text-sm text-slate-600">
                  <th className="px-3 py-2 font-semibold">バージョン</th>
                  <th className="px-3 py-2 font-semibold">日付</th>
                  <th className="px-3 py-2 font-semibold">更新内容</th>
                </tr>
              </thead>
              <tbody>
                {releaseNotes.map((note) => (
                  <tr className="border-b border-slate-100 align-top" key={note.version}>
                    <td className="px-3 py-3 text-sm font-semibold text-slate-900">{note.version}</td>
                    <td className="px-3 py-3 text-sm text-slate-600">{note.date}</td>
                    <td className="px-3 py-3">
                      <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {note.updates.map((update, index) => (
                          <li key={index}>{update}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDRougeAction;
