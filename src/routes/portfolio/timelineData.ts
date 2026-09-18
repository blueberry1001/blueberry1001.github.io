import records from "../../data/timeline.json";

export type TimelineEvent = {
  id: string;
  year: number | null;
  dateLabel: string;
  category: string;
  visibility: string;
  title: string;
  summary: string;
  details: string[];
  sources: { label: string; url: string }[];
};

export const timelineRecords: TimelineEvent[] = records;

export const timelineCategories: Record<
  string,
  { label: string; color: string }
> = {
  competition: { label: "大会・コンテスト", color: "#2563eb" },
  rating: { label: "レーティング・認定", color: "#0f766e" },
  learning: { label: "学習・研究", color: "#6d28d9" },
  creation: { label: "制作・表現", color: "#0369a1" },
  community: { label: "運営・協力", color: "#b45309" },
  education: { label: "進学・所属", color: "#475569" },
};

export const timelineDensities = [
  {
    id: "featured",
    label: "代表的な実績",
    description: "主な受賞や進学、節目となった活動を表示します。",
  },
  {
    id: "standard",
    label: "標準",
    description: "大会への参加や制作など、主な歩みを表示します。",
  },
  {
    id: "all",
    label: "すべて",
    description: "途中の達成や学校での活動・担当も含めて表示します。",
  },
] as const;

export function includesAtDensity(event: TimelineEvent, density: string) {
  return (
    density === "all" ||
    event.visibility === "featured" ||
    (density === "standard" && event.visibility === "standard")
  );
}

// The homepage summary shares the same records, so dates and achievements stay in sync.
export const homeTimelineEvents = [
  ...new Set(
    timelineRecords.flatMap((event) =>
      event.year === null ? [] : [event.year]
    )
  ),
]
  .sort((a, b) => a - b)
  .map((year) => {
    const events = timelineRecords.filter((event) => event.year === year);
    const featured = events.filter((event) => event.visibility === "featured");
    const choices = featured.length
      ? featured
      : events.filter((event) => event.visibility === "standard");
    return {
      year: String(year),
      items: (choices.length ? choices : events)
        .slice(0, 4)
        .reverse()
        .map((event) => event.title),
      isHighlight: featured.length > 0,
    };
  });
