import {
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";

import {
  getUserRatingHistory,
  type CacheSource,
  type RatingHistoryPoint,
} from "./atcoderRatingApi";

type ChartMode = "overlay" | "diff";
type YAxisRangeMode = "auto" | "manual";
type PointColorMode = "series" | "rating";

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

const getRatingColor = (rating: number) => {
  if (rating < 400) return "#808080";
  if (rating < 800) return "#8B4513";
  if (rating < 1200) return "#008000";
  if (rating < 1600) return "#00C0C0";
  if (rating < 2000) return "#0000FF";
  if (rating < 2400) return "#C0C000";
  if (rating < 2800) return "#FF8000";
  return "#FF0000";
};

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

const formatDateLabel = (timestamp: number) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}/${month}/${day}`;
};

const makeDiffSeries = (
  aName: string,
  bName: string,
  aHistory: RatingHistoryPoint[],
  bHistory: RatingHistoryPoint[],
  minTimestamp: number | null = null,
  maxTimestamp: number | null = null
): ChartSeries => {
  type DiffEvent = {
    timestamp: number;
    contestId: string;
    contestName: string;
    aNewRating?: number;
    bNewRating?: number;
  };

  const eventMap = new Map<string, DiffEvent>();
  const upsertEvent = (point: RatingHistoryPoint, side: "a" | "b") => {
    const key = `${point.timestamp}-${point.contestId}`;
    const existing = eventMap.get(key);
    const event: DiffEvent = existing ?? {
      timestamp: point.timestamp,
      contestId: point.contestId,
      contestName: point.contestName,
    };
    if (side === "a") event.aNewRating = point.newRating;
    else event.bNewRating = point.newRating;
    eventMap.set(key, event);
  };

  aHistory.forEach((point) => upsertEvent(point, "a"));
  bHistory.forEach((point) => upsertEvent(point, "b"));

  const events = Array.from(eventMap.values()).sort((left, right) => {
    if (left.timestamp !== right.timestamp)
      return left.timestamp - right.timestamp;
    return left.contestId.localeCompare(right.contestId);
  });

  let currentARating: number | null = aHistory[0]?.oldRating ?? null;
  let currentBRating: number | null = bHistory[0]?.oldRating ?? null;
  const points: PlotPoint[] = [];

  for (const event of events) {
    if (maxTimestamp !== null && event.timestamp > maxTimestamp) break;

    if (event.aNewRating !== undefined) currentARating = event.aNewRating;
    if (event.bNewRating !== undefined) currentBRating = event.bNewRating;

    if (minTimestamp !== null && event.timestamp < minTimestamp) continue;
    if (currentARating === null || currentBRating === null) continue;

    const participant =
      event.aNewRating !== undefined && event.bNewRating !== undefined
        ? "両者"
        : event.aNewRating !== undefined
          ? aName
          : bName;
    points.push({
      x: event.timestamp,
      y: currentARating - currentBRating,
      label: `${event.contestName} (${participant})`,
    });
  }

  return {
    name: `${aName} - ${bName}`,
    color: "#7C83A3",
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
  pointColorMode,
  xLabelCount,
  svgRef,
}: {
  series: ChartSeries[];
  isDiffMode: boolean;
  manualYRange: { min: number; max: number } | null;
  pointColorMode: PointColorMode;
  xLabelCount: number;
  svgRef: RefObject<SVGSVGElement | null>;
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
  const xScaleByValue = (value: number) => {
    if (xMax === xMin) return MARGIN.left + plotWidth / 2;
    return MARGIN.left + ((value - xMin) / (xMax - xMin)) * plotWidth;
  };

  const yGuideValues = Array.from({ length: 6 }, (_, index) =>
    Math.round(yMin + ((yMax - yMin) * index) / 5)
  );
  const safeXLabelCount = Math.max(2, Math.min(12, xLabelCount));
  const xGuideValues =
    xMax === xMin
      ? [xMin]
      : Array.from(
          { length: safeXLabelCount },
          (_, index) => xMin + ((xMax - xMin) * index) / (safeXLabelCount - 1)
        );
  const plotBottomY = MARGIN.top + plotHeight;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <svg
        className="w-full min-w-[760px]"
        ref={svgRef}
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

        <line
          stroke="#CBD5E1"
          strokeWidth={1}
          x1={MARGIN.left}
          x2={CHART_WIDTH - MARGIN.right}
          y1={plotBottomY}
          y2={plotBottomY}
        />
        {xGuideValues.map((value, index) => (
          <g key={`${value}-${index}`}>
            <line
              stroke="#94A3B8"
              strokeWidth={1}
              x1={xScaleByValue(value)}
              x2={xScaleByValue(value)}
              y1={plotBottomY}
              y2={plotBottomY + 6}
            />
            <text
              fill="#64748B"
              fontSize={11}
              textAnchor="middle"
              x={xScaleByValue(value)}
              y={CHART_HEIGHT - 10}
            >
              {formatDateLabel(value)}
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
                strokeOpacity={
                  pointColorMode === "rating" && !isDiffMode ? 0.72 : 1
                }
                strokeWidth={
                  pointColorMode === "rating" && !isDiffMode ? 2.3 : 3
                }
              />
              {line.points.map((point, index) => (
                <circle
                  cx={xScale(point.x, index, line.points.length)}
                  cy={yScale(point.y)}
                  fill={
                    pointColorMode === "rating" && !isDiffMode
                      ? getRatingColor(point.y)
                      : line.color
                  }
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
  const [pointColorMode, setPointColorMode] =
    useState<PointColorMode>("series");
  const [xLabelCount, setXLabelCount] = useState(5);
  const [manualYMinInput, setManualYMinInput] = useState("");
  const [manualYMaxInput, setManualYMaxInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState("");
  const [exportError, setExportError] = useState("");
  const chartSvgRef = useRef<SVGSVGElement | null>(null);

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
    return [
      makeDiffSeries(
        leftUserLoaded,
        rightUserLoaded,
        leftHistory,
        rightHistory,
        rangeStartTimestamp,
        rangeEndTimestamp
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
    ? (leftHistory[leftHistory.length - 1]?.newRating ?? null)
    : null;
  const latestRight = hasRightLoaded
    ? (rightHistory[rightHistory.length - 1]?.newRating ?? null)
    : null;
  const latestDiff = hasBothLoaded
    ? (makeDiffSeries(
        leftUserLoaded,
        rightUserLoaded,
        leftHistory,
        rightHistory
      ).points.at(-1)?.y ?? null)
    : null;

  const buildChartPngBlob = async () => {
    const svgElement = chartSvgRef.current;
    if (!svgElement) {
      throw new Error("グラフが見つからないため、画像を生成できません。");
    }
    let svgObjectUrl: string | null = null;
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clonedSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    const serialized = new XMLSerializer().serializeToString(clonedSvg);
    const svgBlob = new Blob([serialized], {
      type: "image/svg+xml;charset=utf-8",
    });
    svgObjectUrl = URL.createObjectURL(svgBlob);

    try {
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () =>
          reject(new Error("グラフ画像の生成に失敗しました。"));
        image.src = svgObjectUrl as string;
      });

      const drawRoundedRect = (
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
      ) => {
        const r = Math.min(radius, width / 2, height / 2);
        context.beginPath();
        context.moveTo(x + r, y);
        context.lineTo(x + width - r, y);
        context.quadraticCurveTo(x + width, y, x + width, y + r);
        context.lineTo(x + width, y + height - r);
        context.quadraticCurveTo(
          x + width,
          y + height,
          x + width - r,
          y + height
        );
        context.lineTo(x + r, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - r);
        context.lineTo(x, y + r);
        context.quadraticCurveTo(x, y, x + r, y);
        context.closePath();
      };

      const legendPaddingX = 16;
      const legendTop = 14;
      const pillHeight = 30;
      const pillGap = 10;
      const dotRadius = 5;
      const canvasLogicalWidth = CHART_WIDTH;
      const legendRows = (() => {
        const rows: {
          x: number;
          y: number;
          text: string;
          color: string;
          width: number;
        }[] = [];
        const measureCanvas = document.createElement("canvas");
        const measureContext = measureCanvas.getContext("2d");
        if (!measureContext) return rows;
        measureContext.font =
          "600 14px system-ui, -apple-system, Segoe UI, sans-serif";
        let x = legendPaddingX;
        let y = legendTop;
        for (const series of activeSeries) {
          const text = series.name;
          const textWidth = measureContext.measureText(text).width;
          const pillWidth = Math.ceil(24 + textWidth + 20);
          if (
            x + pillWidth > canvasLogicalWidth - legendPaddingX &&
            x > legendPaddingX
          ) {
            x = legendPaddingX;
            y += pillHeight + pillGap;
          }
          rows.push({ x, y, text, color: series.color, width: pillWidth });
          x += pillWidth + pillGap;
        }
        return rows;
      })();
      const legendHeight =
        legendRows.length === 0
          ? 0
          : legendRows[legendRows.length - 1].y -
            legendTop +
            pillHeight +
            legendTop;

      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = CHART_WIDTH * scale;
      canvas.height = (CHART_HEIGHT + legendHeight) * scale;
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error(
          "画像変換に必要な描画コンテキストを取得できませんでした..."
        );
      }

      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, CHART_WIDTH, CHART_HEIGHT + legendHeight);
      if (legendRows.length > 0) {
        context.font =
          "600 14px system-ui, -apple-system, Segoe UI, sans-serif";
        context.textBaseline = "middle";
        for (const row of legendRows) {
          drawRoundedRect(context, row.x, row.y, row.width, pillHeight, 999);
          context.fillStyle = "#FFFFFF";
          context.fill();
          context.strokeStyle = "#E2E8F0";
          context.lineWidth = 1;
          context.stroke();

          context.beginPath();
          context.fillStyle = row.color;
          context.arc(
            row.x + 13,
            row.y + pillHeight / 2,
            dotRadius,
            0,
            Math.PI * 2
          );
          context.fill();

          context.fillStyle = "#334155";
          context.fillText(row.text, row.x + 24, row.y + pillHeight / 2);
        }
      }
      context.drawImage(image, 0, legendHeight, CHART_WIDTH, CHART_HEIGHT);

      const usersToken = [leftUserLoaded, rightUserLoaded]
        .filter((name) => name.trim().length > 0)
        .join("-vs-")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 80);
      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("PNG画像の生成に失敗しました。"));
            return;
          }
          resolve(blob);
        }, "image/png");
      });

      return { pngBlob, usersToken };
    } finally {
      if (svgObjectUrl) URL.revokeObjectURL(svgObjectUrl);
    }
  };

  const saveChartAsImage = async () => {
    setExportError("");
    setIsExporting(true);
    try {
      const { pngBlob, usersToken } = await buildChartPngBlob();
      const link = document.createElement("a");
      const stamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");
      const pngObjectUrl = URL.createObjectURL(pngBlob);
      link.href = pngObjectUrl;
      link.download = `atcoder-rating-${usersToken || "users"}-${mode}-${stamp}.png`;
      link.click();
      URL.revokeObjectURL(pngObjectUrl);
    } catch (unknownError) {
      setExportError(
        unknownError instanceof Error
          ? unknownError.message
          : "画像保存に失敗しました。"
      );
    } finally {
      setIsExporting(false);
    }
  };

  const copyChartImageToClipboard = async () => {
    setExportError("");
    if (
      !window.isSecureContext ||
      !navigator.clipboard ||
      typeof ClipboardItem === "undefined"
    ) {
      setExportError(
        "この環境ではクリップボード画像コピーに対応していません。"
      );
      return;
    }

    setIsCopying(true);
    try {
      const { pngBlob } = await buildChartPngBlob();
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": pngBlob,
        }),
      ]);
    } catch (unknownError) {
      setExportError(
        unknownError instanceof Error
          ? unknownError.message
          : "クリップボードへのコピーに失敗しました。"
      );
    } finally {
      setIsCopying(false);
    }
  };

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

      const loadedHistories = [
        leftResult?.history,
        rightResult?.history,
      ].filter(
        (history): history is RatingHistoryPoint[] =>
          history !== undefined && history !== null
      );
      if (loadedHistories.length > 0) {
        const minTimestamp = Math.min(
          ...loadedHistories.map((history) => history[0].timestamp)
        );
        const maxTimestamp = Math.max(
          ...loadedHistories.map(
            (history) => history[history.length - 1].timestamp
          )
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
        <p className="mb-8 text-slate-600">
          2人のAtCoder
          IDを入れるとレーティング差分などを見れます。1人だけ入力すれば1人のグラフも見れます。期間の指定なども可能
        </p>

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

              <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <summary className="cursor-pointer select-none text-sm font-semibold text-slate-700">
                  詳細設定
                </summary>
                <div className="mt-3 grid gap-4 md:grid-cols-5">
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
                  <label className="block text-sm font-semibold text-slate-700">
                    点の色
                    <select
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      onChange={(event) =>
                        setPointColorMode(event.target.value as PointColorMode)
                      }
                      style={{ colorScheme: "light" }}
                      value={pointColorMode}
                    >
                      <option value="series">ライン色に合わせる</option>
                      <option value="rating">レート色に合わせる</option>
                    </select>
                  </label>
                  <label className="block text-sm font-semibold text-slate-700">
                    日付ラベル数
                    <select
                      className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      onChange={(event) =>
                        setXLabelCount(Number(event.target.value))
                      }
                      style={{ colorScheme: "light" }}
                      value={xLabelCount}
                    >
                      <option value={3}>少なめ</option>
                      <option value={5}>標準</option>
                      <option value={8}>多め</option>
                      <option value={12}>かなり多め</option>
                    </select>
                  </label>
                </div>
                {showManualYRangeError && (
                  <p className="mt-2 text-sm text-rose-600">
                    手動範囲は「Y最大 &gt;
                    Y最小」で指定してください。通常表示ではY最小は0以上です。
                  </p>
                )}
                {mode === "diff" && pointColorMode === "rating" && (
                  <p className="mt-2 text-sm text-slate-500">
                    差分モードでは点のレート色は使えないため、ライン色で表示します。
                  </p>
                )}
              </details>
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
              <button
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                disabled={isExporting || isCopying}
                onClick={saveChartAsImage}
                type="button"
              >
                {isExporting ? "画像生成中..." : "グラフを画像保存"}
              </button>
              <button
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                disabled={isExporting || isCopying}
                onClick={copyChartImageToClipboard}
                type="button"
              >
                {isCopying ? "コピー中..." : "画像をクリップボードにコピー"}
              </button>
            </div>
            {exportError && (
              <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {exportError}
              </div>
            )}

            <Chart
              isDiffMode={mode === "diff"}
              manualYRange={manualYRange}
              pointColorMode={pointColorMode}
              series={activeSeries}
              svgRef={chartSvgRef}
              xLabelCount={xLabelCount}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AtCoderRatingVisualizer;
