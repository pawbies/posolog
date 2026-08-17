import { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Switch, Text, View } from "react-native";

export type ToggleRowProps = {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  first?: boolean;
};

export default function ToggleRow({
  icon: Icon,
  iconColor,
  title,
  description,
  value,
  onValueChange,
  disabled = false,
  first = false,
}: ToggleRowProps) {
  const { colorScheme } = useColorScheme();
  const accent = colorScheme === "dark" ? "#9333ea" : "#a78bfa";

  return (
    <View
      className={`flex-row items-center py-4 pr-4 pl-4 ${
        first ? "" : "border-t border-neutral-200 dark:border-neutral-800"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Icon size={24} color={iconColor ?? accent} />
      <View className="flex-1 ml-4">
        <Text className="text-lg text-black dark:text-white">{title}</Text>
        {description ? (
          <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={title}
        accessibilityHint={description}
        className="ml-3"
      />
    </View>
  );
}