export type Bounds = { left: number; right: number; top: number; bottom: number };
export type Sides = Partial<Bounds>;
export type Domain = [number, number];

export type ChartPoint = { x: number; y: number | null };

export type Scale = (value: number) => number;

export type AxisOptions = {
  tickValues?: number[];
  tickCount?: number;
  format?: (value: number) => string;
};

export type Tick = {
  value: number;
  position: number;
  label: string;
  labelX: number;
  labelY: number;
  anchor: "start" | "middle" | "end";
};

export type Layout<K extends string> = {
  bounds: Bounds;
  xScale: Scale;
  yScale: Scale;
  positions: number[];
  points: Record<K, ChartPoint[]>;
  xTicks: Tick[];
  yTicks: Tick[];
};

export const FONT_SIZE = 11;
const X_LABEL_GAP = 2;
const Y_LABEL_GAP = 4;
const X_LABEL_HEIGHT = Math.ceil(FONT_SIZE * 1.2);

export function scaleLinear([d0, d1]: Domain, [r0, r1]: Domain): Scale {
  const k = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0);
  return (value) => r0 + (value - d0) * k;
}

const E10 = Math.sqrt(50);
const E5 = Math.sqrt(10);
const E2 = Math.sqrt(2);

export function niceTicks(start: number, stop: number, count: number): number[] {
  if (!(count > 0) || !Number.isFinite(start) || !Number.isFinite(stop)) return [];
  if (start === stop) return [start];
  if (stop < start) return niceTicks(stop, start, count).reverse();

  const step = (stop - start) / count;
  const power = Math.floor(Math.log10(step));
  const error = step / 10 ** power;
  const factor = error >= E10 ? 10 : error >= E5 ? 5 : error >= E2 ? 2 : 1;

  if (power < 0) {
    const perUnit = 10 ** -power / factor;
    let i1 = Math.round(start * perUnit);
    let i2 = Math.round(stop * perUnit);
    if (i1 / perUnit < start) i1++;
    if (i2 / perUnit > stop) i2--;
    return Array.from({ length: Math.max(0, i2 - i1 + 1) }, (_, i) => (i1 + i) / perUnit);
  }
  const inc = 10 ** power * factor;
  let i1 = Math.round(start / inc);
  let i2 = Math.round(stop / inc);
  if (i1 * inc < start) i1++;
  if (i2 * inc > stop) i2--;
  return Array.from({ length: Math.max(0, i2 - i1 + 1) }, (_, i) => (i1 + i) * inc);
}

const EM_WIDTHS: Record<string, number> = {
  "%": 0.89, ".": 0.28, ",": 0.28, ":": 0.28, " ": 0.28, "/": 0.28, "-": 0.33, "+": 0.58,
};

export function estimateTextWidth(text: string, fontSize: number) {
  let em = 0;
  for (const ch of text) {
    em += EM_WIDTHS[ch]
      ?? (/\d/.test(ch) ? 0.56 : /[A-Z]/.test(ch) ? 0.68 : /[mw]/.test(ch) ? 0.83 : /[fijlt]/.test(ch) ? 0.3 : 0.56);
  }
  return Math.ceil(em * fontSize * 1.05);
}

export function closestIndex(positions: number[], x: number) {
  "worklet";
  const n = positions.length;
  if (n === 0) return -1;
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (positions[mid] < x) lo = mid;
    else hi = mid;
  }
  return Math.abs(positions[lo] - x) <= Math.abs(positions[hi] - x) ? lo : hi;
}

const toNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

function extent(values: number[]): Domain {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return min <= max ? [min, max] : [0, 1];
}

const spread = ([a, b]: Domain): Domain => (a === b ? [a - 1, b + 1] : [a, b]);

export type LayoutInput<T extends Record<string, unknown>, K extends keyof T & string> = {
  width: number;
  height: number;
  data: T[];
  xKey: keyof T & string;
  yKeys: readonly K[];
  domain?: { x?: Domain; y?: Domain };
  padding?: Sides;
  domainPadding?: Sides;
  xAxis?: AxisOptions;
  yAxis?: AxisOptions;
};

export function computeLayout<T extends Record<string, unknown>, K extends keyof T & string>({
  width,
  height,
  data,
  xKey,
  yKeys,
  domain,
  padding = {},
  domainPadding = {},
  xAxis = {},
  yAxis = {},
}: LayoutInput<T, K>): Layout<K> {
  const xs = data.map((d) => toNumber(d[xKey]) ?? NaN);
  const ys: number[] = [];
  for (const d of data) {
    for (const key of yKeys) {
      const v = toNumber(d[key]);
      if (v != null) ys.push(v);
    }
  }

  const xDomain = spread(domain?.x ?? extent(xs.filter(Number.isFinite)));
  const yDomain = spread(domain?.y ?? extent(ys));
  const formatX = xAxis.format ?? String;
  const formatY = yAxis.format ?? String;

  const yValues = yAxis.tickValues ?? niceTicks(yDomain[0], yDomain[1], yAxis.tickCount ?? 5);
  const yLabels = yValues.map(formatY);
  const gutter = yLabels.length
    ? Math.max(...yLabels.map((label) => estimateTextWidth(label, FONT_SIZE))) + Y_LABEL_GAP
    : 0;

  const bounds: Bounds = {
    left: (padding.left ?? 0) + gutter,
    right: width - (padding.right ?? 0),
    top: padding.top ?? 0,
    bottom: height - (padding.bottom ?? 0) - (X_LABEL_HEIGHT + 2 * X_LABEL_GAP),
  };

  const xScale = scaleLinear(xDomain, [
    bounds.left + (domainPadding.left ?? 0),
    bounds.right - (domainPadding.right ?? 0),
  ]);
  const yScale = scaleLinear(yDomain, [
    bounds.bottom - (domainPadding.bottom ?? 0),
    bounds.top + (domainPadding.top ?? 0),
  ]);

  const positions = xs.map(xScale);
  const points = {} as Record<K, ChartPoint[]>;
  for (const key of yKeys) {
    points[key] = data.map((d, i) => {
      const v = toNumber(d[key]);
      return { x: positions[i], y: v == null ? null : yScale(v) };
    });
  }

  const yTicks = yValues
    .map((value, i): Tick => {
      const position = yScale(value);
      return {
        value,
        position,
        label: yLabels[i],
        labelX: bounds.left - Y_LABEL_GAP,

        labelY: Math.max(position + FONT_SIZE / 3, FONT_SIZE * 0.8),
        anchor: "end",
      };
    })
    .filter((t) => t.position >= bounds.top - 0.5 && t.position <= bounds.bottom + 0.5);

  const labelY = bounds.bottom + X_LABEL_GAP + FONT_SIZE;
  const xTicks = (xAxis.tickValues ?? niceTicks(xDomain[0], xDomain[1], xAxis.tickCount ?? 5))
    .map((value) => ({ value, position: xScale(value) }))
    .filter((t) => t.position >= bounds.left - 0.5 && t.position <= bounds.right + 0.5)
    .map(({ value, position }): Tick => {
      const label = formatX(value);
      const half = estimateTextWidth(label, FONT_SIZE) / 2;

      if (position - half < bounds.left) {
        return { value, position, label, labelX: bounds.left, labelY, anchor: "start" };
      }
      if (position + half > bounds.right) {
        return { value, position, label, labelX: bounds.right, labelY, anchor: "end" };
      }
      return { value, position, label, labelX: position, labelY, anchor: "middle" };
    });

  return { bounds, xScale, yScale, positions, points, xTicks, yTicks };
}
