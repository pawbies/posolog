import { useHeaderHeight } from "expo-router/react-navigation";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Returns the real header height because android and iOS behave differently for some reason
export function useContentTopInset() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();
  if (!headerHeight) return insets.top;
  return Platform.OS === "ios" ? headerHeight : 0;
}
