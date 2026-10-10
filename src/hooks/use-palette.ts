import { palette, type Palette } from "@/constants/colors";
import { useColorScheme } from "nativewind";

export function usePalette(): Palette & { isDark: boolean } {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return { ...palette[isDark ? "dark" : "light"], isDark };
}
