import { bloodPressureReadings } from "@/db/schema";
import {
  Circle,
  DashPathEffect,
  Line as SkiaLine,
  matchFont,
  vec,
} from "@shopify/react-native-skia";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  type SharedValue,
} from "react-native-reanimated";
import {
  Area,
  AreaRange,
  CartesianChart,
  Line,
  Scatter,
  useChartPressState,
  type ChartBounds,
} from "victory-native";

type Reading = typeof bloodPressureReadings.$inferSelect;

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

export default function Graph({ readings }: { readings: Reading[] }) {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";

  const theme = dark
    ? { surface: "#171717", grid: "#262626", axisLabel: "#a3a3a3", muted: "#525252" }
    : { surface: "#f5f5f5", grid: "#e5e5e5", axisLabel: "#737373", muted: "#a3a3a3" };

  const color = useMemo(
    () =>
      Object.fromEntries(SERIES.map((s) => [s.key, dark ? s.dark : s.light])) as Record<
        SeriesKey,
        string
      >,
    [dark],
  );

  const font = useMemo(
    () =>
      matchFont({
        fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }),
        fontSize: 11,
        fontWeight: "500",
      }),
    [],
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

  // Hidden series are nulled out rather than dropped, so `yKeys` — and with it
  // the press state — stays stable across toggles.
  const chartData = useMemo<Point[]>(
    () =>
      data.map((d) => ({
        t: d.t,
        systolic: visible("systolic") ? d.systolic : null,
        diastolic: visible("diastolic") ? d.diastolic : null,
        pulse: visible("pulse") ? d.pulse : null,
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

  const { state, isActive } = useChartPressState({
    x: 0,
    y: { systolic: 0, diastolic: 0, pulse: 0 },
  });

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  useAnimatedReaction(
    () => (state.isActive.value ? state.matchedIndex.value : -1),
    (index, previous) => {
      if (index !== previous) runOnJS(setActiveIndex)(index >= 0 ? index : null);
    },
  );

  const readout =
    (activeIndex != null ? data[activeIndex] : undefined) ?? data[data.length - 1];
  // One marker per reading, always. They shrink and drop their surface ring
  // once the points get close enough together that rings would merge into mush.
  const dense = chartData.length > DENSE_AT;
  const dotRadius = dense ? 1.5 : 3;
  const ringRadius = dotRadius + 2;

  return (
    <View className="rounded-2xl bg-neutral-100 p-4 dark:bg-neutral-900">
      <Text className="text-xs font-semibold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        Trend
      </Text>

      {readout ? (
        <View className="mt-3">
          <View className="flex-row items-baseline">
            <Text className="text-4xl font-semibold text-black dark:text-white">
              {readout.systolic}
              <Text className="text-neutral-400 dark:text-neutral-500">/</Text>
              {readout.diastolic}
            </Text>
            <Text className="ml-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              mmHg
            </Text>
            {readout.pulse != null && (
              <Text className="ml-3 text-sm text-neutral-500 dark:text-neutral-400">
                {readout.pulse} bpm
              </Text>
            )}
          </View>
          <Text className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
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
        {chartData.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-sm text-neutral-500 dark:text-neutral-400">
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
            frame={{ lineWidth: 0 }}
            chartPressState={state}
            xAxis={{
              font,
              tickCount: 4,
              labelColor: theme.axisLabel,
              lineColor: theme.grid,
              lineWidth: 1,
              formatXLabel: formatTick,
            }}
            yAxis={[
              {
                font,
                tickCount: 5,
                labelColor: theme.axisLabel,
                lineColor: theme.grid,
                lineWidth: 1,
                formatYLabel: (v) => (v == null ? "" : `${Math.round(v)}`),
              },
            ]}
          >
            {({ points, chartBounds }) => (
              <>
                {visible("systolic") && visible("diastolic") ? (
                  <AreaRange
                    upperPoints={points.systolic}
                    lowerPoints={points.diastolic}
                    color={color.systolic}
                    opacity={0.1}
                    curveType="monotoneX"
                    animate={{ type: "timing", duration: 300 }}
                  />
                ) : (
                  SERIES.filter((s) => s.key !== "pulse" && visible(s.key)).map((s) => (
                    <Area
                      key={s.key}
                      points={points[s.key]}
                      y0={chartBounds.bottom}
                      color={color[s.key]}
                      opacity={0.1}
                      curveType="monotoneX"
                      animate={{ type: "timing", duration: 300 }}
                    />
                  ))
                )}

                {SERIES.filter((s) => visible(s.key)).map((s) => (
                  <Line
                    key={s.key}
                    points={points[s.key]}
                    color={color[s.key]}
                    strokeWidth={2}
                    strokeJoin="round"
                    strokeCap="round"
                    curveType="monotoneX"
                    connectMissingData
                    animate={{ type: "timing", duration: 300 }}
                  >
                    {s.dashed ? <DashPathEffect intervals={[6, 4]} /> : null}
                  </Line>
                ))}

                {/* A marker per reading. The surface ring keeps them legible
                    where the traces cross each other. */}
                {!dense &&
                  SERIES.filter((s) => visible(s.key)).map((s) => (
                    <Scatter
                      key={`${s.key}-ring`}
                      points={points[s.key]}
                      radius={ringRadius}
                      color={theme.surface}
                      style="fill"
                    />
                  ))}
                {SERIES.filter((s) => visible(s.key)).map((s) => (
                  <Scatter
                    key={`${s.key}-dot`}
                    points={points[s.key]}
                    radius={dotRadius}
                    color={color[s.key]}
                    style="fill"
                  />
                ))}

                {isActive && (
                  <>
                    <Crosshair x={state.x.position} bounds={chartBounds} color={theme.muted} />
                    {SERIES.filter((s) => visible(s.key)).map((s) => (
                      <ActiveDot
                        key={s.key}
                        x={state.x.position}
                        y={state.y[s.key].position}
                        color={color[s.key]}
                        ring={theme.surface}
                      />
                    ))}
                  </>
                )}
              </>
            )}
          </CartesianChart>
        )}
      </View>

      <View className="mt-3 flex-row flex-wrap items-center gap-x-4 gap-y-2">
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
                  className="mr-1.5 h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: on ? color[s.key] : theme.muted }}
                />
              )}
              <Text
                className={`text-xs ${
                  on
                    ? "text-neutral-600 dark:text-neutral-300"
                    : "text-neutral-400 line-through dark:text-neutral-600"
                }`}
              >
                {s.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function Crosshair({
  x,
  bounds,
  color,
}: {
  x: SharedValue<number>;
  bounds: ChartBounds;
  color: string;
}) {
  const top = useDerivedValue(() => vec(x.value, bounds.top));
  const bottom = useDerivedValue(() => vec(x.value, bounds.bottom));

  return (
    <SkiaLine p1={top} p2={bottom} color={color} strokeWidth={1}>
      <DashPathEffect intervals={[4, 3]} />
    </SkiaLine>
  );
}

function ActiveDot({
  x,
  y,
  color,
  ring,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
  color: string;
  ring: string;
}) {
  return (
    <>
      <Circle cx={x} cy={y} r={7} color={ring} />
      <Circle cx={x} cy={y} r={5} color={color} />
    </>
  );
}
