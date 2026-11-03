import CartesianChart, { ActiveDot, Crosshair, Line } from "@/components/chart/cartesian-chart";
import Text from "@/components/ui/text";
import { mix } from "@/lib/color";
import { usePalette } from "@/hooks/use-palette";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { Rect } from "react-native-svg";

export type SingleDosePoint = { t: number; prodrug: number; active: number };

type Props = {
  data: SingleDosePoint[];
  color: string;
  labels: { prodrug: string; active: string };
  band?: { min: number; max: number };
};

const KEYS = ["prodrug", "active"] as const;

export default function SingleDoseChart({ data, color, labels, band }: Props) {
  const { text: fg, grid, muted: axisLabel, chevron: muted, surface } = usePalette();
  const colors = { prodrug: mix(color, fg, 0.4), active: color };

  const peaks = useMemo(() => {
    const peakOf = (key: (typeof KEYS)[number]) =>
      data.reduce((best, p) => (p[key] > best[key] ? p : best), data[0]);
    return { prodrug: peakOf("prodrug"), active: peakOf("active") };
  }, [data]);

  const yMax = useMemo(() => {
    const top = Math.max(peaks.prodrug.prodrug, peaks.active.active, band?.max ?? 0);
    return Math.ceil((top * 1.1) / 10) * 10;
  }, [peaks, band]);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const readout = activeIndex != null ? data[activeIndex] : null;

  const fmtT = (t: number) => (t < 1 ? `${Math.round(t * 60)} min` : `${t.toFixed(t % 1 ? 1 : 0)} h`);
  const fmtC = (c: number) => (c >= 10 ? c.toFixed(0) : c.toFixed(1));

  return (
    <View>
      <View className="flex-row gap-2">
        {KEYS.map((key) => (
          <View key={key} className="flex-1 rounded-[20px] p-3.5" style={{ backgroundColor: `${color}14` }}>
            <Text muted className="text-xs font-medium" numberOfLines={1}>
              {labels[key]}
            </Text>
            <Text className="mt-1 font-display-bold text-xl" style={{ color: colors[key] }}>
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
          yKeys={KEYS}
          domain={{ x: [0, data[data.length - 1].t], y: [0, yMax] }}
          padding={{ top: 4, right: 8 }}
          xAxis={{ tickValues: [0, 6, 12, 18, 24], format: (t) => `${t}h` }}
          yAxis={{ tickCount: 5, format: (v) => `${Math.round(v)}` }}
          gridColor={grid}
          labelColor={axisLabel}
          onActiveIndexChange={setActiveIndex}
        >
          {({ points, chartBounds, yScale, press }) => (
            <>
              {band ? (
                <Rect
                  x={chartBounds.left}
                  y={yScale(band.max)}
                  width={chartBounds.right - chartBounds.left}
                  height={yScale(band.min) - yScale(band.max)}
                  fill={color}
                  fillOpacity={0.08}
                />
              ) : null}

              <Line points={points.prodrug} color={colors.prodrug} strokeWidth={2} dash={[6, 4]} />
              <Line points={points.active} color={colors.active} strokeWidth={2.5} />

              <Crosshair press={press} bounds={chartBounds} color={muted} />
              {KEYS.map((key) => (
                <ActiveDot key={key} press={press} points={points[key]} color={colors[key]} ring={surface} />
              ))}
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
