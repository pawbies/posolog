import IconBadge from "@/components/ui/icon-badge";
import Text from "@/components/ui/text";
import { type Tone } from "@/constants/colors";
import { usePalette } from "@/hooks/use-palette";
import { cn } from "@/lib/cn";
import { Host, Switch } from "@expo/ui";
import { type LucideIcon } from "lucide-react-native";
import { View } from "react-native";

type ToggleRowProps = {
  icon: LucideIcon;
  tone?: Tone;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

export default function ToggleRow({
  icon,
  tone = "lilac",
  title,
  description,
  value,
  onValueChange,
  disabled = false,
}: ToggleRowProps) {
  const { brand } = usePalette();

  return (
    <View className={cn("flex-row items-center gap-4 px-3.5 py-3", disabled && "opacity-50")}>
      <IconBadge icon={icon} tone={tone} size="sm" className="h-10 w-10" />

      <View className="flex-1">
        <Text className="text-[17px] font-medium">{title}</Text>
        {description ? <Text muted className="mt-0.5 text-sm">{description}</Text> : null}
      </View>

      <Host matchContents seedColor={brand}>
        <Switch value={value} onValueChange={onValueChange} disabled={disabled} />
      </Host>
    </View>
  );
}
