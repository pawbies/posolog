import { useContentTopInset } from "@/hooks/use-content-top-inset";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Insets for a screen's scroll view, so content clears the header and the tab bar.
 *
 * iOS: the native tab bar can't be measured from JS, but UIKit includes it (and the
 * transparent header) in the scroll view's safe area, so "automatic" adjustment handles
 * both and content still scrolls behind the glass. Only the extra spacing is padding.
 *
 * Android: native tabs already keep content above the tab bar, so pad manually as before.
 */
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
