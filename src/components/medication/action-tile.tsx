import IconBadge from "@/components/ui/icon-badge";
import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { ChevronRight, Plus, type LucideIcon } from "lucide-react-native";
import { View } from "react-native";

type ActionTileProps = {
  icon: LucideIcon;
  label: string;
  text: string;
  color: string;
  onSeeAll: () => void;
  onAdd: () => void;
};

export default function ActionTile({ icon, label, text, color, onSeeAll, onAdd }: ActionTileProps) {
  return (
    <View className="flex-row items-center rounded-[24px] border-2 border-border bg-surface p-3.5">
      <IconBadge icon={icon} color={color} />

      <View className="ml-3.5 flex-1">
        <Text muted className="text-sm font-medium">{label}</Text>
        <Text className="font-display-bold text-lg leading-6" numberOfLines={1}>{text}</Text>
      </View>

      <Pressable
        onPress={onSeeAll}
        accessibilityRole="button"
        accessibilityLabel={`See all ${label.toLowerCase()}`}
        hitSlop={6}
        className="h-11 flex-row items-center gap-0.5 rounded-full pl-4 pr-3"
        style={{ backgroundColor: `${color}1a` }}
      >
        <Text className="font-display-bold text-sm" style={{ color }}>All</Text>
        <ChevronRight size={16} color={color} strokeWidth={2.5} />
      </Pressable>
      <Pressable
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel={`Add ${label.toLowerCase()}`}
        hitSlop={6}
        className="ml-2 h-11 w-11 items-center justify-center rounded-full"
        style={{ backgroundColor: `${color}33` }}
      >
        <Plus size={20} color={color} strokeWidth={2.75} />
      </Pressable>
    </View>
  );
}
