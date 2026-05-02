import { useMemo, useState, type FormEvent } from "react";

import {
  getUserRatingHistory,
  type CacheSource,
  type RatingHistoryPoint,
} from "./atcoderRatingApi";

type ChartMode = "overlay" | "diff";
type YAxisRangeMode = "auto" | "manual";

type PlotPoint = {
  x: number;
  y: number;
  label: string;
};

type ChartSeries = {
  name: string;
  color: string;
  points: PlotPoint[];
};

const CHART_WIDTH = 980;
const CHART_HEIGHT = 420;
const MARGIN = { top: 28, right: 24, bottom: 38, left: 58 };

const RATING_BANDS = [
  { min: 0, max: 400, color: "#8080801A", label: "灰" },
  { min: 400, max: 800, color: "#8B45131A", label: "茶" },
  { min: 800, max: 1200, color: "#0080001A", label: "緑" },
  { min: 1200, max: 1600, color: "#00C0C01A", label: "水" },
  { min: 1600, max: 2000, color: "#0000FF1A", label: "青" },
  { min: 2000, max: 2400, color: "#C0C0001A", label: "黄" },
  { min: 2400, max: 2800, color: "#FF80001A", label: "橙" },
  { min: 2800, max: 5000, color: "#FF00001A", label: "赤" },
];

