import { useEffect, useRef } from "react";

import "./reveal.css";

/** Opt-in entrance motion. Content stays visible when JS or observers fail. */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  refreshKey?: string
) {
  const rootRef = useRef<T>(null);
  useEffect(() => {
    const root = rootRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!root || preference.matches || !("IntersectionObserver" in window))
      return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("reveal-entered");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 }
    );
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
      if (
        element.classList.contains("reveal-entered") ||
        element.classList.contains("reveal-visible")
      )
        return;
      const bounds = element.getBoundingClientRect();
      // Initial content paints immediately. Only offscreen content gets an entrance.
      if (bounds.top < window.innerHeight && bounds.bottom > 0) {
        element.classList.add("reveal-visible");
        return;
      }
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, [refreshKey]);
  return rootRef;
}
