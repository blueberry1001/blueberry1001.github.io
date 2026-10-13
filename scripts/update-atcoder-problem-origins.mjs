import { writeFile } from "node:fs/promises";

const base = "https://kenkoooo.com/atcoder/resources";
const [contests, pairs] = await Promise.all(
  ["contests.json", "contest-problem.json"].map(async (file) => {
    const response = await fetch(`${base}/${file}`);
    if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
    return response.json();
  })
);
const starts = new Map(
  contests.map((contest) => [contest.id, contest.start_epoch_second])
);
const origins = new Map();
for (const { problem_id: problem, contest_id: contest } of pairs) {
  if (!/^[a-zA-Z0-9_-]+$/.test(problem) || !/^[a-zA-Z0-9_-]+$/.test(contest))
    continue;
  // Prefer the contest named in the ID when it actually contains this task.
  // Otherwise use the earliest recorded appearance, excluding daily training.
  if (/^adt_/.test(contest)) continue;
  const previous = origins.get(problem);
  const prefix = problem.slice(0, problem.lastIndexOf("_"));
  if (
    !previous ||
    contest === prefix ||
    (previous !== prefix &&
      (starts.get(contest) ?? Infinity) < (starts.get(previous) ?? Infinity))
  )
    origins.set(problem, contest);
}
if (origins.get("abc273_c") !== "abc273" || origins.size < 1000) {
  throw new Error(
    "Unexpected AtCoder Problems data; existing mapping was preserved."
  );
}
const data = {
  updatedAt: new Date().toISOString().slice(0, 10),
  origins: Object.fromEntries(
    [...origins].sort(([a], [b]) => a.localeCompare(b))
  ),
};
await writeFile(
  new URL("../src/data/atcoder-problem-origins.json", import.meta.url),
  JSON.stringify(data) + "\n"
);
console.log(`Saved ${origins.size} problem origins.`);
