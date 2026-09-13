import Pressable from "@/components/pressable";
import Text from "@/components/text";
import { Circle, DashPathEffect, Line as SkiaLine, matchFont, vec } from "@shopify/react-native-skia";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { runOnJS, useAnimatedReaction, useDerivedValue, type SharedValue } from "react-native-reanimated";
import { CartesianChart, Line, Scatter, useChartPressState, type ChartBounds } from "victory-native";

const INGREDIENTS = [
  { key: "tadalafil",   label: "Tadalafil",   unit: "ng/mL", cmax: 95,  dosedHoursAgo: 3, ka: 0.55, ke: 0.0396, light: "#f43f5e", dark: "#e11d48" },
  { key: "minocycline", label: "Minocycline", unit: "ng/mL", cmax: 620, dosedHoursAgo: 8, ka: 1.1,  ke: 0.0433, light: "#fb923c", dark: "#c98500" },
  { key: "caffeine",    label: "Caffeine",    unit: "µg/mL", cmax: 2.1, dosedHoursAgo: 12, ka: 2.4,  ke: 0.1386, light: "#6366f1", dark: "#6366f1" },
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

export default function Chart() {
  const colorScheme = useColorScheme().colorScheme;
  const dark = colorScheme === "dark";

  const grid = dark ? "#2d2d34" : "#e1e1e6";
  const axisLabel = dark ? "#9696a0" : "#71717a";
  const surface = dark ? "#1a1a1e" : "#f5f5f7";
  const muted = dark ? "#9696a0" : "#71717a";

  const color = useMemo(
    () => Object.fromEntries(INGREDIENTS.map((i) => [i.key, dark ? i.dark : i.light])) as Record<Key, string>,
    [dark],
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
    <View className="mt-3 bg-surface w-full rounded-md p-3">
      <View className="flex-row items-baseline justify-between">
        <Text className="text-sm font-medium">Plasma levels</Text>
        <Text muted className="text-xs">
          {onNow ? "Now · % of Cmax" : formatOffset(readout.x)}
        </Text>
      </View>

      <View className="mt-2 h-48">
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
                  color={color[i.key]}
                  strokeWidth={2}
                  strokeJoin="round"
                  strokeCap="round"
                  curveType="monotoneX"
                  animate={{ type: "timing", duration: 300 }}
                />
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
                  color={color[i.key]}
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
                      color={color[i.key]}
                      ring={surface}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </CartesianChart>
      </View>

      <View className="mt-3 gap-1.5">
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
              <View
                className="mr-2 h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: on ? color[i.key] : muted }}
              />
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
