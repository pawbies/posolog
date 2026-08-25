import Text from "@/components/text";
import { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { TouchableOpacity, View } from "react-native";

export type ButtonRowProps = {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  buttonText: string;
  onPress: () => void;
  disabled?: boolean;
  first?: boolean;
};

export default function ButtonRow({
  icon: Icon,
  iconColor,
  title,
  description,
  buttonText,
  onPress,
  disabled = false,
  first = false,
}: ButtonRowProps) {
  const { colorScheme } = useColorScheme();
  const accent = colorScheme === "dark" ? "#9333ea" : "#a78bfa";

  return (
    <View
      className={`flex-row items-center py-4 pr-4 pl-4 ${
        first ? "" : "border-t border-border"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Icon size={24} color={iconColor ?? accent} />
      <View className="flex-1 ml-4">
        <Text className="text-lg">{title}</Text>
        {description ? (
          <Text muted className="text-sm mt-0.5">
            {description}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled}
        accessibilityLabel={title}
        accessibilityHint={description}
      >
        <Text className="ml-3 text-lg font-semibold text-blue-500 dark:text-blue-400">
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
