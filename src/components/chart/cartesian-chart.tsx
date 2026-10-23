import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Platform, View, type LayoutChangeEvent } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import Svg, { Circle, Path, Line as SvgLine, Text as SvgText, type PathProps } from "react-native-svg";
import { scheduleOnRN, scheduleOnUI } from "react-native-worklets";
import {
  closestIndex,
  computeLayout,
  FONT_SIZE,
  type AxisOptions,
  type Bounds,
  type ChartPoint,
  type Domain,
  type Scale,
  type Sides,
  type Tick,
} from "./layout";
import { areaPath, bandPath, dotsPath, linePath } from "./paths";

export type { Bounds as ChartBounds, ChartPoint } from "./layout";


export type PressState = { index: SharedValue<number>; positions: number[] };

export type ChartContext<K extends string> = {
  points: Record<K, ChartPoint[]>;
  chartBounds: Bounds;
  xScale: Scale;
  yScale: Scale;
  press: PressState;
};

type CartesianChartProps<T extends Record<string, unknown>, K extends keyof T & string> = {
  data: T[];
  xKey: keyof T & string;
  yKeys: readonly K[];
  domain?: { x?: Domain; y?: Domain };
  padding?: Sides;
  domainPadding?: Sides;
  xAxis?: AxisOptions;
  yAxis?: AxisOptions;
  gridColor: string;
  labelColor: string;
  onActiveIndexChange?: (index: number | null) => void;
  children: (chart: ChartContext<K>) => ReactNode;
};

const FONT_FAMILY = Platform.select({ ios: "Helvetica", default: "sans-serif" });
const LONG_PRESS_MS = 100;
const ANIMATION_MS = 300;
const NO_POSITIONS: number[] = [];

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedLine = Animated.createAnimatedComponent(SvgLine);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function CartesianChart<T extends Record<string, unknown>, K extends keyof T & string>({
  data,
  xKey,
  yKeys,
  domain,
  padding,
  domainPadding,
  xAxis,
  yAxis,
  gridColor,
  labelColor,
  onActiveIndexChange,
  children,
}: CartesianChartProps<T, K>) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const index = useSharedValue(-1);

  const layout = useMemo(
    () =>
      size.width > 0 && size.height > 0
        ? computeLayout({ ...size, data, xKey, yKeys, domain, padding, domainPadding, xAxis, yAxis })
        : null,
    [size, data, xKey, yKeys, domain, padding, domainPadding, xAxis, yAxis],
  );
  const positions = layout?.positions ?? NO_POSITIONS;
  const press = useMemo<PressState>(() => ({ index, positions }), [index, positions]);

  useEffect(() => {
    index.set(-1);
  }, [data, index]);

  useAnimatedReaction(
    () => index.get(),
    (current, previous) => {
      if (current !== previous && onActiveIndexChange) {
        scheduleOnRN(onActiveIndexChange, current >= 0 ? current : null);
      }
    },
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .activateAfterLongPress(LONG_PRESS_MS)
        .onStart((e) => {
          index.set(closestIndex(positions, e.x));
        })
        .onUpdate((e) => {
          index.set(closestIndex(positions, e.x));
        })
        .onFinalize(() => {
          index.set(-1);
        }),
    [index, positions],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  return (
    <GestureDetector gesture={gesture}>
      <View style={{ flex: 1 }} onLayout={onLayout} collapsable={false}>
        {layout ? (
          <Svg width={size.width} height={size.height}>
            {layout.xTicks.map((t) => (
              <SvgLine
                key={`grid-x-${t.value}`}
                x1={t.position}
                x2={t.position}
                y1={layout.bounds.top}
                y2={layout.bounds.bottom}
                stroke={gridColor}
                strokeWidth={1}
              />
            ))}
            {layout.yTicks.map((t) => (
              <SvgLine
                key={`grid-y-${t.value}`}
                x1={layout.bounds.left}
                x2={layout.bounds.right}
                y1={t.position}
                y2={t.position}
                stroke={gridColor}
                strokeWidth={1}
              />
            ))}
            {layout.xTicks.map((t) => (
              <AxisLabel key={`label-x-${t.value}`} tick={t} color={labelColor} />
            ))}
            {layout.yTicks.map((t) => (
              <AxisLabel key={`label-y-${t.value}`} tick={t} color={labelColor} />
            ))}

            {children({
              points: layout.points,
              chartBounds: layout.bounds,
              xScale: layout.xScale,
              yScale: layout.yScale,
              press,
            })}
          </Svg>
        ) : null}
      </View>
    </GestureDetector>
  );
}

function AxisLabel({ tick, color }: { tick: Tick; color: string }) {
  return (
    <SvgText
      x={tick.labelX}
      y={tick.labelY}
      textAnchor={tick.anchor}
      fill={color}
      fontSize={FONT_SIZE}
      fontFamily={FONT_FAMILY}
      fontWeight="500"
    >
      {tick.label}
    </SvgText>
  );
}

type LineProps = {
  points: ChartPoint[];
  color: string;
  strokeWidth?: number;
  dash?: number[];
  connectMissingData?: boolean;
  animate?: boolean;
};

