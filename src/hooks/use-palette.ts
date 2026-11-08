import { palette, type Palette } from "@/constants/colors";
import { useColorScheme } from "nativewind";

// Returns the pallate for the current color scheme
export function usePalette(): Palette & { isDark: boolean } {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return { ...palette[isDark ? "dark" : "light"], isDark };
}
