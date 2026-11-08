import { usePalette } from "@/hooks/use-palette";
import { type LucideIcon } from "lucide-react-native";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onPress?: () => void;
  icon: LucideIcon;
  label: string;
};

export default function Fab({ onPress, icon: Icon, label }: Props) {
  const insets = useSafeAreaInsets();
  const { brand, onBrand, isDark } = usePalette();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      android_ripple={{
        color: isDark ? "#00000033" : "#ffffff40",
        foreground: true,
        radius: 32,
      }}
      style={{
        bottom: insets.bottom + 24,
        backgroundColor: brand,
        shadowColor: isDark ? "#000000" : brand,
        shadowOpacity: isDark ? 0.5 : 0.35,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
      }}
      className="absolute right-5 h-16 w-16 items-center justify-center rounded-[22px] active:scale-95 active:opacity-90"
    >
      <Icon size={30} strokeWidth={2.75} color={onBrand} />
    </Pressable>
  );
}
