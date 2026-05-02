export type RatingHistoryPoint = {
  contestId: string;
  contestName: string;
  endTime: string;
  timestamp: number;
  oldRating: number;
  newRating: number;
};

export type CacheSource = "memory" | "localStorage" | "network";

export type UserRatingHistoryResult = {
  user: string;
  history: RatingHistoryPoint[];
  fetchedAt: number;
  source: CacheSource;
};

type CacheEntry = {
  fetchedAt: number;
  history: RatingHistoryPoint[];
};

type AtCoderApiHistoryItem = {
  contestName?: string;
  contestScreenName?: string;
  endTime?: string;
  oldRating?: number;
  newRating?: number;
  ContestName?: string;
  ContestScreenName?: string;
  EndTime?: string;
  OldRating?: number;
  NewRating?: number;
};

const CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const STORAGE_KEY = "atcoder-rating-history-cache-v1";

const memoryCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<UserRatingHistoryResult>>();

const normalizeUserName = (user: string) => user.trim().toLowerCase();

const parseHistoryItem = (item: AtCoderApiHistoryItem): RatingHistoryPoint | null => {
  const contestId = item.contestScreenName ?? item.ContestScreenName;
  const contestName = item.contestName ?? item.ContestName;
  const endTime = item.endTime ?? item.EndTime;
  const oldRating = item.oldRating ?? item.OldRating;
  const newRating = item.newRating ?? item.NewRating;

  if (!contestId || !contestName || !endTime) return null;
  if (typeof oldRating !== "number" || typeof newRating !== "number") return null;

  const timestamp = new Date(endTime).getTime();
  if (Number.isNaN(timestamp)) return null;

  return {
    contestId,
    contestName,
    endTime,
    timestamp,
    oldRating,
    newRating,
  };
};

const isFresh = (fetchedAt: number) => Date.now() - fetchedAt < CACHE_TTL_MS;

const readLocalStorageCache = (): Record<string, CacheEntry> => {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as Record<string, CacheEntry>;
    return parsed ?? {};
  } catch (error) {
    console.error("Failed to parse AtCoder cache from localStorage.", error);
    return {};
  }
};

const writeLocalStorageCache = (cache: Record<string, CacheEntry>) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Failed to write AtCoder cache to localStorage.", error);
  }
};

const fetchHistoryFromNetwork = async (user: string): Promise<RatingHistoryPoint[]> => {
  const url = `https://atcoder-api.kenkoooo.com/atcoder-api/v3/user/rating?user=${encodeURIComponent(
    user
  )}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `AtCoder API request failed (status: ${response.status}) for user "${user}".`
    );
  }

  const json = (await response.json()) as AtCoderApiHistoryItem[];
  if (!Array.isArray(json)) {
    throw new Error(`Unexpected AtCoder API response for user "${user}".`);
  }

  const history = json
    .map((item) => parseHistoryItem(item))
    .filter((item): item is RatingHistoryPoint => item !== null)
    .sort((a, b) => a.timestamp - b.timestamp);

  if (history.length === 0) {
    throw new Error(
      `ユーザー "${user}" の履歴を取得できませんでした。ユーザー名を確認してください。`
    );
  }

  return history;
};

export const getUserRatingHistory = async (userName: string): Promise<UserRatingHistoryResult> => {
  const normalized = normalizeUserName(userName);
  if (!normalized) throw new Error("ユーザー名を入力してください。");

  const fromMemory = memoryCache.get(normalized);
  if (fromMemory && isFresh(fromMemory.fetchedAt)) {
    return {
      user: normalized,
      history: fromMemory.history,
      fetchedAt: fromMemory.fetchedAt,
      source: "memory",
    };
  }

  const localStorageCache = readLocalStorageCache();
  const fromLocalStorage = localStorageCache[normalized];
  if (fromLocalStorage && isFresh(fromLocalStorage.fetchedAt)) {
    memoryCache.set(normalized, fromLocalStorage);
    return {
      user: normalized,
      history: fromLocalStorage.history,
      fetchedAt: fromLocalStorage.fetchedAt,
      source: "localStorage",
    };
  }

  const inFlightPromise = inFlight.get(normalized);
  if (inFlightPromise) return inFlightPromise;

  const request = (async () => {
    const history = await fetchHistoryFromNetwork(normalized);
    const entry: CacheEntry = { history, fetchedAt: Date.now() };
    memoryCache.set(normalized, entry);
    localStorageCache[normalized] = entry;
    writeLocalStorageCache(localStorageCache);

    return {
      user: normalized,
      history,
      fetchedAt: entry.fetchedAt,
      source: "network" as const,
    };
  })();

  inFlight.set(normalized, request);
  try {
    return await request;
  } finally {
    inFlight.delete(normalized);
  }
};

