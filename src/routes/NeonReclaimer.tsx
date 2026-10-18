import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { ArrowLeft, ArrowRight, ExternalLink, Play } from "lucide-react";

import releases from "../data/neon-reclaimer/releases.json";
import "./NeonReclaimer.css";

export const NEON_GAME_URL =
  "https://blueberry1001.github.io/neon-reclaimer-play/?v=threat-weapons-oct18-1";
const base = "/neon-reclaimer";
const media = `${import.meta.env.BASE_URL}images/neon-reclaimer/`;
const dateLabel = (date: string) => date.replace(/-/g, ".");
type Release = (typeof releases)[number];

function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | Blueberry`;
    return () => {
      document.title = previous;
    };
  }, [title]);
}

function PlayLink() {
  return (
    <a
      className="nr-button"
      href={NEON_GAME_URL}
    >
      <Play aria-hidden="true" fill="currentColor" size={18} />
      ブラウザで遊ぶ
      <ArrowRight aria-hidden="true" size={18} />
    </a>
  );
}

function Breadcrumb({ updates = false }: { updates?: boolean }) {
  return (
    <nav aria-label="パンくずリスト" className="nr-breadcrumb">
      <Link to="/works">作品一覧</Link>
      <span aria-hidden="true">/</span>
      {updates ? (
        <>
          <Link to={base}>NEON RECLAIMER</Link>
          <span aria-hidden="true">/</span>
          <span>更新履歴</span>
        </>
      ) : (
        <span>NEON RECLAIMER</span>
      )}
    </nav>
  );
}

export default function NeonReclaimer() {
  usePageTitle("NEON RECLAIMER");
  const latest = releases[0];
  return (
    <div className="nr-page">
      <div className="nr-container">
        <Breadcrumb />
      </div>
      <header className="nr-hero nr-container">
        <div className="nr-hero-copy">
          <h1>
            NEON
            <br />
            RECLAIMER
          </h1>
          <p className="nr-lead">
            敵を倒し、装備を育てる。
            <br />
            次の挑戦では、さらに先へ。
          </p>
          <p className="nr-description">
            近接武器と自動射撃を組み合わせて戦う、3Dアクション×インクリメンタルゲーム。コインで装備を強化し、倒されても残るコア強化で次の挑戦につなげます。
          </p>
          <div className="nr-actions">
            <PlayLink />
            <Link className="nr-text-link" to={`${base}/updates`}>
              更新履歴
              <ArrowRight aria-hidden="true" size={17} />
            </Link>
          </div>
          <p className="nr-platform">
            PC・スマートフォン対応<span aria-hidden="true"> · </span>ブラウザ版
          </p>
        </div>
        <figure className="nr-hero-image">
          <img
            alt="絲刃で敵をつなぎ、銃やドローンと連携して戦うゲーム画面"
            fetchPriority="high"
            height="720"
            src={`${media}combat.webp`}
            width="1280"
          />
          <figcaption>近接・銃・ドローンを組み合わせて戦う。</figcaption>
        </figure>
      </header>

      <div className="nr-release-strip">
        <Link className="nr-container" to={`${base}/updates/${latest.id}`}>
          <span className="nr-strip-label">最新の更新</span>
          <time dateTime={latest.date}>{dateLabel(latest.date)}</time>
          <span className="nr-strip-title">{latest.title}</span>
          <ArrowRight aria-hidden="true" size={20} />
        </Link>
      </div>

      <section
        aria-labelledby="nr-loop-title"
        className="nr-section nr-container nr-intro"
      >
        <h2 id="nr-loop-title">
          装備の組み合わせで、
          <br />
          戦い方が変わる。
        </h2>
        <div className="nr-prose">
          <p>
            剣で切り込む、槍の間合いを保つ、鎌を育て続ける。武器の分岐と専用強化に、銃やドローンの効果を重ねて、自分の戦い方を組み立てます。
          </p>
          <p>
            区画を進むと、新しい敵やボス、必殺技が解放されます。敵を全滅させたあとは強化の時間。倒されたら獲得したコアで強化して、もう一度挑めます。
          </p>
        </div>
      </section>

      <section
        aria-labelledby="nr-draft-title"
        className="nr-draft nr-container"
      >
        <figure>
          <img
            alt="装備ドラフトで提示される3つの強化の選択画面"
            height="720"
            loading="lazy"
            src={`${media}draft.webp`}
            width="1280"
          />
        </figure>
        <div>
          <h2 id="nr-draft-title">
            3つから選んで、
            <br />
            12区画に挑む。
          </h2>
          <p>
            「装備ドラフト」では、決まった区画で提示される3つの強化から1つを選びます。コア強化なしで始まり、通常の挑戦の進行はそのまま残ります。
          </p>
          <p className="nr-small">
            タイトル画面の「装備ドラフト」から遊べます。
          </p>
        </div>
      </section>

      <section
        aria-labelledby="nr-controls-title"
        className="nr-section nr-container nr-controls"
      >
        <div>
          <h2 id="nr-controls-title">操作方法</h2>
          <p>
            銃とドローンは自動で攻撃します。
            <br />
            近接攻撃と移動に集中できます。
          </p>
        </div>
        <div>
          <h3>PC</h3>
          <dl className="nr-key-list">
            <div>
              <dt>移動</dt>
              <dd>
                <kbd>W</kbd>
                <kbd>A</kbd>
                <kbd>S</kbd>
                <kbd>D</kbd>
              </dd>
            </div>
            <div>
              <dt>視点</dt>
              <dd>マウス移動</dd>
            </div>
            <div>
              <dt>近接攻撃 / 溜め</dt>
              <dd>左クリック / 長押し</dd>
            </div>
            <div>
              <dt>回避</dt>
              <dd>
                <kbd>Shift</kbd> / 右クリック
              </dd>
            </div>
            <div>
              <dt>ジャンプ</dt>
              <dd>
                <kbd>Space</kbd>
              </dd>
            </div>
            <div>
              <dt>強化 / 必殺技</dt>
              <dd>
                <kbd>E</kbd> / <kbd>Q</kbd>
              </dd>
            </div>
          </dl>
          <p className="nr-small">
            キー割り当て・感度・音量は設定で変更できます。
          </p>
        </div>
        <div>
          <h3>スマートフォン</h3>
          <p>
            タイトルで「タッチ操作」を選び、画面のスティックとボタンで操作します。
          </p>
          <p>
            横画面にすると、戦闘エリアを広く見渡せます。全画面ボタンも使えます。
          </p>
        </div>
      </section>

      <section aria-label="ゲームを始める" className="nr-bottom nr-container">
        <div>
          <h2>次の区画へ。</h2>
          <p>詳しい仕様はゲーム内の「図鑑・ヘルプ」で確認できます。</p>
        </div>
        <PlayLink />
      </section>
    </div>
  );
}

function ReleaseBody({ release }: { release: Release }) {
  return (
    <div className="nr-release-body">
      {release.sections.map((section) => (
        <section key={section.title}>
          <h3>{section.title}</h3>
          <ul>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function NeonUpdates() {
  usePageTitle("更新履歴 | NEON RECLAIMER");
  const latest = releases[0];
  return (
    <div className="nr-page nr-updates">
      <div className="nr-container">
        <Breadcrumb updates />
        <header className="nr-updates-header">
          <h1>更新履歴</h1>
          <p>NEON RECLAIMER の追加・調整・修正をまとめています。</p>
          <Link className="nr-text-link" to={base}>
            <ArrowLeft aria-hidden="true" size={17} />
            ゲーム紹介へ
          </Link>
        </header>
        <div className="nr-history-layout">
          <aside aria-label="更新日から選ぶ" className="nr-history-nav">
            <h2>更新日</h2>
            <ol>
              {releases.map((release) => (
                <li key={release.id}>
                  <Link to={`${base}/updates/${release.id}`}>
                    <time dateTime={release.date}>
                      {dateLabel(release.date)}
                    </time>
                    <ArrowRight aria-hidden="true" size={15} />
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
          <div className="nr-history-main">
            <article className="nr-latest">
              <div className="nr-release-date">
                <time dateTime={latest.date}>{dateLabel(latest.date)}</time>
                <span>最新</span>
              </div>
              <h2>
                <Link to={`${base}/updates/${latest.id}`}>{latest.title}</Link>
              </h2>
              <p className="nr-summary">{latest.summary}</p>
              <ReleaseBody release={latest} />
              <Link
                className="nr-text-link"
                to={`${base}/updates/${latest.id}`}
              >
                この更新のページへ
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            </article>
            <h2 className="nr-past-heading">これまでの更新</h2>
            <div className="nr-past-list">
              {releases.slice(1).map((release) => (
                <article key={release.id}>
                  <time dateTime={release.date}>{dateLabel(release.date)}</time>
                  <h3>
                    <Link to={`${base}/updates/${release.id}`}>
                      {release.title}
                      <ArrowRight aria-hidden="true" size={19} />
                    </Link>
                  </h3>
                  <p>{release.summary}</p>
                </article>
              ))}
            </div>
            <p className="nr-history-note">
              同じ日の更新は1件にまとめています。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NeonUpdateDetail() {
  const { releaseId } = useParams();
  const index = releases.findIndex((release) => release.id === releaseId);
  const release = releases[index];
  usePageTitle(`${release?.title ?? "更新が見つかりません"} | NEON RECLAIMER`);
  if (!release)
    return (
      <div className="nr-page">
        <div className="nr-container nr-not-found">
          <h1>更新が見つかりません</h1>
          <p>更新履歴から日付を選び直してください。</p>
          <Link className="nr-text-link" to={`${base}/updates`}>
            <ArrowLeft aria-hidden="true" size={17} />
            更新履歴へ
          </Link>
        </div>
      </div>
    );
  return (
    <div className="nr-page nr-updates">
      <div className="nr-container">
        <Breadcrumb updates />
        <div className="nr-detail">
          <Link className="nr-text-link" to={`${base}/updates`}>
            <ArrowLeft aria-hidden="true" size={17} />
            更新履歴へ
          </Link>
          <article>
            <header>
              <time className="nr-detail-date" dateTime={release.date}>
                {dateLabel(release.date)}
              </time>
              <h1>{release.title}</h1>
              <p className="nr-summary">{release.summary}</p>
            </header>
            <ReleaseBody release={release} />
          </article>
          <nav aria-label="前後の更新" className="nr-release-neighbors">
            {releases[index + 1] ? (
              <Link to={`${base}/updates/${releases[index + 1].id}`}>
                <ArrowLeft aria-hidden="true" size={17} />
                <span>
                  前の更新<small>{dateLabel(releases[index + 1].date)}</small>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {releases[index - 1] ? (
              <Link to={`${base}/updates/${releases[index - 1].id}`}>
                <span>
                  次の更新<small>{dateLabel(releases[index - 1].date)}</small>
                </span>
                <ArrowRight aria-hidden="true" size={17} />
              </Link>
            ) : null}
          </nav>
          <a className="nr-text-link" href={NEON_GAME_URL}>
            ゲームで遊ぶ
            <ExternalLink aria-hidden="true" size={17} />
          </a>
        </div>
      </div>
    </div>
  );
}
