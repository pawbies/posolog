import CartesianChart, { ActiveDot, Crosshair, GuideLine, Line, Scatter } from "@/components/chart/cartesian-chart";
import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { usePalette } from "@/hooks/use-palette";
import { useMemo, useState } from "react";
import { View } from "react-native";

const INGREDIENTS = [
  { key: "tadalafil",   label: "Tadalafil",   unit: "ng/mL", cmax: 95,  dosedHoursAgo: 3, ka: 0.55, ke: 0.0396, light: "#f0663f", dark: "#ff9677" },
  { key: "minocycline", label: "Minocycline", unit: "ng/mL", cmax: 620, dosedHoursAgo: 8, ka: 1.1,  ke: 0.0433, light: "#e09b12", dark: "#ffc34d" },
  { key: "caffeine",    label: "Caffeine",    unit: "µg/mL", cmax: 2.1, dosedHoursAgo: 12, ka: 2.4,  ke: 0.1386, light: "#3c8af3", dark: "#7db0ff" },
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
  const { isDark: dark, grid, muted, surface } = usePalette();
  const axisLabel = muted;

  const color = useMemo(
    () => Object.fromEntries(INGREDIENTS.map((i) => [i.key, dark ? i.dark : i.light])) as Record<Key, string>,
    [dark],
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
      for (const key of KEYS) point[key] = hidden.has(key) ? null : d[key];
      return point;
    }),
    [data, hidden],
  );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
    <Card className="w-full">
      <View className="flex-row items-baseline justify-between">
        <Heading size="sm">Plasma levels</Heading>
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
          xAxis={{
            tickValues: [-12, -6, 0, 6, 12],
            format: (x) => (x === 0 ? "now" : `${x > 0 ? "+" : ""}${x}h`),
          }}
          yAxis={{
            tickValues: [0, 25, 50, 75, 100],
            format: (v) => `${Math.round(v)}%`,
          }}
          gridColor={grid}
          labelColor={axisLabel}
          onActiveIndexChange={setActiveIndex}
        >
          {({ points, chartBounds, xScale, press }) => (
            <>
              <GuideLine x={xScale(0)} bounds={chartBounds} color={muted} dash={[2, 4]} opacity={0.5} />

              {INGREDIENTS.filter((i) => visible(i.key)).map((i) => (
                <Line
                  key={i.key}
                  points={points[i.key]}
                  color={color[i.key]}
                  strokeWidth={2.5}
                />
              ))}

              {INGREDIENTS.filter((i) => visible(i.key) && peakIndex[i.key] != null).map((i) => (
                <Scatter
                  key={`${i.key}-cmax-ring`}
                  points={[points[i.key][peakIndex[i.key]!]]}
                  radius={5.5}
                  color={surface}
                />
              ))}
              {INGREDIENTS.filter((i) => visible(i.key) && peakIndex[i.key] != null).map((i) => (
                <Scatter
                  key={`${i.key}-cmax`}
                  points={[points[i.key][peakIndex[i.key]!]]}
                  radius={3.5}
                  color={color[i.key]}
                />
              ))}

              <Crosshair press={press} bounds={chartBounds} color={muted} />
              {INGREDIENTS.filter((i) => visible(i.key)).map((i) => (
                <ActiveDot
                  key={i.key}
                  press={press}
                  points={points[i.key]}
                  color={color[i.key]}
                  ring={surface}
                />
              ))}
            </>
          )}
        </CartesianChart>
      </View>

      <View className="mt-4 gap-2.5 border-t-2 border-border pt-4">
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
                className="mr-2.5 h-3 w-3 rounded-full"
                style={{ backgroundColor: on ? color[i.key] : muted }}
              />
              <Text className={`text-sm font-medium ${on ? "" : "line-through opacity-50"}`}>{i.label}</Text>
              <View className="flex-1" />
              {!on ? (
                <Text muted className="text-xs">Hidden</Text>
              ) : percent == null ? (
                <Text muted className="text-xs">Not taken yet</Text>
              ) : (
                <>
                  <Text className="text-sm font-semibold">
                    {formatLevel((percent / 100) * i.cmax, i.unit)}
                  </Text>
                  <Text muted className="ml-1.5 text-xs">{Math.round(percent)}%</Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
