import type { CSSProperties } from "react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { TECH_STACK_FLOAT_URLS } from "../data/techStackFloatUrls";
import { computeIconLayouts } from "../utils/iconLayout";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Root-relative `/public` paths must respect Vite `base` (e.g. GitHub Pages /repo/). */
function resolveIconSrc(src: string): string {
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/")) {
    return `${import.meta.env.BASE_URL}${src.slice(1)}`;
  }
  return src;
}

function splitMotionStyle(style: CSSProperties): {
  anchor: CSSProperties;
  drift: CSSProperties;
} {
  const s = style as CSSProperties & Record<string, string | number | undefined>;
  const {
    ["--drift-dur"]: driftDur,
    ["--drift-delay"]: driftDelay,
    ["--star-delay"]: starDelay,
    ...rest
  } = s;
  return {
    anchor: {
      ...rest,
      transform: "translate(-50%, -50%)",
      "--star-delay": starDelay,
    } as CSSProperties,
    drift: {
      "--drift-dur": driftDur,
      "--drift-delay": driftDelay,
      width: "100%",
      height: "100%",
    } as CSSProperties,
  };
}

/** Staggered delays (seconds) so icons pop like stars—not raster order, not all at once */
function starDelaySeconds(i: number, total: number, w: number): number {
  const spread = 4.2;
  const base = ((i * 9973 + Math.floor(w) + i * 17) % 1000) / 1000;
  const wave = i * (spread / Math.max(total, 1));
  return Math.min(spread - 0.05, base * 0.55 + wave * 0.65);
}

type FloatingIconsProps = {
  /** After name animation; each icon twinkles in (staggered), not a layer fade */
  visible: boolean;
};

export function FloatingIcons({ visible }: FloatingIconsProps) {
  const reduced = usePrefersReducedMotion();
  const backdropRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = backdropRef.current;
    if (!el) return;

    const read = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };

    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const items = useMemo(() => {
    if (!size || !visible) return [];
    const layouts = computeIconLayouts(
      size.w,
      size.h,
      TECH_STACK_FLOAT_URLS.length,
    );
    const total = TECH_STACK_FLOAT_URLS.length;
    return TECH_STACK_FLOAT_URLS.map((src, i) => {
      const L = layouts[i];
      if (!L) return null;
      const durS = 36 + (i % 13) * 2;
      const delayS = -((i * 0.71) % 7);
      const starDelayS = reduced ? 0 : starDelaySeconds(i, total, size.w);
      return {
        src,
        style: {
          top: `${L.topPct}%`,
          left: `${L.leftPct}%`,
          width: L.sizePx,
          height: L.sizePx,
          "--drift-dur": `${durS}s`,
          "--drift-delay": `${delayS}s`,
          "--star-delay": `${starDelayS}s`,
        } as CSSProperties,
      };
    }).filter(Boolean) as { src: string; style: CSSProperties }[];
  }, [size, visible, reduced]);

  return (
    <div
      ref={backdropRef}
      className={[
        "hero__backdrop",
        visible ? "hero__backdrop--visible" : "",
        reduced ? "hero__backdrop--static" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden
    >
      {items.map(({ src, style }, i) => {
        const { anchor, drift } = splitMotionStyle(style);
        return (
          <div
            key={`${src}-${i}`}
            className={[
              "hero__icon-anchor",
              reduced ? "hero__icon-anchor--no-motion" : "hero__icon-anchor--star",
            ]
              .filter(Boolean)
              .join(" ")}
            style={anchor}
          >
            <div className="hero__icon-drift" style={drift}>
              <span className="hero__icon-wiggle">
                <img
                  className="hero__icon-img"
                  src={resolveIconSrc(src)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
