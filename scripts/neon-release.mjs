import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const target = path.join(root, "src/data/neon-reclaimer/releases.json");
const args = process.argv.slice(2);
const existing = JSON.parse(fs.readFileSync(target, "utf8"));
const entryIndex = args.indexOf("--entry");
const entry =
  entryIndex < 0
    ? null
    : JSON.parse(
        fs.readFileSync(args[entryIndex + 1], "utf8").replace(/^\uFEFF/, "")
      );
const allowed = new Set(["id", "date", "title", "summary", "sections"]);
function validateRelease(release) {
  if (/置き換える|TODO/.test(JSON.stringify(release))) throw Error("Replace template placeholders before adding a release");
  if (Object.keys(release).some((key) => !allowed.has(key)))
    throw Error(`Unexpected release field: ${release.id}`);
  if (!/^\d{4}-\d{2}-\d{2}(?:-[a-z0-9]+)*$/.test(release.id))
    throw Error("Invalid release id");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(release.date) ||
    !Number.isFinite(Date.parse(release.date)) ||
    new Date(release.date).toISOString().slice(0, 10) !== release.date
  )
    throw Error("Invalid release date");
  if (!release.id.startsWith(release.date))
    throw Error("Release id must start with release date");
  for (const key of ["title", "summary"])
    if (typeof release[key] !== "string" || !release[key].trim())
      throw Error(`Missing ${key}`);
  if (!Array.isArray(release.sections) || !release.sections.length)
    throw Error("Missing sections");
  for (const section of release.sections) {
    if (
      typeof section.title !== "string" ||
      !section.title.trim() ||
      !Array.isArray(section.items) ||
      !section.items.length ||
      section.items.some((item) => typeof item !== "string" || !item.trim())
    )
      throw Error("Invalid section");
  }
  if (
    /<\/?[a-z]|password|パスワード|C:\\Users|github\.com\/blueberry1001\/3DInc/i.test(
      JSON.stringify(release)
    )
  )
    throw Error("Release contains markup or development-only information");
}
try {
  existing.forEach(validateRelease);
  let next = existing;
  if (entry) {
    validateRelease(entry);
    if (existing.some((release) => release.id === entry.id))
      throw Error(
        "This id already exists. Edit the existing release directly after checking its content."
      );
    next = [entry, ...existing].sort(
      (a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)
    );
  }
  if (
    !next.length ||
    new Set(next.map((release) => release.id)).size !== next.length
  )
    throw Error("Empty history or duplicate release id");
  if (
    next.some(
      (release, index) => index > 0 && release.date > next[index - 1].date
    )
  )
    throw Error("Releases must be newest first");
  if (args.includes("--write")) {
    if (!entry || args.includes("--check"))
      throw Error("Use --entry FILE --write to add one release");
    fs.writeFileSync(target, `${JSON.stringify(next, null, 2)}\n`);
    console.log(
      `Added ${entry.id}. Review the diff, run lint/build, then deploy the site.`
    );
  } else
    console.log(
      `Validated ${next.length} releases.${entry ? " Dry run: no files changed. Add --write to save." : ""}`
    );
} catch (error) {
  console.error(`Release validation failed: ${error.message}`);
  process.exitCode = 1;
}
