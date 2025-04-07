import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// リリースノートの型定義
type ReleaseNote = {
  version: string;
  date: string;
  updates: string[];
};

const InvincibleTank = () => {
  const unityInstanceRef = useRef<any>(null);
  const location = useLocation();
  const [isGameStarted, setIsGameStarted] = useState(false);

  // リリースノートのデータ
  const releaseNotes: ReleaseNote[] = [
    {
      version: "v1.0.1",
      date: "2024/04/07",
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
      date: "2024/03/27",
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

  const cleanupUnity = () => {
    if (unityInstanceRef.current) {
      unityInstanceRef.current.Quit();
      unityInstanceRef.current = null;
    }
    // 既存のスクリプトを削除
    const existingScript = document.querySelector(
      'script[src*="InvincibleTank.loader.js"]'
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
    const script = document.createElement("script");
    script.src =
      "https://blueberry1001.github.io/InvincibleTank/Build/InvincibleTank.loader.js";
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      createUnityInstance(document.querySelector("#unity-canvas"), {
        dataUrl:
          "https://blueberry1001.github.io/InvincibleTank/Build/InvincibleTank.data",
        frameworkUrl:
          "https://blueberry1001.github.io/InvincibleTank/Build/InvincibleTank.framework.js",
        codeUrl:
          "https://blueberry1001.github.io/InvincibleTank/Build/InvincibleTank.wasm",
      }).then((unityInstance: any) => {
        unityInstanceRef.current = unityInstance;
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
    if (location.pathname !== "/invincibletank") {
      cleanupUnity();
    }
  }, [location]);

  return (
    <div className="game-page">
      <div id="unity-container">
        {!isGameStarted ? (
          <div className="game-start-overlay">
            <button className="primary-button" onClick={startGame}>
              ゲーム開始
            </button>
          </div>
        ) : (
          <>
            <canvas
              height={1080}
              id="unity-canvas"
              style={{
                width: "100%",
                height: "100%",
                background: "#231F20",
              }}
              width={1920}
            />
            <button className="fullscreen-button" onClick={toggleFullscreen}>
              全画面表示
            </button>
          </>
        )}
      </div>
      <div>
        <h1>Invincible Tank</h1>
        <p>最強の戦車を作ろう！</p>
      </div>
      <div className="release-notes">
        <h2>更新履歴</h2>
        <table>
          <thead>
            <tr>
              <th>バージョン</th>
              <th>日付</th>
              <th>更新内容</th>
            </tr>
          </thead>
          <tbody>
            {releaseNotes.map((note) => (
              <tr key={note.version}>
                <td>{note.version}</td>
                <td>{note.date}</td>
                <td>
                  <ul>
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
  );
};

export default InvincibleTank;
