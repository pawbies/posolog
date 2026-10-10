import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { Circle, DashPathEffect, Line as SkiaLine, matchFont, vec } from "@shopify/react-native-skia";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import { mix } from "@/lib/color";
import { Activity } from "lucide-react-native";
import { Platform, View } from "react-native";
import { runOnJS, useAnimatedReaction, useDerivedValue, type SharedValue } from "react-native-reanimated";
import { CartesianChart, Line, Scatter, useChartPressState, type ChartBounds } from "victory-native";

// Sample data: a prodrug and its active metabolite, both from one dose 3h ago.
const INGREDIENTS = [
  { key: "lisdexamfetamine",  label: "Lisdexamfetamine",  unit: "ng/mL", cmax: 45, dosedHoursAgo: 3, ka: 2.0, ke: 0.8,   dashed: false },
  { key: "dextroamphetamine", label: "Dextroamphetamine", unit: "ng/mL", cmax: 80, dosedHoursAgo: 3, ka: 0.6, ke: 0.069, dashed: true },
] as const;

type Key = (typeof INGREDIENTS)[number]["key"];

const KEYS = INGREDIENTS.map((i) => i.key) as unknown as Key[];

const X_MIN = -12;
const X_MAX = 12;
const STEP = 0.25;

type Point = { x: number } & Record<Key, number | null>;

function curve(ka: number, ke: number) {
  const tMax = Math.log(ka / ke) / (ka - ke);
  const peak = Math.exp(-ke * tMax) - Math.exp(-ka * tMax);
  return {
    tMax,
    at: (t: number) => (t < 0 ? null : ((Math.exp(-ke * t) - Math.exp(-ka * t)) / peak) * 100),
  };
}

type ChartProps = {
  color: string;
}

