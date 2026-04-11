import { useEffect, useRef, type RefObject } from "react";

/**
 * Observes a sentinel inside a scrollable region. When `rootRef` is set, it must be the
 * same element that scrolls (overflow auto/scroll). Using the viewport as root breaks
 * infinite scroll inside nested overflow containers (e.g. dropdown + inner list).
 */
export const useInfiniteScroll = (
  callback: () => void,
  enabled: boolean,
  rootRef: RefObject<Element | null>
) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const target = sentinelRef.current;
    const root = rootRef.current;
    if (!target || !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callback();
        }
      },
      {
        root,
        rootMargin: "0px 0px 80px 0px",
        threshold: 0,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [callback, enabled, rootRef]);

  return sentinelRef;
};