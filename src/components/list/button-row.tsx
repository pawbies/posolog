import IconBadge from "@/components/ui/icon-badge";
import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { type Tone } from "@/constants/colors";
import { cn } from "@/lib/cn";
import { type LucideIcon } from "lucide-react-native";
import { View } from "react-native";

type ButtonRowProps = {
  icon: LucideIcon;
  tone?: Tone;
  title: string;
  description?: string;
  buttonText: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function ButtonRow({
  icon,
  tone = "lilac",
  title,
  description,
  buttonText,
  onPress,
  disabled = false,
}: ButtonRowProps) {
  return (
    <View className={cn("flex-row items-center gap-4 px-3.5 py-3", disabled && "opacity-50")}>
      <IconBadge icon={icon} tone={tone} size="sm" className="h-10 w-10" />
      <View className="flex-1">
        <Text className="text-[17px] font-medium">{title}</Text>
        {description ? <Text muted className="mt-0.5 text-sm">{description}</Text> : null}
      </View>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={buttonText}
        accessibilityHint={description}
        className="rounded-full bg-surface-alt px-3.5 py-2"
      >
        <Text className="font-display-bold text-sm">{buttonText}</Text>
      </Pressable>
    </View>
  );
}
