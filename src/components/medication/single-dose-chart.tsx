import Text from "@/components/text";
import { mix } from "@/lib/color";
import { Circle, DashPathEffect, Line as SkiaLine, matchFont, Rect, vec } from "@shopify/react-native-skia";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { runOnJS, useAnimatedReaction, useDerivedValue, type SharedValue } from "react-native-reanimated";
import { CartesianChart, Line, useChartPressState, type ChartBounds } from "victory-native";

export type SingleDosePoint = { t: number; prodrug: number; active: number };

type Props = {
  data: SingleDosePoint[];
  color: string;
  labels: { prodrug: string; active: string };
  /** Therapeutic range of the active compound, ng/mL. */
  band?: { min: number; max: number };
};

const KEYS = ["prodrug", "active"] as const;

export default function SingleDoseChart({ data, color, labels, band }: Props) {
  const dark = useColorScheme().colorScheme === "dark";
  const fg = dark ? "#fafafa" : "#171717";
  const grid = dark ? "#2d2d34" : "#e1e1e6";
  const axisLabel = dark ? "#9696a0" : "#71717a";
  const muted = dark ? "#52525b" : "#a1a1aa";
  const surface = dark ? "#1a1a1e" : "#f5f5f7";
  const colors = { prodrug: mix(color, fg, 0.4), active: color };

  const font = useMemo(
    () => matchFont({ fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }), fontSize: 11, fontWeight: "500" }),
    [],
  );

  const peaks = useMemo(() => {
    const peakOf = (key: (typeof KEYS)[number]) =>
      data.reduce((best, p) => (p[key] > best[key] ? p : best), data[0]);
    return { prodrug: peakOf("prodrug"), active: peakOf("active") };
  }, [data]);

  const yMax = useMemo(() => {
    const top = Math.max(peaks.prodrug.prodrug, peaks.active.active, band?.max ?? 0);
    return Math.ceil((top * 1.1) / 10) * 10;
  }, [peaks, band]);

  const { state, isActive } = useChartPressState({ x: 0, y: { prodrug: 0, active: 0 } });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  useAnimatedReaction(
    () => (state.isActive.value ? state.matchedIndex.value : -1),
    (index, previous) => {
      if (index !== previous) runOnJS(setActiveIndex)(index >= 0 ? index : null);
    },
  );
  const readout = activeIndex != null ? data[activeIndex] : null;

  const fmtT = (t: number) => (t < 1 ? `${Math.round(t * 60)} min` : `${t.toFixed(t % 1 ? 1 : 0)} h`);
  const fmtC = (c: number) => (c >= 10 ? c.toFixed(0) : c.toFixed(1));

  return (
    <View>
      <View className="flex-row gap-2">
        {KEYS.map((key) => (
          <View key={key} className="flex-1 rounded-2xl p-3" style={{ backgroundColor: `${color}14` }}>
            <Text muted className="text-[10px] font-semibold uppercase tracking-wider" numberOfLines={1}>
              {labels[key]}
            </Text>
            <Text className="mt-1 text-lg font-semibold" style={{ color: colors[key] }}>
              {fmtC(readout ? readout[key] : peaks[key][key])}
              <Text muted className="text-xs font-normal"> ng/mL</Text>
            </Text>
            <Text muted className="text-[11px]">
              {readout ? `at ${fmtT(readout.t)}` : `Cmax · Tmax ${fmtT(peaks[key].t)}`}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-3 h-52">
        <CartesianChart
          data={data}
          xKey="t"
          yKeys={[...KEYS]}
          domain={{ x: [0, data[data.length - 1].t], y: [0, yMax] }}
          padding={{ top: 4, right: 8 }}
          frame={{ lineWidth: 0 }}
          chartPressState={state}
          xAxis={{
            font,
            tickValues: [0, 6, 12, 18, 24],
            labelColor: axisLabel,
            lineColor: grid,
            lineWidth: 1,
            formatXLabel: (t) => `${t}h`,
          }}
          yAxis={[{
            font,
            tickCount: 5,
            labelColor: axisLabel,
            lineColor: grid,
            lineWidth: 1,
            formatYLabel: (v) => `${Math.round(v ?? 0)}`,
          }]}
        >
          {({ points, chartBounds, yScale }) => (
            <>
              {band ? (
                <Rect
                  x={chartBounds.left}
                  y={yScale(band.max)}
                  width={chartBounds.right - chartBounds.left}
                  height={yScale(band.min) - yScale(band.max)}
                  color={`${color}14`}
                />
              ) : null}

              <Line points={points.prodrug} color={colors.prodrug} strokeWidth={2} curveType="monotoneX" strokeCap="round">
                <DashPathEffect intervals={[6, 4]} />
              </Line>
              <Line points={points.active} color={colors.active} strokeWidth={2.5} curveType="monotoneX" strokeCap="round" />

              {isActive && (
                <>
                  <Crosshair x={state.x.position} bounds={chartBounds} color={muted} />
                  {KEYS.map((key) => (
                    <ActiveDot key={key} x={state.x.position} y={state.y[key].position} color={colors[key]} ring={surface} />
                  ))}
                </>
              )}
            </>
          )}
        </CartesianChart>
      </View>

      <View className="mt-3 flex-row flex-wrap items-center gap-x-4 gap-y-1.5">
        <View className="flex-row items-center">
          <View className="mr-1.5 w-2.5 flex-row justify-between">
            {[0, 1].map((n) => <View key={n} style={{ width: 4, height: 2, backgroundColor: colors.prodrug }} />)}
          </View>
          <Text muted className="text-xs">{labels.prodrug}</Text>
        </View>
        <View className="flex-row items-center">
          <View className="mr-1.5 h-2.5 w-2.5 rounded-full" style={{ backgroundColor: colors.active }} />
          <Text muted className="text-xs">{labels.active}</Text>
        </View>
        {band ? (
          <View className="flex-row items-center">
            <View className="mr-1.5 h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: `${color}33` }} />
            <Text muted className="text-xs">Therapeutic range</Text>
          </View>
        ) : null}
      </View>
    </View>
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

function ActiveDot({ x, y, color, ring }: { x: SharedValue<number>; y: SharedValue<number>; color: string; ring: string }) {
  return (
    <>
      <Circle cx={x} cy={y} r={6} color={ring} />
      <Circle cx={x} cy={y} r={4} color={color} />
    </>
  );
}
