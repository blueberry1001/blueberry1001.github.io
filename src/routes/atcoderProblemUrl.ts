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
  const separator = problem.lastIndexOf("_");
  if (separator <= 0 || separator === problem.length - 1) {
    throw new Error("問題IDからコンテスト名を取得できませんでした。");
  }
  const contest = problem.slice(0, separator).replace(/_/g, "-");
  const result = new URL(
    `https://atcoder.jp/contests/${contest}/tasks/${problem}`
  );
  const language = url.searchParams.get("lang");
  if (language === "ja" || language === "en")
    result.searchParams.set("lang", language);
  return result.href;
}
