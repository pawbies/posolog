import { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Same greens as the tab bar: the darkened hue reads on a light background,
// the icon green reads on a dark one.
const GREEN = "#aade87";
const GREEN_DARK = "#56972b";

type Props = {
    onPress?: () => void;
    icon: LucideIcon;
    label: string;
};

export default function Fab({ onPress, icon: Icon, label }: Props) {
    const insets = useSafeAreaInsets();
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

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
                backgroundColor: isDark ? GREEN : GREEN_DARK,
                shadowColor: isDark ? "#000000" : GREEN_DARK,
                shadowOpacity: isDark ? 0.5 : 0.4,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 6 },
                elevation: 8,
            }}
            className="absolute right-6 w-16 h-16 rounded-full justify-center items-center active:opacity-90 active:scale-95"
        >
            <Icon size={28} strokeWidth={2.5} color={isDark ? "#1a2e10" : "#ffffff"} />
        </Pressable>
    );
}
