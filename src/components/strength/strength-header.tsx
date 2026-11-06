import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { useMedication } from "@/contexts/medication";
import type { Ingredient } from "@/db/schema";
import { unitIcon, unitName, type StrengthDraft } from "@/lib/strength";
import { Stack } from "expo-router";
import { Save } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

type StrengthHeaderProps = {
  draft: StrengthDraft;
  ingredients: Ingredient[];
  fallbackTitle: string;
  onSave: () => void;
  canSave: boolean;
  saving: boolean;
};

export default function StrengthHeader({ draft, ingredients, fallbackTitle, onSave, canSave, saving }: StrengthHeaderProps) {
  const medication = useMedication();
  const color = medication.color;
  const unitLabel = unitName(draft.unitInUse, medication.form);
  const UnitIcon = unitIcon(draft.unitInUse, medication.form);
  const names = new Map(ingredients.map((i) => [i.id, i.name]));

  const summary = draft.ingredients
    .map((item) => {
      const name = names.get(item.ingredientId) ?? "?";
      return item.displayAmount ? `${item.displayAmount} ${item.displayUnit} ${name}` : name;
    })
    .join(" + ");

  return (
    <Stack.Screen
      options={{
        headerTitle: () => (
          <View className="w-52 flex-row items-center gap-2.5">
            <View
              style={{ backgroundColor: `${color}26` }}
              className="h-9 w-9 items-center justify-center rounded-xl"
            >
              <UnitIcon size={18} color={color} />
            </View>
            <View className="shrink">
              <Text numberOfLines={1} className="font-display-bold text-base">
                {summary || fallbackTitle}
              </Text>
              <Text muted numberOfLines={1} className="text-xs">
                {medication.name} · per {unitLabel}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <Pressable
            onPress={onSave}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityLabel="Save strength"
            hitSlop={8}
            style={{ opacity: canSave ? 1 : 0.4 }}
            className="h-9 w-9 items-center justify-center"
          >
            {saving ? (
              <ActivityIndicator size="small" color={color} />
            ) : (
              <Save size={22} color={color} strokeWidth={2.25} />
            )}
          </Pressable>
        ),
      }}
    />
  );
}