export function Line({
  points,
  color,
  strokeWidth = 2,
  dash,
  connectMissingData = false,
  animate = false,
}: LineProps) {
  const d = useMemo(() => linePath(points, connectMissingData), [points, connectMissingData]);
  return (
    <SeriesPath
      d={d}
      animate={animate}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={dash}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

type AreaProps = {
  points: ChartPoint[];
  y0: number;
  color: string;
  opacity?: number;
  animate?: boolean;
};

export function Area({ points, y0, color, opacity = 0.1, animate = false }: AreaProps) {
  const d = useMemo(() => areaPath(points, y0), [points, y0]);
  return <SeriesPath d={d} animate={animate} fill={color} fillOpacity={opacity} />;
}

type AreaRangeProps = {
  upper: ChartPoint[];
  lower: ChartPoint[];
  color: string;
  opacity?: number;
  animate?: boolean;
};

export function AreaRange({ upper, lower, color, opacity = 0.1, animate = false }: AreaRangeProps) {
  const d = useMemo(() => bandPath(upper, lower), [upper, lower]);
  return <SeriesPath d={d} animate={animate} fill={color} fillOpacity={opacity} />;
}

export function Scatter({ points, radius, color }: { points: ChartPoint[]; radius: number; color: string }) {
  const d = useMemo(() => dotsPath(points, radius), [points, radius]);
  return <Path d={d} fill={color} />;
}

type GuideLineProps = {
  x: number;
  bounds: Bounds;
  color: string;
  dash?: number[];
  opacity?: number;
};

export function GuideLine({ x, bounds, color, dash, opacity = 1 }: GuideLineProps) {
  return (
    <SvgLine
      x1={x}
      x2={x}
      y1={bounds.top}
      y2={bounds.bottom}
      stroke={color}
      strokeWidth={1}
      strokeDasharray={dash}
      opacity={opacity}
    />
  );
}

export function Crosshair({ press, bounds, color }: { press: PressState; bounds: Bounds; color: string }) {
  const animatedProps = useAnimatedProps(() => {
    const i = press.index.get();
    const x = i >= 0 ? (press.positions[i] ?? 0) : 0;
    return { x1: x, x2: x, opacity: i >= 0 ? 1 : 0 };
  });
  return (
    <AnimatedLine
      animatedProps={animatedProps}
      y1={bounds.top}
      y2={bounds.bottom}
      stroke={color}
      strokeWidth={1}
      strokeDasharray={[4, 3]}
    />
  );
}

type ActiveDotProps = {
  press: PressState;
  points: ChartPoint[];
  color: string;
  ring: string;
  radius?: number;
};

export function ActiveDot({ press, points, color, ring, radius = 4 }: ActiveDotProps) {
  const ringProps = useActiveDotProps(press, points);
  const dotProps = useActiveDotProps(press, points);
  return (
    <>
      <AnimatedCircle animatedProps={ringProps} r={radius + 2} fill={ring} />
      <AnimatedCircle animatedProps={dotProps} r={radius} fill={color} />
    </>
  );
}

function useActiveDotProps(press: PressState, points: ChartPoint[]) {
  return useAnimatedProps(() => {
    const point = points[press.index.get()];
    const y = point?.y;
    return y == null ? { cx: 0, cy: 0, opacity: 0 } : { cx: point.x, cy: y, opacity: 1 };
  });
}

type SeriesPathProps = Omit<PathProps, "d"> & { d: string; animate: boolean };

function SeriesPath({ d, animate, ...rest }: SeriesPathProps) {
  return animate ? <TweenPath d={d} {...rest} /> : <Path d={d} {...rest} />;
}

const NUMBER = /(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/i;

function tokenize(d: string) {
  const parts = d.split(NUMBER);
  return {
    template: parts.filter((_, i) => i % 2 === 0),
    values: parts.filter((_, i) => i % 2 === 1).map(Number),
  };
}

type Tween = { template: string[]; from: number[]; to: number[] };

function TweenPath({ d, ...rest }: Omit<PathProps, "d"> & { d: string }) {
  const [initial] = useState(() => tokenize(d));
  const tween = useSharedValue<Tween>({ template: initial.template, from: initial.values, to: initial.values });
  const progress = useSharedValue(1);
  const shown = useRef(d);

  useEffect(() => {
    if (shown.current === d) return;
    shown.current = d;
    const next = tokenize(d);

    scheduleOnUI(() => {
      const { template, from, to } = tween.get();
      const sameShape =
        template.length === next.template.length && template.every((part, i) => part === next.template[i]);
      if (!sameShape) {
        tween.set({ template: next.template, from: next.values, to: next.values });
        progress.set(1);
        return;
      }

      const t = progress.get();
      tween.set({ template: next.template, from: from.map((v, i) => v + (to[i] - v) * t), to: next.values });
      progress.set(0);
      progress.set(withTiming(1, { duration: ANIMATION_MS }));
    });
  }, [d, tween, progress]);

  const animatedProps = useAnimatedProps(() => {
    const t = progress.get();
    const { template, from, to } = tween.get();
    let path = template[0];
    for (let i = 0; i < to.length; i++) path += from[i] + (to[i] - from[i]) * t + template[i + 1];
    return { d: path };
  });

  return <AnimatedPath animatedProps={animatedProps} {...rest} />;
}
