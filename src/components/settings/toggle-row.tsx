import Text from "@/components/text";
import { Host, Switch } from "@expo/ui";
import { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

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
      className={`flex-row items-center gap-3 px-4 py-4 ${
        first ? "" : "border-t border-border"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Icon size={24} color={iconColor ?? accent} />

      <View className="flex-1">
        <Text className="text-lg">
          {title}
        </Text>
        {description ? (
          <Text muted className="text-sm mt-0.5">
            {description}
          </Text>
        ) : null}
      </View>

      <Host matchContents seedColor={accent}>
        <Switch value={value} onValueChange={onValueChange} disabled={disabled} />
      </Host>
    </View>
  );
}
