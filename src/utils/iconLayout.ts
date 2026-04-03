/**
 * Square grid over the hero: equal horizontal & vertical spacing, row-major sweep.
 * Points inside the text ellipse are skipped; we subsample evenly so icons fill the frame.
 */

export type IconLayout = {
  leftPct: number;
  topPct: number;
  sizePx: number;
};

/** Track peak combined drift + wiggle in `index.css`; taper on narrow widths */
function driftMarginPx(vmin: number): number {
  if (vmin < 380) return 18;
  if (vmin < 440) return 22;
  return 30;
}

function interIconExtraPx(vmin: number): number {
  if (vmin < 400) return 4;
  if (vmin < 480) return 7;
  return 10;
}

function inEllipse(
  px: number,
  py: number,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
): boolean {
  const dx = (px - cx) / rx;
  const dy = (py - cy) / ry;
  return dx * dx + dy * dy <= 1;
}

function hypotDist(
  a: { x: number; y: number },
  b: { x: number; y: number },
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function minPairwiseDist(pts: { x: number; y: number }[]): number {
  let min = Infinity;
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      min = Math.min(min, hypotDist(pts[i], pts[j]));
    }
  }
  return min;
}

/**
 * Evenly pick `count` indices in [0, n) without duplicates (covers full grid span).
 */
function evenSampleIndices(n: number, count: number): number[] | null {
  if (n < count) return null;
  if (count === 0) return [];
  if (count === 1) return [Math.floor(n / 2)];

  const idx: number[] = [];
  let prev = -1;
  for (let k = 0; k < count; k++) {
    let i = Math.floor((k * (n - 1)) / (count - 1));
    if (i <= prev) i = prev + 1;
    if (i >= n) return null;
    idx.push(i);
    prev = i;
  }
  return idx;
}

function squareGridLayout(
  w: number,
  h: number,
  count: number,
  iconSize: number,
): { x: number; y: number }[] | null {
  const cx = w / 2;
  const cy = h / 2;
  const vmin = Math.min(w, h);
  const pad = iconSize / 2 + 4;
  const driftPx = driftMarginPx(vmin);
  const sepMul = vmin < 420 ? 1.22 : 1.28;
  const minSep = iconSize * sepMul + interIconExtraPx(vmin) + driftPx;

  const exRx = vmin * 0.38;
  const exRy = vmin * 0.19;

  if (w < 2 * pad + minSep || h < 2 * pad + minSep) return null;

  const step = minSep;
  const candidates: { x: number; y: number }[] = [];

  for (let y = pad + step * 0.5; y <= h - pad - 0.5; y += step) {
    for (let x = pad + step * 0.5; x <= w - pad - 0.5; x += step) {
      if (inEllipse(x, y, cx, cy, exRx, exRy)) continue;
      candidates.push({ x, y });
    }
  }

  const n = candidates.length;
  const pick = evenSampleIndices(n, count);
  if (!pick) return null;

  const pts = pick.map((i) => candidates[i]);
  if (minPairwiseDist(pts) < minSep - 1) return null;

  return pts;
}

export function computeIconLayouts(
  w: number,
  h: number,
  count: number,
): IconLayout[] {
  if (count <= 0 || w < 40 || h < 40) return [];

  const vmin = Math.min(w, h);
  const preferred = Math.round(
    Math.min(44, Math.max(28, vmin * 0.05)),
  );

  for (let s = preferred; s >= 14; s -= 2) {
    const pts = squareGridLayout(w, h, count, s);
    if (pts) {
      return pts.map((p) => ({
        leftPct: (p.x / w) * 100,
        topPct: (p.y / h) * 100,
        sizePx: s,
      }));
    }
  }

  return [];
}
