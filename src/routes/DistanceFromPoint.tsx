import { useCallback, useEffect, useMemo, useState } from "react";

type Coordinates = {
  lat: number;
  lng: number;
};

const DEFAULT_TARGET: Coordinates = {
  lat: 35.7289263,
  lng: 139.71038,
};

const formatCoordinates = ({ lat, lng }: Coordinates) =>
  `${lat.toFixed(7)}, ${lng.toFixed(7)}`;

const parseCoordinates = (input: string): Coordinates | null => {
  const text = input.trim();
  if (!text) return null;

  const plainMatch = text.match(
    /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)(?:\s|$)/
  );
  if (plainMatch) {
    const lat = Number(plainMatch[1]);
    const lng = Number(plainMatch[2]);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  }

  const atMatch = text.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (atMatch) {
    return { lat: Number(atMatch[1]), lng: Number(atMatch[2]) };
  }

  const googleDataMatch = text.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/);
  if (googleDataMatch) {
    return { lat: Number(googleDataMatch[1]), lng: Number(googleDataMatch[2]) };
  }

  return null;
};

const getGeolocationErrorMessage = (error: GeolocationPositionError) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "位置情報の利用が許可されていません。ブラウザ設定で許可してください。";
    case error.POSITION_UNAVAILABLE:
      return "現在地を取得できませんでした。端末の位置情報設定をご確認ください。";
    case error.TIMEOUT:
      return "位置情報の取得がタイムアウトしました。時間をおいて再度お試しください。";
    default:
      return "現在地の取得中にエラーが発生しました。";
  }
};

const toRadians = (degree: number) => (degree * Math.PI) / 180;

const haversineDistanceInMeters = (from: Coordinates, to: Coordinates) => {
  const earthRadius = 6371000;
  const latDiff = toRadians(to.lat - from.lat);
  const lngDiff = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(latDiff / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lngDiff / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

const DistanceFromPointPage = () => {
  const [targetInput, setTargetInput] = useState(formatCoordinates(DEFAULT_TARGET));
  const [target, setTarget] = useState<Coordinates>(DEFAULT_TARGET);
  const [targetError, setTargetError] = useState("");

  const [current, setCurrent] = useState<Coordinates | null>(null);
  const [currentError, setCurrentError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoModeEnabled, setAutoModeEnabled] = useState(false);

  const distance = useMemo(() => {
    if (!current) return null;
    return Math.round(haversineDistanceInMeters(current, target));
  }, [current, target]);

  const applyTargetInput = () => {
    const parsed = parseCoordinates(targetInput);
    if (!parsed) {
      setTargetError(
        "座標の形式を認識できませんでした。例: 35.7289263,139.71038 または Google Maps のURL"
      );
      return;
    }

    if (parsed.lat < -90 || parsed.lat > 90 || parsed.lng < -180 || parsed.lng > 180) {
      setTargetError("緯度は-90〜90、経度は-180〜180の範囲で入力してください。");
      return;
    }

    setTarget(parsed);
    setTargetError("");
  };

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setCurrentError("このブラウザは位置情報取得に対応していません。");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrent({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setCurrentError("");
        setLastUpdated(new Date());
      },
      (error) => {
        setCurrentError(getGeolocationErrorMessage(error));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    if (!autoModeEnabled) return;

    getCurrentLocation();
    const intervalId = window.setInterval(() => {
      getCurrentLocation();
    }, 60000);
    return () => window.clearInterval(intervalId);
  }, [autoModeEnabled, getCurrentLocation]);

  return (
    <section className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-3 text-3xl font-black text-slate-900">地点までの距離メーター</h1>
        <p className="mb-8 text-slate-600">
          現在地から指定した地点までの直線距離をメートルで表示します。
        </p>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="mb-3 text-lg font-bold text-slate-900">目標地点の設定</h2>
          <p className="mb-3 text-sm text-slate-600">
            Google Mapsからコピーした座標やURLを貼り付けできます。
          </p>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              onChange={(event) => setTargetInput(event.target.value)}
              placeholder="例: 35.7289263,139.71038"
              type="text"
              value={targetInput}
            />
            <button
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              onClick={applyTargetInput}
              type="button"
            >
              目標地点を反映
            </button>
          </div>
          {targetError ? <p className="mt-3 text-sm text-red-600">{targetError}</p> : null}
          <p className="mt-3 text-sm text-slate-700">
            目標地点: <span className="font-semibold">{formatCoordinates(target)}</span>
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h2 className="mb-3 text-lg font-bold text-slate-900">現在地の取得</h2>
          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
              onClick={getCurrentLocation}
              type="button"
            >
              現在地を1回取得
            </button>
            <button
              className={`rounded-xl px-5 py-3 font-semibold text-white transition ${
                autoModeEnabled
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-slate-800 hover:bg-slate-900"
              }`}
              onClick={() => setAutoModeEnabled((prev) => !prev)}
              type="button"
            >
              {autoModeEnabled ? "自動更新を停止" : "自動更新を開始（1分ごと）"}
            </button>
          </div>
          <p className="mt-3 text-sm text-slate-700">
            自動更新:{" "}
            <span className="font-semibold">{autoModeEnabled ? "有効" : "無効"}</span>
          </p>
          {currentError ? <p className="mt-3 text-sm text-red-600">{currentError}</p> : null}
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="mb-3 text-lg font-bold text-blue-900">測定結果</h2>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              目標地点座標: <span className="font-semibold">{formatCoordinates(target)}</span>
            </p>
            <p>
              現在地座標:{" "}
              <span className="font-semibold">
                {current ? formatCoordinates(current) : "未取得"}
              </span>
            </p>
            <p>
              最終更新:{" "}
              <span className="font-semibold">
                {lastUpdated ? lastUpdated.toLocaleString("ja-JP") : "未更新"}
              </span>
            </p>
            <p className="pt-2 text-base text-slate-900">
              距離:{" "}
              <span className="text-xl font-black text-blue-700">
                {distance !== null ? `${distance.toLocaleString("ja-JP")} m` : "現在地取得後に表示"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistanceFromPointPage;
