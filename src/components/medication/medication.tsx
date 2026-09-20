import Pressable from "@/components/pressable";
import Text from "@/components/text";
import { FORM_META, ROUTE_META } from "@/contexts/medication-draft";
import { medications } from "@/db/schema";
import { ChevronRight } from "lucide-react-native";
import { View } from "react-native";

type MedicationProps = {
  medication: typeof medications.$inferSelect;
  onPress?: (medication: typeof medications.$inferSelect) => void;
};

export default function Medication({ medication, onPress }: MedicationProps) {
  const form = FORM_META[medication.form];
  const route = ROUTE_META[medication.route];
  const Icon = form.icon;

  return (
    <Pressable
      onPress={onPress ? () => onPress(medication) : undefined}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${medication.name}, ${route.name} ${form.name}`}
      className="flex-row items-center rounded-2xl bg-surface px-4 py-3.5"
    >
      <View className="w-1 self-stretch rounded-full" style={{ backgroundColor: medication.color }} />

      <View
        className="ml-3.5 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: `${medication.color}26` }}
      >
        <Icon size={20} color={medication.color} />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold" numberOfLines={1}>
          {medication.name}
        </Text>
        <Text muted className="mt-0.5 text-sm">
          {route.name} · {form.name}
        </Text>
        {medication.notes ? (
          <Text muted className="mt-1 text-xs" numberOfLines={1}>
            {medication.notes}
          </Text>
        ) : null}
      </View>

      {onPress ? <ChevronRight size={18} color="#a3a3a3" className="ml-2" /> : null}
    </Pressable>
  );
}
