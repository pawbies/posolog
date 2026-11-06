import CartesianChart, {
  ActiveDot,
  Area,
  AreaRange,
  Crosshair,
  Line,
  Scatter,
} from "@/components/chart/cartesian-chart";
import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import Text from "@/components/ui/text";
import type { BloodPressureReading } from "@/db/schema";
import { usePalette } from "@/hooks/use-palette";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";


type SeriesKey = "systolic" | "diastolic" | "pulse";

type Point = {
  t: number;
  systolic: number | null;
  diastolic: number | null;
  pulse: number | null;
};

/**
 * Palette carried over from femmed (rose / orange / indigo). Both modes are
 * validated as a categorical set — every pair clears the CVD and normal-vision
 * separation floors; the dark column is the same hues re-stepped for the dark
 * card surface rather than a flipped copy.
 */
const SERIES: {
  key: SeriesKey;
  label: string;
  light: string;
  dark: string;
  dashed: boolean;
}[] = [
  { key: "systolic", label: "Systolic", light: "#f43f5e", dark: "#e11d48", dashed: false },
  { key: "diastolic", label: "Diastolic", light: "#fb923c", dark: "#c98500", dashed: false },
  { key: "pulse", label: "Pulse", light: "#6366f1", dark: "#6366f1", dashed: true },
];

const DAY_MS = 86_400_000;

/** Past this many readings the markers shed their ring and shrink to a speck. */
const DENSE_AT = 60;

