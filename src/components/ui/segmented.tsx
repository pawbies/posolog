import Pressable from "@/components/ui/pressable";
import { cn } from "@/lib/cn";
import { Text, View } from "react-native";

type SegmentedProps<T extends string> = {
  options: readonly { key: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

/** Pill-shaped switcher between a few options. */
export default function Segmented<T extends string>({ options, value, onChange, className }: SegmentedProps<T>) {
  return (
    <View accessibilityRole="tablist" className={cn("flex-row rounded-full bg-surface-alt p-1", className)}>
      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            className={cn("flex-1 items-center rounded-full py-2.5", selected && "bg-text")}
          >
            <Text className={cn("font-display-bold text-[15px]", selected ? "text-background" : "text-text-muted")}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
