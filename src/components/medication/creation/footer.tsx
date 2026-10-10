import { usePalette } from "@/hooks/use-palette";
import { ArrowLeft, ArrowRight } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onBack?: () => void;
  onNext?: () => void;
  showBack?: boolean;
  nextDisabled?: boolean;
  nextLabel?: string;
};

export default function Footer({
  onBack,
  onNext,
  showBack = true,
  nextDisabled = false,
  nextLabel = "Next",
}: Props) {
  const insets = useSafeAreaInsets();
  const { brand, onBrand, isDark } = usePalette();

  return (
    <View
      className="flex-row items-center px-4 bg-background"
      style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
    >
      {showBack ? (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Back"
          hitSlop={8}
          className="flex-row items-center gap-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 px-5 py-3 active:opacity-60"
        >
          <ArrowLeft size={18} color={isDark ? "#e5e5e5" : "#171717"} />
          <Text className="text-base font-semibold text-black dark:text-white">
            Back
          </Text>
        </Pressable>
      ) : (
        <View />
      )}

      <Pressable
        onPress={onNext}
        disabled={nextDisabled}
        accessibilityRole="button"
        accessibilityLabel={nextLabel}
        hitSlop={8}
        style={{
          backgroundColor: brand,
          opacity: nextDisabled ? 0.4 : 1,
          marginLeft: "auto",
        }}
        className="flex-row items-center gap-1.5 rounded-xl px-6 py-3 active:opacity-90"
      >
        <Text
          className="text-base font-semibold"
          style={{ color: onBrand }}
        >
          {nextLabel}
        </Text>
        <ArrowRight size={18} color={onBrand} />
      </Pressable>
    </View>
  );
}
