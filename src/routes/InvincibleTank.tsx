import ReleaseNotes, { type ReleaseNote } from "../components/ReleaseNotes";
import UnityPlayer from "../components/UnityPlayer";

const baseUrl = `https://blueberry1001.github.io/InvincibleTank`;
const config = {
  dataUrl: `${baseUrl}/Build/InvincibleTank.data`,
  frameworkUrl: `${baseUrl}/Build/InvincibleTank.framework.js`,
  codeUrl: `${baseUrl}/Build/InvincibleTank.wasm`,
  streamingAssetsUrl: `${baseUrl}/StreamingAssets`,
  productName: "InvincibleTank",
};
const releaseNotes: ReleaseNote[] = [
  {
    version: "v1.0.3",
    date: "2025/4/16",
    updates: [
      "強化札「貫通」を暫定実装しました。取得することで自分の弾が相手の弾に一定回数弾かれなくなります。",
      "貫通効果の実装と合わせて、弾の重さを1/1000にしました。",
      "「複雑な条件で解放される強化札」が実装されました。今回追加された「貫通」は、弾速Lv5以上で出現するようになります。",
      "ステージ構成を調整しました。",
      "敵の弾同士がぶつかって消滅していた問題を修正しました。",
      "再生速度札が会心ダメージ札に置換されていた問題を修正しました。",
    ],
  },
  {
    version: "v1.0.2",
    date: "2025/4/09",
    updates: [
      "「AMX」を実装しました。高速に回避しながら連射力の高い弾を撃ってくる厄介な敵です。",
      "ステージ構成を調整しました。",
      "「カリオペ」の初動の弾速を2倍から1.1倍に下方修正しました。",
      "「チャーチル」の再生速度がステージ番号によるバフを受けていない問題を修正しました。",
    ],
  },
  {
    version: "v1.0.1",
    date: "2025/04/07",
    updates: [
      "バグ修正：爆弾魔が敗北後に次のステージに持ち越される",
      "カリオペの2個目の砲塔を追加",
      "敵のステータスを調整",
      "プレイ状況が制作者Discordサーバーに送信されるようになりました",
      "弾クソデカ問題を修正",
      "特殊な戦車のアニメーションを追加",
    ],
  },
  {
    version: "v1.0.0",
    date: "2025/03/27",
    updates: [
      "リリースノートを書き始めた",
      "ステージが始まる直前のカウントダウンの際にタイマーがリセットされていない問題を修正",
      "強化札をリロードする機能を実装",
      "カリオペの初動を実装。合わせて、敵の弾ブレを設定できるようになった。",
    ],
  },
  {
    version: "以前の修正一覧",
    date: "2024/03/27以前",
    updates: [
      "強化札を選択できる回数に上限をつけた",
      "新強化札「3WAY」を実装 取ると3方向に弾が飛ぶ",
      "敵の強さを調整した。特に、赤の戦車が大幅に弱体化し、緑が強化された。",
      "敵の強くなり方を調整した。連射速度や弾速については緩やかに、HPや攻撃力についてはステージ番号に比例するぐらいの増やし方にした",
      "説明画面を動画に対応させた。",
      "選んでる時のわくわく",
      "カンストしたステータスを黄色文字に",
      "終了するボタン",
      "会心を実装",
      "新しい敵「T95」の実装",
      "再生効果を実装",
      "15ステージ目以降で敵の数が増えるように変更",
      "スマホプレイに少しだけ対応（依然移動は不可）",
    ],
  },
];

export default function InvincibleTank() {
  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-4xl font-black text-slate-900">
            Invincible Tank
          </h1>
          <p className="text-slate-600">最強の戦車を作ろう！</p>
        </div>
        <UnityPlayer
          config={config}
          height={1080}
          loaderUrl={`${baseUrl}/Build/InvincibleTank.loader.js`}
          title="InvincibleTank"
          width={1920}
        />
        <ReleaseNotes notes={releaseNotes} />
      </div>
    </section>
  );
}