const dateInputToTimestamp = (value: string, isEndOfDay = false) => {
  if (!value) return null;
  const timestamp = new Date(
    `${value}${isEndOfDay ? "T23:59:59.999+09:00" : "T00:00:00+09:00"}`
  ).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const timestampToDateInput = (timestamp: number) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const makeDiffSeries = (
  aName: string,
  bName: string,
  aHistory: RatingHistoryPoint[],
  bHistory: RatingHistoryPoint[]
): ChartSeries => {
  const bByContest = new Map(bHistory.map((point) => [point.contestId, point]));
  const points = aHistory
    .filter((point) => bByContest.has(point.contestId))
    .map((aPoint) => {
      const bPoint = bByContest.get(aPoint.contestId);
      if (!bPoint) return null;
      return {
        x: aPoint.timestamp,
        y: aPoint.newRating - bPoint.newRating,
        label: aPoint.contestName,
      };
    })
    .filter((point): point is PlotPoint => point !== null)
    .sort((left, right) => left.x - right.x);

  return {
    name: `${aName} - ${bName}`,
    color: "#8B5CF6",
    points,
  };
};

const filterByRange = (
  points: RatingHistoryPoint[],
  minTimestamp: number | null,
  maxTimestamp: number | null
) =>
  points.filter((point) => {
    if (minTimestamp !== null && point.timestamp < minTimestamp) return false;
    if (maxTimestamp !== null && point.timestamp > maxTimestamp) return false;
    return true;
  });

const buildPolyline = (
  points: PlotPoint[],
  xValueToSvg: (value: number, index: number) => number,
  yValueToSvg: (value: number) => number
) =>
  points
    .map(
      (point, index) => `${xValueToSvg(point.x, index)},${yValueToSvg(point.y)}`
    )
    .join(" ");

const Chart = ({
  series,
  isDiffMode,
  manualYRange,
}: {
  series: ChartSeries[];
  isDiffMode: boolean;
  manualYRange: { min: number; max: number } | null;
}) => {
  const allPoints = useMemo(
    () => series.flatMap((item) => item.points),
    [series]
  );
  if (allPoints.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
        指定した範囲にデータがありません。
      </div>
    );
  }

  const xValues = allPoints.map((point) => point.x);
  const yValues = allPoints.map((point) => point.y);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMinRaw = Math.min(...yValues);
  const yMaxRaw = Math.max(...yValues);
  const yPadding = Math.max(80, Math.ceil((yMaxRaw - yMinRaw) * 0.15));
  const yMinWithPadding = Math.floor((yMinRaw - yPadding) / 100) * 100;
  const autoYMin = isDiffMode ? yMinWithPadding : Math.max(0, yMinWithPadding);
  const autoYMax = Math.ceil((yMaxRaw + yPadding) / 100) * 100;
  const hasManualRange =
    manualYRange !== null && manualYRange.max > manualYRange.min;
  const yMin = hasManualRange
    ? isDiffMode
      ? manualYRange.min
      : Math.max(0, manualYRange.min)
    : autoYMin;
  const yMax = hasManualRange ? manualYRange.max : autoYMax;

  const plotWidth = CHART_WIDTH - MARGIN.left - MARGIN.right;
  const plotHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;
  const yScale = (value: number) =>
    MARGIN.top + ((yMax - value) / Math.max(1, yMax - yMin)) * plotHeight;

  const xScale = (value: number, index: number, pointLength: number) => {
    if (pointLength === 1) return MARGIN.left + plotWidth / 2;
    if (xMax === xMin)
      return MARGIN.left + (index / Math.max(1, pointLength - 1)) * plotWidth;
    return MARGIN.left + ((value - xMin) / (xMax - xMin)) * plotWidth;
  };

  const yGuideValues = Array.from({ length: 6 }, (_, index) =>
    Math.round(yMin + ((yMax - yMin) * index) / 5)
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <svg
        className="w-full min-w-[760px]"
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      >
        <rect
          fill="#FFFFFF"
          height={CHART_HEIGHT}
          rx={16}
          width={CHART_WIDTH}
          x={0}
          y={0}
        />

        {!isDiffMode &&
          RATING_BANDS.map((band) => {
            const top = Math.max(yMin, band.min);
            const bottom = Math.min(yMax, band.max);
            if (bottom <= top) return null;
            return (
              <rect
                fill={band.color}
                height={yScale(top) - yScale(bottom)}
                key={band.label}
                width={plotWidth}
                x={MARGIN.left}
                y={yScale(bottom)}
              />
            );
          })}

        {yGuideValues.map((value) => (
          <g key={value}>
            <line
              stroke="#CBD5E1"
              strokeDasharray="4 4"
              strokeWidth={1}
              x1={MARGIN.left}
              x2={CHART_WIDTH - MARGIN.right}
              y1={yScale(value)}
              y2={yScale(value)}
            />
            <text
              fill="#475569"
              fontSize={12}
              textAnchor="end"
              x={MARGIN.left - 8}
              y={yScale(value) + 4}
            >
              {value}
            </text>
          </g>
        ))}

        {isDiffMode && yMin <= 0 && yMax >= 0 && (
          <line
            stroke="#0F172A"
            strokeDasharray="8 4"
            strokeWidth={1.5}
            x1={MARGIN.left}
            x2={CHART_WIDTH - MARGIN.right}
            y1={yScale(0)}
            y2={yScale(0)}
          />
        )}

        {series.map((line) => {
          if (line.points.length === 0) return null;
          const polyline = buildPolyline(
            line.points,
            (value, index) => xScale(value, index, line.points.length),
            yScale
          );

          return (
            <g key={line.name}>
              <polyline
                fill="none"
                points={polyline}
                stroke={line.color}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
              />
              {line.points.map((point, index) => (
                <circle
                  cx={xScale(point.x, index, line.points.length)}
                  cy={yScale(point.y)}
                  fill={line.color}
                  key={`${line.name}-${point.label}-${point.x}`}
                  r={3.8}
                >
                  <title>{`${line.name}\n${point.label}\n${point.y}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const AtCoderRatingVisualizer = () => {
  const [leftUserInput, setLeftUserInput] = useState("blueberry1001");
  const [rightUserInput, setRightUserInput] = useState("chokudai");
  const [leftHistory, setLeftHistory] = useState<RatingHistoryPoint[]>([]);
  const [rightHistory, setRightHistory] = useState<RatingHistoryPoint[]>([]);
  const [leftUserLoaded, setLeftUserLoaded] = useState("");
  const [rightUserLoaded, setRightUserLoaded] = useState("");
  const [leftSource, setLeftSource] = useState<CacheSource>("network");
  const [rightSource, setRightSource] = useState<CacheSource>("network");
  const [mode, setMode] = useState<ChartMode>("overlay");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [yAxisRangeMode, setYAxisRangeMode] = useState<YAxisRangeMode>("auto");
  const [manualYMinInput, setManualYMinInput] = useState("");
  const [manualYMaxInput, setManualYMaxInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const rangeStartTimestamp = dateInputToTimestamp(rangeStart);
  const rangeEndTimestamp = dateInputToTimestamp(rangeEnd, true);
  const normalizedLeftInput = leftUserInput.trim().toLowerCase();
  const normalizedRightInput = rightUserInput.trim().toLowerCase();

  const minMaxTimestamp = useMemo(() => {
    const points = [...leftHistory, ...rightHistory];
    if (points.length === 0) return null;
    return {
      min: Math.min(...points.map((point) => point.timestamp)),
      max: Math.max(...points.map((point) => point.timestamp)),
    };
  }, [leftHistory, rightHistory]);

  const hasLeftLoaded = leftHistory.length > 0 && leftUserLoaded !== "";
  const hasRightLoaded = rightHistory.length > 0 && rightUserLoaded !== "";
  const hasBothLoaded = hasLeftLoaded && hasRightLoaded;

  const overlaySeries = useMemo<ChartSeries[]>(() => {
    const series: ChartSeries[] = [];

    if (hasLeftLoaded) {
      series.push({
        name: leftUserLoaded,
        color: "#2563EB",
        points: filterByRange(
          leftHistory,
          rangeStartTimestamp,
          rangeEndTimestamp
        ).map((point) => ({
          x: point.timestamp,
          y: point.newRating,
          label: point.contestName,
        })),
      });
    }

    if (hasRightLoaded) {
      series.push({
        name: rightUserLoaded,
        color: "#EF4444",
        points: filterByRange(
          rightHistory,
          rangeStartTimestamp,
          rangeEndTimestamp
        ).map((point) => ({
          x: point.timestamp,
          y: point.newRating,
          label: point.contestName,
        })),
      });
    }

    return series;
  }, [
    hasLeftLoaded,
    hasRightLoaded,
    leftHistory,
    leftUserLoaded,
    rangeEndTimestamp,
    rangeStartTimestamp,
    rightHistory,
    rightUserLoaded,
  ]);

  const diffSeries = useMemo<ChartSeries[]>(() => {
    if (!hasBothLoaded) return [];
    const rangeFilteredLeft = filterByRange(
      leftHistory,
      rangeStartTimestamp,
      rangeEndTimestamp
    );
    const rangeFilteredRight = filterByRange(
      rightHistory,
      rangeStartTimestamp,
      rangeEndTimestamp
    );
    return [
      makeDiffSeries(
        leftUserLoaded,
        rightUserLoaded,
        rangeFilteredLeft,
        rangeFilteredRight
      ),
    ];
  }, [
    leftHistory,
    leftUserLoaded,
    hasBothLoaded,
    rangeEndTimestamp,
    rangeStartTimestamp,
    rightHistory,
    rightUserLoaded,
  ]);

  const activeSeries = mode === "overlay" ? overlaySeries : diffSeries;
  const manualYMin = manualYMinInput === "" ? null : Number(manualYMinInput);
  const manualYMax = manualYMaxInput === "" ? null : Number(manualYMaxInput);
  const isManualYRangeValid =
    manualYMin !== null &&
    manualYMax !== null &&
    Number.isFinite(manualYMin) &&
    Number.isFinite(manualYMax) &&
    manualYMax > manualYMin &&
    (mode === "diff" || manualYMin >= 0);
  const manualYRange =
    yAxisRangeMode === "manual" && isManualYRangeValid
      ? { min: manualYMin, max: manualYMax }
      : null;
  const showManualYRangeError =
    yAxisRangeMode === "manual" &&
    (manualYMinInput !== "" || manualYMaxInput !== "") &&
    !isManualYRangeValid;

  const latestLeft = hasLeftLoaded
    ? leftHistory[leftHistory.length - 1]?.newRating ?? null
    : null;
  const latestRight = hasRightLoaded
    ? rightHistory[rightHistory.length - 1]?.newRating ?? null
    : null;
  const latestDiff =
    diffSeries[0]?.points[diffSeries[0]?.points.length - 1]?.y ?? null;

  const loadHistories = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const left = normalizedLeftInput;
      const right = normalizedRightInput;
      if (!left && !right) {
        throw new Error("ユーザー名を少なくとも1つ入力してください。");
      }

      const leftPromise = left ? getUserRatingHistory(left) : null;
      const rightPromise =
        right && right !== left ? getUserRatingHistory(right) : null;

      const [leftResultRaw, rightResultRaw] = await Promise.all([
        leftPromise ?? Promise.resolve(null),
        rightPromise ?? Promise.resolve(null),
      ]);
      const leftResult = leftResultRaw;
      const rightResult =
        right && right === left && leftResult ? leftResult : rightResultRaw;

      if (leftResult) {
        setLeftHistory(leftResult.history);
        setLeftUserLoaded(leftResult.user);
        setLeftSource(leftResult.source);
      } else {
        setLeftHistory([]);
        setLeftUserLoaded("");
      }

      if (rightResult) {
        setRightHistory(rightResult.history);
        setRightUserLoaded(rightResult.user);
        setRightSource(rightResult.source);
      } else {
        setRightHistory([]);
        setRightUserLoaded("");
      }

      if (!(leftResult && rightResult) && mode === "diff") {
        setMode("overlay");
      }

      const loadedHistories = [leftResult?.history, rightResult?.history].filter(
        (history): history is RatingHistoryPoint[] => history !== undefined && history !== null
      );
      if (loadedHistories.length > 0) {
        const minTimestamp = Math.min(
          ...loadedHistories.map((history) => history[0].timestamp)
        );
        const maxTimestamp = Math.max(
          ...loadedHistories.map((history) => history[history.length - 1].timestamp)
        );
        setRangeStart(timestampToDateInput(minTimestamp));
        setRangeEnd(timestampToDateInput(maxTimestamp));
      }
    } catch (unknownError) {
      if (unknownError instanceof Error) {
        setError(unknownError.message);
      } else {
        setError("データの取得に失敗しました。");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const applyQuickRange = (contestCount: number) => {
    const source =
      mode === "diff"
        ? makeDiffSeries(
            leftUserLoaded,
            rightUserLoaded,
            leftHistory,
            rightHistory
          ).points
        : [...leftHistory, ...rightHistory]
            .map((point) => ({ x: point.timestamp }))
            .sort((a, b) => a.x - b.x);
    if (!source || source.length === 0) return;

    const startIndex = Math.max(0, source.length - contestCount);
    const startTimestamp = source[startIndex].x;
    const endTimestamp = source[source.length - 1].x;
    setRangeStart(timestampToDateInput(startTimestamp));
    setRangeEnd(timestampToDateInput(endTimestamp));
  };

  const hasLoaded = hasLeftLoaded || hasRightLoaded;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-black text-transparent md:text-5xl">
          AtCoder Rating Visualizer
        </h1>
        <p className="mb-8 text-slate-600">レーティング差分いろいろ</p>

        <form
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          onSubmit={loadHistories}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm font-semibold text-slate-700">
              User A
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(event) => setLeftUserInput(event.target.value)}
                placeholder="blueberry1001"
                style={{ colorScheme: "light" }}
                value={leftUserInput}
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              User B
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(event) => setRightUserInput(event.target.value)}
                placeholder="chokudai"
                style={{ colorScheme: "light" }}
                value={rightUserInput}
              />
            </label>
            <label className="block text-sm font-semibold text-slate-700">
              表示モード
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                onChange={(event) => setMode(event.target.value as ChartMode)}
                style={{ colorScheme: "light" }}
                value={mode}
              >
                <option value="overlay">2人のグラフを重ねて表示</option>
                <option value="diff">2人の差分のみを表示</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "読み込み中..." : "描画する"}
            </button>
            <button
              className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-100"
              onClick={() => {
                setLeftUserInput(rightUserInput);
                setRightUserInput(leftUserInput);
              }}
              type="button"
            >
              User A/B を入れ替える
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {hasLoaded && (
          <>
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              {hasLeftLoaded && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                  <p className="text-xs text-blue-700">最新レート (A)</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {latestLeft ?? "-"}
                  </p>
                  <p className="text-xs text-blue-700">
                    {leftUserLoaded} / source: {leftSource}
                  </p>
                </div>
              )}
              {hasRightLoaded && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-xs text-red-700">最新レート (B)</p>
                  <p className="text-3xl font-bold text-red-900">
                    {latestRight ?? "-"}
                  </p>
                  <p className="text-xs text-red-700">
                    {rightUserLoaded} / source: {rightSource}
                  </p>
                </div>
              )}
              {hasBothLoaded && (
                <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
                  <p className="text-xs text-violet-700">最新差分 (A - B)</p>
                  <p className="text-3xl font-bold text-violet-900">
                    {latestDiff ?? "-"}
                  </p>
                  <p className="text-xs text-violet-700">
                    差分モードでは同一コンテストのみ比較します
                  </p>
                </div>
              )}
            </div>

            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="grid gap-4 md:grid-cols-3">
                <label className="block text-sm font-semibold text-slate-700">
                  範囲開始
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    max={rangeEnd || undefined}
                    min={
                      minMaxTimestamp
                        ? timestampToDateInput(minMaxTimestamp.min)
                        : undefined
                    }
                    onChange={(event) => setRangeStart(event.target.value)}
                    style={{ colorScheme: "light" }}
                    type="date"
                    value={rangeStart}
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  範囲終了
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    max={
                      minMaxTimestamp
                        ? timestampToDateInput(minMaxTimestamp.max)
                        : undefined
                    }
                    min={rangeStart || undefined}
                    onChange={(event) => setRangeEnd(event.target.value)}
                    style={{ colorScheme: "light" }}
                    type="date"
                    value={rangeEnd}
                  />
                </label>
                <div className="text-sm font-semibold text-slate-700">
                  クイック範囲
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      onClick={() => applyQuickRange(20)}
                      type="button"
                    >
                      直近20
                    </button>
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      onClick={() => applyQuickRange(50)}
                      type="button"
                    >
                      直近50
                    </button>
                    <button
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                      onClick={() => {
                        if (!minMaxTimestamp) return;
                        setRangeStart(
                          timestampToDateInput(minMaxTimestamp.min)
                        );
                        setRangeEnd(timestampToDateInput(minMaxTimestamp.max));
                      }}
                      type="button"
                    >
                      全期間
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    縦軸範囲
                    <select
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      onChange={(event) =>
                        setYAxisRangeMode(event.target.value as YAxisRangeMode)
                      }
                      style={{ colorScheme: "light" }}
                      value={yAxisRangeMode}
                    >
                      <option value="auto">自動調整</option>
                      <option value="manual">手動調整</option>
                    </select>
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Y最小
                    <input
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      disabled={yAxisRangeMode === "auto"}
                      min={mode === "diff" ? undefined : 0}
                      onChange={(event) =>
                        setManualYMinInput(event.target.value)
                      }
                      placeholder={mode === "diff" ? "-400" : "0"}
                      style={{ colorScheme: "light" }}
                      type="number"
                      value={manualYMinInput}
                    />
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    Y最大
                    <input
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 disabled:bg-slate-100 disabled:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      disabled={yAxisRangeMode === "auto"}
                      onChange={(event) =>
                        setManualYMaxInput(event.target.value)
                      }
                      placeholder={mode === "diff" ? "400" : "2600"}
                      style={{ colorScheme: "light" }}
                      type="number"
                      value={manualYMaxInput}
                    />
                  </label>
                </div>
                {showManualYRangeError && (
                  <p className="mt-2 text-sm text-rose-600">
                    手動範囲は「Y最大 &gt;
                    Y最小」で指定してください。通常表示ではY最小は0以上です。
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              {activeSeries.map((series) => (
                <span
                  className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
                  key={series.name}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: series.color }}
                  />
                  {series.name}
                </span>
              ))}
            </div>

            <Chart
              isDiffMode={mode === "diff"}
              manualYRange={manualYRange}
              series={activeSeries}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AtCoderRatingVisualizer;
