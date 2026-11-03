import { usePalette } from "@/hooks/use-palette";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";

/** Fades content into the background where a list scrolls under fixed controls. */
export default function TopFade({ height = 20 }: { height?: number }) {
  const { background } = usePalette();

  return (
    <Svg
      pointerEvents="none"
      width="100%"
      height={height}
      style={{ position: "absolute", top: 0, left: 0, right: 0 }}
    >
      <Defs>
        <LinearGradient id="top-fade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={background} stopOpacity={1} />
          <Stop offset="1" stopColor={background} stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Rect width="100%" height={height} fill="url(#top-fade)" />
    </Svg>
  );
}
