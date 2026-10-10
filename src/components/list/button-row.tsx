import Text from "@/components/ui/text";
import { usePalette } from "@/hooks/use-palette";
import { cn } from "@/lib/cn";
import { type LucideIcon } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

type ButtonRowProps = {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  buttonText: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function ButtonRow({
  icon: Icon,
  iconColor,
  title,
  description,
  buttonText,
  onPress,
  disabled = false,
}: ButtonRowProps) {
  const { accent } = usePalette();

  return (
    <View className={cn("flex-row items-center py-4 px-4", disabled && "opacity-50")}>
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
