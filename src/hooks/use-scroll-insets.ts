import { useContentTopInset } from "@/hooks/use-content-top-inset";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Settings for scrollviews because iOS and android are silly once again
export function useScrollInsets(extraTop = 0, extraBottom = 0) {
  const insets = useSafeAreaInsets();
  const topInset = useContentTopInset();

  if (Platform.OS === "ios") {
    return {
      contentInsetAdjustmentBehavior: "automatic" as const,
      paddingTop: extraTop,
      paddingBottom: extraBottom,
    };
  }

  return {
    contentInsetAdjustmentBehavior: "never" as const,
    paddingTop: topInset + extraTop,
    paddingBottom: insets.bottom + extraBottom,
  };
}
