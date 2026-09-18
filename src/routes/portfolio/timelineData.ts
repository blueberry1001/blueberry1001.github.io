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
  },
  {
    id: "standard",
    label: "標準",
  },
  {
    id: "all",
    label: "すべて",
  },
] as const;

export function includesAtDensity(event: TimelineEvent, density: string) {
  return (
    density === "all" ||
    event.visibility === "featured" ||
    (density === "standard" && event.visibility === "standard")
  );
}

export const featuredTimelineRecords = timelineRecords.filter(
  (event) => event.visibility === "featured"
);
