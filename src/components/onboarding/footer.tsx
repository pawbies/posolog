import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { useRef, useState, type ReactNode } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

type FooterProps = {
  disabled?: boolean;
  continueText: string;
  onContinue: () => void | Promise<void>;
  animated?: boolean;
  bottomElement?: ReactNode | undefined;
  loading: boolean;
};

type Rect = { x: number; y: number; w: number; h: number };

const SQUISH_MS = 120;
const EXPAND_MS = 550;

function measure(view: View | null): Promise<Rect> {
  return new Promise((resolve) => {
    if (!view) return resolve({ x: 0, y: 0, w: 0, h: 0 });
    view.measureInWindow((x, y, w, h) => resolve({ x, y, w, h }));
  });
}

export default function Footer({ disabled = false, continueText, onContinue, animated = false, bottomElement, loading }: FooterProps) {
  const insets = useSafeAreaInsets();
  const containerRef = useRef<View>(null);
  const buttonRef = useRef<View>(null);
  const [expanding, setExpanding] = useState(false);

  const from = useSharedValue<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const to = useSharedValue<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const contentOpacity = useSharedValue(1);

  const reset = () => {
    setExpanding(false);
    progress.value = 0;
    scale.value = 1;
    contentOpacity.value = 1;
  };

  const handleExpanded = () => {
    Promise.resolve(onContinue()).catch(reset);
  };

  const startTransition = async () => {
    const [container, button] = await Promise.all([measure(containerRef.current), measure(buttonRef.current)]);
    const screen = Dimensions.get("screen");

    from.value = { x: button.x - container.x, y: button.y - container.y, w: button.w, h: button.h };
    to.value = { x: -container.x - 4, y: -container.y - 4, w: screen.width + 8, h: screen.height + 8 };
    setExpanding(true);

    const timing = { reduceMotion: ReduceMotion.Never };

    scale.value = withSequence(
      withTiming(0.95, { duration: SQUISH_MS, easing: Easing.out(Easing.quad), ...timing }),
      withTiming(1, { duration: SQUISH_MS, easing: Easing.out(Easing.quad), ...timing })
    );
    contentOpacity.value = withTiming(0, { duration: SQUISH_MS + 60, ...timing });
    progress.value = withDelay(
      SQUISH_MS,
      withTiming(1, { duration: EXPAND_MS, easing: Easing.inOut(Easing.cubic), ...timing }, (finished) => {
        if (finished) scheduleOnRN(handleExpanded);
      }),
      ReduceMotion.Never
    );
  };

  const overlayStyle = useAnimatedStyle(() => {
    const a = from.value;
    const b = to.value;
    const p = progress.value;
    return {
      left: interpolate(p, [0, 1], [a.x, b.x]),
      top: interpolate(p, [0, 1], [a.y, b.y]),
      width: interpolate(p, [0, 1], [a.w, b.w]),
      height: interpolate(p, [0, 1], [a.h, b.h]),
      borderRadius: interpolate(p, [0, 1], [a.h / 2, 0]),
      transform: [{ scale: scale.value }],
    };
  });

  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  const handlePress = () => {
    if (expanding) return;
    if (animated) startTransition();
    else onContinue();
  };

  return (
    <View
      ref={containerRef}
      className="absolute left-1/2 -translate-x-1/2 flex flex-col gap-1"
      style={{ bottom: insets.bottom }}
    >
      <View ref={buttonRef} collapsable={false} style={{ opacity: expanding ? 0 : 1 }}>
        <Pressable
          accessibilityRole="button"
          onPress={handlePress}
          disabled={loading || disabled || expanding}
          className="min-h-16 min-w-full flex-row items-center justify-center rounded-full bg-primary disabled:bg-primary/50"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text className="text-xl font-semibold text-white">{continueText}</Text>
          )}
        </Pressable>
      </View>

      {bottomElement}

      {expanding && (
        <Animated.View pointerEvents="none" style={[{ position: "absolute", overflow: "hidden", zIndex: 10 }, overlayStyle]}>
          <View className="flex-1 items-center justify-center bg-primary">
            <Animated.View style={contentStyle}>
              <Text className="text-xl font-semibold text-white">{continueText}</Text>
            </Animated.View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
