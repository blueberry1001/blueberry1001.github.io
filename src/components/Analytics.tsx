import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const measurementId = "G-6NFBCLHFK6";
const productionHost = "blueberry1001.github.io";
type AnalyticsWindow = Window & {
  dataLayer?: IArguments[];
  gtag?: (...args: unknown[]) => void;
};
let initialized = false;
let previousPath: string | undefined;
let previousLocation: string | undefined;

export function trackPageView(pathname: string) {
  if (!import.meta.env.PROD || window.location.hostname !== productionHost) return;
  // The root redirects to /home. Query-only changes are filters, not new pages.
  if (pathname === "/" || pathname === previousPath) return;
  const analyticsWindow = window as AnalyticsWindow;
  if (!initialized) {
    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    analyticsWindow.gtag = function () {
      analyticsWindow.dataLayer!.push(arguments);
    };
    analyticsWindow.gtag("js", new Date());
    analyticsWindow.gtag("config", measurementId, { send_page_view: false });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
    initialized = true;
  }
  // Virtual paths make hash routes distinguishable in GA's Pages report.
  const pageLocation = `${window.location.origin}${pathname}${window.location.search}`;
  analyticsWindow.gtag!("event", "page_view", {
    send_to: measurementId,
    page_location: pageLocation,
    page_title: pathname === "/home" ? "Blueberry's site" : `${pathname} | Blueberry`,
    page_referrer: previousLocation ?? document.referrer,
  });
  previousPath = pathname;
  previousLocation = pageLocation;
}

export default function Analytics() {
  const { pathname } = useLocation();
  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);
  return null;
}
