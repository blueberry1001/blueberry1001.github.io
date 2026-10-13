import data from "../data/atcoder-problem-origins.json";

const origins: Readonly<Record<string, string>> = data.origins;

export function convertAtCoderProblemUrl(input: string): string {
  const trimmed = input.trim();
  let url: URL;
  try {
    url = new URL(
      /^atcoder\.jp\//i.test(trimmed) ? `https://${trimmed}` : trimmed
    );
  } catch {
    throw new Error("AtCoderの問題URLを入力してください。");
  }
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.hostname !== "atcoder.jp" ||
    url.port ||
    url.username ||
    url.password
  ) {
    throw new Error("atcoder.jpの問題URLを入力してください。");
  }
  const match = url.pathname.match(
    /^\/contests\/[a-zA-Z0-9_-]+\/tasks\/([a-zA-Z0-9_-]+)\/?$/
  );
  if (!match) throw new Error("問題ページのURLを入力してください。");
  const problem = match[1];
  const contest = Object.prototype.hasOwnProperty.call(origins, problem)
    ? origins[problem]
    : undefined;
  if (!contest) {
    throw new Error(
      "この問題は対応表に登録されていません。新しい問題は更新後に利用できます。"
    );
  }
  const result = new URL(
    `https://atcoder.jp/contests/${contest}/tasks/${problem}`
  );
  const language = url.searchParams.get("lang");
  if (language === "ja" || language === "en")
    result.searchParams.set("lang", language);
  return result.href;
}

export const problemOriginsUpdatedAt = data.updatedAt;