export default function Chart({ color }: ChartProps) {
  const colorScheme = useColorScheme().colorScheme;
  const dark = colorScheme === "dark";
  const fg = dark ? "#fafafa" : "#171717";

  // Chrome stays neutral (matches bg-surface cards); only the data carries the
  // medication colour.
  const surface   = dark ? "#1a1a1e" : "#f5f5f7";
  const grid      = dark ? "#2d2d34" : "#e1e1e6";
  const muted     = dark ? "#52525b" : "#a1a1aa";
  const axisLabel = dark ? "#9696a0" : "#71717a";
  // Primary series uses the medication colour as-is; the secondary one is the
  // same hue pushed toward the text colour (darker in light mode, lighter in
  // dark mode) and drawn dashed so the two stay distinguishable.
  const colors = useMemo(
    () => Object.fromEntries(
      INGREDIENTS.map((i, index) => [i.key, index === 0 ? color : mix(color, fg, 0.4)]),
    ) as Record<Key, string>,
    [color, fg],
  );

  const font = useMemo(
    () => matchFont({
      fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }),
      fontSize: 11,
      fontWeight: "500",
    }),
    [],
  );

  const [hidden, setHidden] = useState<Set<Key>>(() => new Set());
  const visible = (key: Key) => !hidden.has(key);
  const toggle = (key: Key) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < INGREDIENTS.length - 1) next.add(key);
      return next;
    });

  const { data, peakIndex } = useMemo(() => {
    const curves = INGREDIENTS.map((i) => ({ key: i.key, offset: i.dosedHoursAgo, ...curve(i.ka, i.ke) }));
    const points: Point[] = [];
    for (let x = X_MIN; x <= X_MAX + 1e-9; x += STEP) {
      const point = { x } as Point;

      for (const c of curves) point[c.key] = c.at(x + c.offset);
      points.push(point);
    }

    const peakIndex = Object.fromEntries(
      curves.map((c) => {
        const index = Math.round((c.tMax - c.offset - X_MIN) / STEP);
        return [c.key, index >= 0 && index < points.length ? index : null];
      }),
    ) as Record<Key, number | null>;
    return { data: points, peakIndex };
  }, []);

  const chartData = useMemo(
    () => data.map((d) => {
      const point = { x: d.x } as Point;
      for (const key of KEYS) point[key] = visible(key) ? d[key] : null;
      return point;
    }),
    [data, hidden],
  );

  const { state, isActive } = useChartPressState({
    x: 0,
    y: Object.fromEntries(KEYS.map((k) => [k, 0])) as Record<Key, number>,
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  useAnimatedReaction(
    () => (state.isActive.value ? state.matchedIndex.value : -1),
    (index, previous) => {
      if (index !== previous) runOnJS(setActiveIndex)(index >= 0 ? index : null);
    },
  );

  const nowIndex = Math.round(-X_MIN / STEP);
  const readout = data[activeIndex ?? nowIndex];
  const onNow = activeIndex == null || activeIndex === nowIndex;

  const formatOffset = (x: number) => {
    if (Math.abs(x) < 0.05) return "now";
    const rounded = Math.abs(x) < 1 ? `${Math.round(Math.abs(x) * 60)}min` : `${Math.abs(x).toFixed(Math.abs(x) % 1 ? 1 : 0)}h`;
    return x < 0 ? `${rounded} ago` : `in ${rounded}`;
  };
  const formatLevel = (value: number, unit: string) =>
    `${value >= 100 ? Math.round(value) : value.toFixed(value >= 10 ? 1 : 2)} ${unit}`;

  return (
    <View className="mt-4 w-full rounded-3xl bg-surface p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Activity size={16} color={color} />
          <Text muted className="text-xs font-semibold uppercase tracking-wider">Plasma levels</Text>
        </View>
        <Text muted className="text-xs">
          {onNow ? "Now · % of Cmax" : formatOffset(readout.x)}
        </Text>
      </View>

      <View className="mt-3 h-48">
        <CartesianChart
          data={chartData}
          xKey="x"
          yKeys={KEYS}
          domain={{ x: [X_MIN, X_MAX], y: [0, 100] }}
          domainPadding={{ top: 10 }}
          padding={{ top: 4, right: 8 }}
          frame={{ lineWidth: 0 }}
          chartPressState={state}
          xAxis={{
            font,
            tickValues: [-12, -6, 0, 6, 12],
            labelColor: axisLabel,
            lineColor: grid,
            lineWidth: 1,
            formatXLabel: (x) => (x === 0 ? "now" : `${x > 0 ? "+" : ""}${x}h`),
          }}
          yAxis={[{
            font,
            tickValues: [0, 25, 50, 75, 100],
            labelColor: axisLabel,
            lineColor: grid,
            lineWidth: 1,
            formatYLabel: (v) => `${Math.round(v ?? 0)}%`,
          }]}
        >
          {({ points, chartBounds, xScale }) => (
            <>
              <NowLine x={xScale(0)} bounds={chartBounds} color={muted} />

              {INGREDIENTS.filter((i) => visible(i.key)).map((i) => (
                <Line
                  key={i.key}
                  points={points[i.key]}
                  color={colors[i.key]}
                  strokeWidth={2}
                  strokeJoin="round"
                  strokeCap="round"
                  curveType="monotoneX"
                  animate={{ type: "timing", duration: 300 }}
                >
                  {i.dashed ? <DashPathEffect intervals={[6, 4]} /> : null}
                </Line>
              ))}

              {INGREDIENTS.filter((i) => visible(i.key) && peakIndex[i.key] != null).map((i) => (
                <Scatter
                  key={`${i.key}-cmax-ring`}
                  points={[points[i.key][peakIndex[i.key]!]]}
                  radius={5.5}
                  color={surface}
                  style="fill"
                />
              ))}
              {INGREDIENTS.filter((i) => visible(i.key) && peakIndex[i.key] != null).map((i) => (
                <Scatter
                  key={`${i.key}-cmax`}
                  points={[points[i.key][peakIndex[i.key]!]]}
                  radius={3.5}
                  color={colors[i.key]}
                  style="fill"
                />
              ))}

              {isActive && (
                <>
                  <Crosshair x={state.x.position} bounds={chartBounds} color={muted} />
                  {INGREDIENTS.filter((i) => visible(i.key)).map((i) => (
                    <ActiveDot
                      key={i.key}
                      x={state.x.position}
                      y={state.y[i.key].position}
                      color={colors[i.key]}
                      ring={surface}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </CartesianChart>
      </View>

      <View className="mt-4 gap-2 border-t border-border pt-3">
        {INGREDIENTS.map((i) => {
          const on = visible(i.key);
          const percent = readout[i.key];
          return (
            <Pressable
              key={i.key}
              onPress={() => toggle(i.key)}
              accessibilityRole="button"
              accessibilityLabel={`${on ? "Hide" : "Show"} ${i.label}`}
              hitSlop={4}
              className="flex-row items-center active:opacity-60"
            >
              {i.dashed ? (
                <View className="mr-2 w-2.5 flex-row items-center justify-between">
                  {[0, 1].map((n) => (
                    <View
                      key={n}
                      style={{ width: 4, height: 2, backgroundColor: on ? colors[i.key] : muted }}
                    />
                  ))}
                </View>
              ) : (
                <View
                  className="mr-2 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: on ? colors[i.key] : muted }}
                />
              )}
              <Text className={`text-xs ${on ? "" : "line-through opacity-50"}`}>{i.label}</Text>
              <View className="flex-1" />
              {!on ? (
                <Text muted className="text-xs">Hidden</Text>
              ) : percent == null ? (
                <Text muted className="text-xs">Not taken yet</Text>
              ) : (
                <>
                  <Text className="text-xs font-medium">
                    {formatLevel((percent / 100) * i.cmax, i.unit)}
                  </Text>
                  <Text muted className="ml-1.5 text-xs">{Math.round(percent)}%</Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function NowLine({ x, bounds, color }: { x: number; bounds: ChartBounds; color: string }) {
  return (
    <SkiaLine
      p1={vec(x, bounds.top)}
      p2={vec(x, bounds.bottom)}
      color={color}
      strokeWidth={1}
      opacity={0.5}
    >
      <DashPathEffect intervals={[2, 4]} />
    </SkiaLine>
  );
}

function Crosshair({ x, bounds, color }: { x: SharedValue<number>; bounds: ChartBounds; color: string }) {
  const top = useDerivedValue(() => vec(x.value, bounds.top));
  const bottom = useDerivedValue(() => vec(x.value, bounds.bottom));

  return (
    <SkiaLine p1={top} p2={bottom} color={color} strokeWidth={1}>
      <DashPathEffect intervals={[4, 3]} />
    </SkiaLine>
  );
}

function ActiveDot({ x, y, color, ring }: {
  x: SharedValue<number>;
  y: SharedValue<number>;
  color: string;
  ring: string;
}) {
  return (
    <>
      <Circle cx={x} cy={y} r={6} color={ring} />
      <Circle cx={x} cy={y} r={4} color={color} />
    </>
  );
}
