import { area, curveMonotoneX, line } from "d3-shape";
import type { ChartPoint } from "./layout";

const hasValue = (p: ChartPoint) => p.y != null;

export function linePath(points: ChartPoint[], connectMissing = false) {
  const generator = line<ChartPoint>()
    .x((p) => p.x)
    .y((p) => p.y ?? 0)
    .curve(curveMonotoneX);
  const path = connectMissing
    ? generator(points.filter(hasValue))
    : generator.defined(hasValue)(points);
  return path ?? "";
}

export function areaPath(points: ChartPoint[], y0: number) {
  return (
    area<ChartPoint>()
      .defined(hasValue)
      .x((p) => p.x)
      .y0(y0)
      .y1((p) => p.y ?? y0)
      .curve(curveMonotoneX)(points) ?? ""
  );
}

type BandRow = { x: number; top: number | null; bottom: number | null };

export function bandPath(upper: ChartPoint[], lower: ChartPoint[]) {
  const rows: BandRow[] = upper.map((p, i) => ({ x: p.x, top: p.y, bottom: lower[i]?.y ?? null }));
  return (
    area<BandRow>()
      .defined((r) => r.top != null && r.bottom != null)
      .x((r) => r.x)
      .y0((r) => r.bottom ?? 0)
      .y1((r) => r.top ?? 0)
      .curve(curveMonotoneX)(rows) ?? ""
  );
}

export function dotsPath(points: ChartPoint[], r: number) {
  let d = "";
  for (const { x, y } of points) {
    if (y == null) continue;
    d += `M${x - r},${y}a${r},${r} 0 1,0 ${2 * r},0a${r},${r} 0 1,0 ${-2 * r},0Z`;
  }
  return d;
}
