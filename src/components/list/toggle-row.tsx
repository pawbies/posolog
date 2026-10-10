import Text from "@/components/ui/text";
import { usePalette } from "@/hooks/use-palette";
import { cn } from "@/lib/cn";
import { Host, Switch } from "@expo/ui";
import { type LucideIcon } from "lucide-react-native";
import { View } from "react-native";

type ToggleRowProps = {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function ToggleRow({
  icon: Icon,
  iconColor,
  title,
  description,
  value,
  onValueChange,
  disabled = false,
}: ToggleRowProps) {
  const { accent } = usePalette();

  return (
    <View className={cn("flex-row items-center gap-3 px-4 py-4", disabled && "opacity-50")}>
      <Icon size={24} color={iconColor ?? accent} />

      <View className="flex-1">
        <Text className="text-lg">{title}</Text>
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
