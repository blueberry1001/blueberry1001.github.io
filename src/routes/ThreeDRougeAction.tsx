import ReleaseNotes, { type ReleaseNote } from "../components/ReleaseNotes";
import UnityPlayer from "../components/UnityPlayer";

const baseUrl = `${import.meta.env.BASE_URL}Gamedata/3DRougeAction`;
const config = {
  dataUrl: `${baseUrl}/Build/Build.data`,
  frameworkUrl: `${baseUrl}/Build/Build.framework.js`,
  codeUrl: `${baseUrl}/Build/Build.wasm`,
  streamingAssetsUrl: `${baseUrl}/StreamingAssets`,
  companyName: "DefaultCompany",
  productName: "3DRougeAction",
  productVersion: "0.1.0",
};
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

export default function ThreeDRougeAction() {
  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-4xl font-black text-slate-900">
            3DRougeAction
          </h1>
          <p className="text-slate-600">3Dローグライクアクションゲーム</p>
        </div>
        <UnityPlayer
          config={config}
          height={600}
          loaderUrl={`${baseUrl}/Build/Build.loader.js`}
          title="ThreeDRougeAction"
          width={960}
        />
        <ReleaseNotes notes={releaseNotes} />
      </div>
    </section>
  );
}
