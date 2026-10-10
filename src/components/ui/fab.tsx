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
        borderless: true,
        radius: 28,
      }}
      style={{
        bottom: insets.bottom + 24,
        backgroundColor: brand,
        shadowColor: isDark ? "#000000" : brand,
        shadowOpacity: isDark ? 0.5 : 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 8,
      }}
      className="absolute right-6 w-16 h-16 rounded-full justify-center items-center active:opacity-90 active:scale-95"
    >
      <Icon size={28} strokeWidth={2.5} color={onBrand} />
    </Pressable>
  );
}
