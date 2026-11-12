import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { usePalette } from "@/hooks/use-palette";
import type { IngredientDraft } from "@/lib/ingredient";
import { Stack } from "expo-router";
import { Atom, Save } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

type IngredientHeaderProps = {
  draft: IngredientDraft;
  fallbackTitle: string;
  onSave: () => void;
  canSave: boolean;
  saving: boolean;
};

export default function IngredientHeader({ draft, fallbackTitle, onSave, canSave, saving }: IngredientHeaderProps) {
  const { tones } = usePalette();
  const accent = tones.lilac;

  const range =
    draft.therapeuticRangeMin || draft.therapeuticRangeMax
      ? `${draft.therapeuticRangeMin || "?"}–${draft.therapeuticRangeMax || "?"} ng/mL`
      : null;
  const subtitle = [draft.molarMass && `${draft.molarMass} g/mol`, range].filter(Boolean).join(" · ");

  return (
    <Stack.Screen
      options={{
        headerTitle: () => (
          <View className="w-52 flex-row items-center gap-2.5">
            <View
              style={{ backgroundColor: `${accent}26` }}
              className="h-9 w-9 items-center justify-center rounded-xl"
            >
              <Atom size={18} color={accent} />
            </View>
            <View className="shrink">
              <Text numberOfLines={1} className="font-display-bold text-base">
                {draft.name.trim() || fallbackTitle}
              </Text>
              <Text muted numberOfLines={1} className="text-xs">
                {subtitle || "Ingredient"}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <Pressable
            onPress={onSave}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityLabel="Save ingredient"
            hitSlop={8}
            style={{ opacity: canSave ? 1 : 0.4 }}
            className="h-9 w-9 items-center justify-center"
          >
            {saving ? (
              <ActivityIndicator size="small" color={accent} />
            ) : (
              <Save size={22} color={accent} strokeWidth={2.25} />
            )}
          </Pressable>
        ),
      }}
    />
  );
}
