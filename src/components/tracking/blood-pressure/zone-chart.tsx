import Svg, { Circle, Line, Rect, Text as SvgText } from "react-native-svg";

export type Zone = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  fill: string;
  lx: number;
  ly: number;
  label: string;
  lc: string;
  lines: string[];
};

const ZONES: Zone[] = [
  {
    x1: 40, x2: 100, y1: 70, y2: 190,
    fill: "#fca5a5", lx: 72, ly: 168,
    label: "High blood pressure", lc: "#991b1b",
    lines: ["High blood", "pressure"],
  },
  {
    x1: 40, x2: 90, y1: 70, y2: 140,
    fill: "#fde68a", lx: 65, ly: 128,
    label: "Pre-high blood pressure", lc: "#92400e",
    lines: ["Pre-high blood", "pressure"],
  },
  {
    x1: 40, x2: 80, y1: 70, y2: 120,
    fill: "#86efac", lx: 60, ly: 105,
    label: "Ideal blood pressure", lc: "#166534",
    lines: ["Ideal blood", "pressure"],
  },
  {
    x1: 40, x2: 60, y1: 70, y2: 90,
    fill: "#c4b5fd", lx: 50, ly: 80,
    label: "Low", lc: "#4c1d95",
    lines: ["Low"],
  },
];

const X_DOMAIN = [40, 100];
const Y_DOMAIN = [70, 190];
const X_TICKS = [40, 50, 60, 70, 80, 90, 100];
const Y_GRID = [70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190];
const Y_TICKS = [70, 90, 110, 130, 150, 170, 190];

const MARGIN = { top: 10, right: 12, bottom: 34, left: 36 };

const CROSSHAIR = "#1e293b";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function classifyZone(systolic: number, diastolic: number): Zone {
  const sys = clamp(systolic, Y_DOMAIN[0], Y_DOMAIN[1]);
  const dia = clamp(diastolic, X_DOMAIN[0], X_DOMAIN[1]);

  if (sys > 140 || dia > 90) return ZONES[0]; // High
  if (sys < 90) return ZONES[3]; // Low
  if (dia < 60) return ZONES[3]; // Low
  if (sys <= 120 && dia <= 80) return ZONES[2]; // Ideal
  return ZONES[1]; // Pre-high
}

type Props = {
  width: number;
  height: number;
  systolic?: number | null;
  diastolic?: number | null;
  axisColor?: string;
};

export default function ZoneChart({
  width,
  height,
  systolic,
  diastolic,
  axisColor = "#737373",
}: Props) {
  const plotWidth = width - MARGIN.left - MARGIN.right;
  const plotHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = (value: number) =>
    MARGIN.left + ((value - X_DOMAIN[0]) / (X_DOMAIN[1] - X_DOMAIN[0])) * plotWidth;
  const yScale = (value: number) =>
    MARGIN.top + ((Y_DOMAIN[1] - value) / (Y_DOMAIN[1] - Y_DOMAIN[0])) * plotHeight;

  const hasReading =
    systolic != null && diastolic != null && Number.isFinite(systolic) && Number.isFinite(diastolic);
  const sys = hasReading ? clamp(systolic, Y_DOMAIN[0], Y_DOMAIN[1]) : null;
  const dia = hasReading ? clamp(diastolic, X_DOMAIN[0], X_DOMAIN[1]) : null;

  return (
    <Svg width={width} height={height}>
      {ZONES.map((zone) => (
        <Rect
          key={`zone-${zone.label}`}
          x={xScale(zone.x1)}
          y={yScale(zone.y2)}
          width={xScale(zone.x2) - xScale(zone.x1)}
          height={yScale(zone.y1) - yScale(zone.y2)}
          fill={zone.fill}
        />
      ))}

      {Y_GRID.map((tick) => (
        <Line
          key={`y-grid-${tick}`}
          x1={MARGIN.left}
          x2={MARGIN.left + plotWidth}
          y1={yScale(tick)}
          y2={yScale(tick)}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={1}
        />
      ))}
      {X_TICKS.map((tick) => (
        <Line
          key={`x-grid-${tick}`}
          x1={xScale(tick)}
          x2={xScale(tick)}
          y1={MARGIN.top}
          y2={MARGIN.top + plotHeight}
          stroke="rgba(0,0,0,0.12)"
          strokeWidth={1}
        />
      ))}

      {ZONES.map((zone) =>
        zone.lines.map((line, index) => (
          <SvgText
            key={`label-${zone.label}-${line}`}
            x={xScale(zone.lx)}
            // Center the block of lines on ly, then step down by line height.
            y={yScale(zone.ly) - ((zone.lines.length - 1) * 11) / 2 + index * 11 + 3.5}
            fill={zone.lc}
            fontSize={10}
            fontWeight="700"
            textAnchor="middle"
          >
            {line}
          </SvgText>
        ))
      )}

      {Y_TICKS.map((tick) => (
        <SvgText
          key={`y-tick-${tick}`}
          x={MARGIN.left - 6}
          y={yScale(tick) + 3.5}
          fill={axisColor}
          fontSize={9}
          textAnchor="end"
        >
          {String(tick)}
        </SvgText>
      ))}
      {X_TICKS.map((tick) => (
        <SvgText
          key={`x-tick-${tick}`}
          x={xScale(tick)}
          y={MARGIN.top + plotHeight + 13}
          fill={axisColor}
          fontSize={9}
          textAnchor="middle"
        >
          {String(tick)}
        </SvgText>
      ))}

      <SvgText
        x={MARGIN.left + plotWidth / 2}
        y={height - 4}
        fill={axisColor}
        fontSize={9}
        textAnchor="middle"
      >
        Diastolic (mmHg) →
      </SvgText>
      <SvgText
        x={10}
        y={MARGIN.top + plotHeight / 2}
        fill={axisColor}
        fontSize={9}
        textAnchor="middle"
        transform={`rotate(-90, 10, ${MARGIN.top + plotHeight / 2})`}
      >
        ↑ Systolic (mmHg)
      </SvgText>

      {sys != null && dia != null && (
        <>
          <Line
            x1={xScale(dia)}
            x2={xScale(dia)}
            y1={MARGIN.top}
            y2={MARGIN.top + plotHeight}
            stroke={CROSSHAIR}
            strokeWidth={1.5}
            strokeDasharray="4,3"
            strokeOpacity={0.6}
          />
          <Line
            x1={MARGIN.left}
            x2={MARGIN.left + plotWidth}
            y1={yScale(sys)}
            y2={yScale(sys)}
            stroke={CROSSHAIR}
            strokeWidth={1.5}
            strokeDasharray="4,3"
            strokeOpacity={0.6}
          />
          <Circle
            cx={xScale(dia)}
            cy={yScale(sys)}
            r={6}
            fill="white"
            stroke={CROSSHAIR}
            strokeWidth={2.5}
          />
        </>
      )}
    </Svg>
  );
}
