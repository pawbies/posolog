import IconBadge from "@/components/ui/icon-badge";
import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import type { Medication } from "@/db/schema";
import { usePalette } from "@/hooks/use-palette";
import { FORM_META, ROUTE_META } from "@/lib/medication";
import { ChevronRight } from "lucide-react-native";
import { View } from "react-native";

type MedicationCardProps = {
  medication: Medication;
  onPress?: (medication: Medication) => void;
};

export default function MedicationCard({ medication, onPress }: MedicationCardProps) {
  const { chevron } = usePalette();
  const form = FORM_META[medication.form];
  const route = ROUTE_META[medication.route];

  return (
    <Pressable
      onPress={onPress ? () => onPress(medication) : undefined}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${medication.name}, ${route.name} ${form.name}`}
      className="flex-row items-center rounded-[24px] border-2 border-border bg-surface p-3.5 active:scale-[0.98]"
    >
      <IconBadge icon={form.icon} color={medication.color} className="h-14 w-14 rounded-[18px]" />

      <View className="ml-3.5 flex-1">
        <Text className="font-display-bold text-lg leading-6" numberOfLines={1}>
          {medication.name}
        </Text>
        <View className="mt-1 flex-row items-center gap-1.5">
          <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: `${medication.color}1f` }}>
            <Text className="text-xs font-semibold" style={{ color: medication.color }}>{form.name}</Text>
          </View>
          <Text muted className="text-xs font-medium">{route.name}</Text>
        </View>
        {medication.notes ? (
          <Text muted className="mt-1 text-xs" numberOfLines={1}>
            {medication.notes}
          </Text>
        ) : null}
      </View>

      {onPress ? <ChevronRight size={20} color={chevron} strokeWidth={2.5} /> : null}
    </Pressable>
  );
}
