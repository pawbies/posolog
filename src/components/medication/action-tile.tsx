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

export default function ActionTile({ icon: Icon, label, text, color, onSeeAll, onAdd }: ActionTileProps) {
  return (
    <View className="flex-row items-center rounded-3xl bg-surface p-4">
      <View
        className="h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${color}1f` }}
      >
        <Icon size={22} color={color} />
      </View>

      <View className="ml-3.5 flex-1">
        <Text muted className="text-xs font-semibold uppercase tracking-wider">{label}</Text>
        <Text className="mt-0.5 text-lg font-semibold" numberOfLines={1}>{text}</Text>
      </View>

      <Pressable
        onPress={onSeeAll}
        accessibilityRole="button"
        accessibilityLabel={`See all ${label.toLowerCase()}`}
        hitSlop={6}
        className="h-10 flex-row items-center gap-0.5 rounded-xl px-6"
        style={{ backgroundColor: `${color}14` }}
      >
        <Text className="text-sm font-semibold" style={{ color }}>All</Text>
        <ChevronRight size={14} color={color} />
      </Pressable>
      <Pressable
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel={`Add ${label.toLowerCase()}`}
        hitSlop={6}
        className="ml-2 h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: color }}
      >
        <Plus size={18} color="#fff" strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}