export default function Graph({ readings, loading=false }: { readings: BloodPressureReading[]; loading?: boolean }) {
  const { isDark: dark, surface, grid, muted, chevron } = usePalette();

  const theme = { surface, grid, axisLabel: muted, muted: chevron };

  const color = useMemo(
    () =>
      Object.fromEntries(SERIES.map((s) => [s.key, dark ? s.dark : s.light])) as Record<
        SeriesKey,
        string
      >,
    [dark],
  );

  const [hidden, setHidden] = useState<Set<SeriesKey>>(() => new Set());

  const visible = (key: SeriesKey) => !hidden.has(key);
  const toggle = (key: SeriesKey) =>
    setHidden((prev) => {
      const next = new Set(prev);
      // Never let the reader hide every series — the last one stays on.
      if (next.has(key)) next.delete(key);
      else if (next.size < SERIES.length - 1) next.add(key);
      return next;
    });

  const data = useMemo<Point[]>(
    () =>
      readings
        .map((r) => ({
          t: r.readingAt.getTime(),
          systolic: Math.round(r.systolic),
          diastolic: Math.round(r.diastolic),
          pulse: r.pulse == null ? null : Math.round(r.pulse),
        }))
        .filter((d) => Number.isFinite(d.t))
        .sort((a, b) => a.t - b.t),
    [readings],
  );

  // Hidden series are nulled out rather than dropped, so every series keeps one
  // point per reading and the press index lines up across toggles.
  const chartData = useMemo<Point[]>(
    () =>
      data.map((d) => ({
        t: d.t,
        systolic: hidden.has("systolic") ? null : d.systolic,
        diastolic: hidden.has("diastolic") ? null : d.diastolic,
        pulse: hidden.has("pulse") ? null : d.pulse,
      })),
    [data, hidden],
  );

  const yDomain = useMemo<[number, number]>(() => {
    const values = chartData.flatMap((d) =>
      [d.systolic, d.diastolic, d.pulse].filter((v): v is number => v != null),
    );
    if (!values.length) return [40, 160];
    return [
      Math.max(0, Math.floor((Math.min(...values) - 10) / 10) * 10),
      Math.ceil((Math.max(...values) + 10) / 10) * 10,
    ];
  }, [chartData]);

  const xDomain = useMemo<[number, number] | undefined>(() => {
    if (!data.length) return undefined;
    const first = data[0].t;
    const last = data[data.length - 1].t;
    // A single reading collapses the scale — give it half a day of breathing room.
    return first === last ? [first - DAY_MS / 2, last + DAY_MS / 2] : undefined;
  }, [data]);

  const spanDays = data.length ? (data[data.length - 1].t - data[0].t) / DAY_MS : 0;
  const formatTick = (t: number) =>
    new Date(t).toLocaleDateString(
      undefined,
      spanDays > 300
        ? { month: "short", year: "2-digit" }
        : { month: "short", day: "numeric" },
    );

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const readout =
    (activeIndex != null ? data[activeIndex] : undefined) ?? data[data.length - 1];
  // One marker per reading, always. They shrink and drop their surface ring
  // once the points get close enough together that rings would merge into mush.
  const dense = chartData.length > DENSE_AT;
  const dotRadius = dense ? 1.5 : 3;
  const ringRadius = dotRadius + 2;

  return (
    <Card>
      <Heading size="sm">Trend</Heading>

      {readout ? (
        <View className="mt-3">
          <View className="flex-row items-baseline">
            <Text className="font-display text-[44px] leading-[48px]">
              {readout.systolic}
              <Text muted>/</Text>
              {readout.diastolic}
            </Text>
            <Text muted className="ml-1.5 text-sm font-medium">
              mmHg
            </Text>
            {readout.pulse != null && (
              <Text muted className="ml-3 text-sm font-medium">
                {readout.pulse} bpm
              </Text>
            )}
          </View>
          <Text muted className="mt-0.5 text-sm">
            {activeIndex == null ? "Latest · " : ""}
            {new Date(readout.t).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </Text>
        </View>
      ) : null}

      <View className="mt-3 h-56">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={theme.axisLabel} />
          </View>
        ) : chartData.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text muted className="text-sm">
              No readings yet.
            </Text>
          </View>
        ) : (
          <CartesianChart
            data={chartData}
            xKey="t"
            yKeys={["systolic", "diastolic", "pulse"]}
            domain={{ x: xDomain, y: yDomain }}
            domainPadding={{ left: 8, right: 8, top: 8, bottom: 8 }}
            padding={{ right: 4, top: 4 }}
            xAxis={{ tickCount: 4, format: formatTick }}
            yAxis={{ tickCount: 5, format: (v) => `${Math.round(v)}` }}
            gridColor={theme.grid}
            labelColor={theme.axisLabel}
            onActiveIndexChange={setActiveIndex}
          >
            {({ points, chartBounds, press }) => (
              <>
                {visible("systolic") && visible("diastolic") ? (
                  <AreaRange
                    upper={points.systolic}
                    lower={points.diastolic}
                    color={color.systolic}
                    opacity={0.1}
                    animate
                  />
                ) : (
                  SERIES.filter((s) => s.key !== "pulse" && visible(s.key)).map((s) => (
                    <Area
                      key={s.key}
                      points={points[s.key]}
                      y0={chartBounds.bottom}
                      color={color[s.key]}
                      opacity={0.1}
                      animate
                    />
                  ))
                )}

                {SERIES.filter((s) => visible(s.key)).map((s) => (
                  <Line
                    key={s.key}
                    points={points[s.key]}
                    color={color[s.key]}
                    strokeWidth={2}
                    dash={s.dashed ? [6, 4] : undefined}
                    connectMissingData
                    animate
                  />
                ))}

                {!dense &&
                  SERIES.filter((s) => visible(s.key)).map((s) => (
                    <Scatter
                      key={`${s.key}-ring`}
                      points={points[s.key]}
                      radius={ringRadius}
                      color={theme.surface}
                    />
                  ))}
                {SERIES.filter((s) => visible(s.key)).map((s) => (
                  <Scatter
                    key={`${s.key}-dot`}
                    points={points[s.key]}
                    radius={dotRadius}
                    color={color[s.key]}
                  />
                ))}

                <Crosshair press={press} bounds={chartBounds} color={theme.muted} />
                {SERIES.filter((s) => visible(s.key)).map((s) => (
                  <ActiveDot
                    key={s.key}
                    press={press}
                    points={points[s.key]}
                    color={color[s.key]}
                    ring={theme.surface}
                    radius={5}
                  />
                ))}
              </>
            )}
          </CartesianChart>
        )}
      </View>

      <View className="mt-4 flex-row flex-wrap items-center gap-x-4 gap-y-2 border-t-2 border-border pt-4">
        {SERIES.map((s) => {
          const on = visible(s.key);
          return (
            <Pressable
              key={s.key}
              onPress={() => toggle(s.key)}
              hitSlop={8}
              className="flex-row items-center active:opacity-60"
            >
              {s.dashed ? (
                <View className="mr-1.5 flex-row items-center">
                  {[0, 1, 2].map((i) => (
                    <View
                      key={i}
                      style={{
                        width: 4,
                        height: 2,
                        marginRight: i < 2 ? 2 : 0,
                        backgroundColor: on ? color[s.key] : theme.muted,
                      }}
                    />
                  ))}
                </View>
              ) : (
                <View
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: on ? color[s.key] : theme.muted }}
                />
              )}
              <Text className={`text-sm font-medium ${on ? "" : "line-through opacity-50"}`}>
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
