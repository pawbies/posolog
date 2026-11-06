import IngredientFields from "@/components/ingredient/ingredient-fields";
import Text from "@/components/ui/text";
import { createIngredient } from "@/db/queries/ingredients";
import { usePalette } from "@/hooks/use-palette";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { emptyIngredientDraft, validateIngredientDraft, type IngredientDraft } from "@/lib/ingredient";
import { Stack } from "expo-router";
import { Atom, Save } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from "react-native";

export default function NewIngredientScreen() {
  const scroll = useScrollInsets(16, 40);
  const { tones } = usePalette();
  const accent = tones.lilac;
  const [draft, setDraft] = useState<IngredientDraft>(emptyIngredientDraft);
  const [initialDraft] = useState(draft);
  const [saving, setSaving] = useState(false);
  const canSave = !!draft.name.trim() && !saving;
  const dirty = (Object.keys(draft) as (keyof IngredientDraft)[]).some((key) => draft[key] !== initialDraft[key]);

  const leave = useUnsavedChanges(dirty, { title: "Discard ingredient?", message: "Your progress will be lost." });

  const update = (patch: Partial<IngredientDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const save = async () => {
    if (saving) return;
    const problem = validateIngredientDraft(draft);
    if (problem) {
      Alert.alert("Can't save yet", problem);
      return;
    }
    setSaving(true);

    try {
      await createIngredient(draft);
      leave();
    } catch (error) {
      const duplicate = String(error).includes("UNIQUE");
      Alert.alert(
        "Error",
        duplicate ? "An ingredient with this name already exists." : "Could not save the ingredient.",
      );
      setSaving(false);
    }
  };

  const range =
    draft.therapeuticRangeMin || draft.therapeuticRangeMax
      ? `${draft.therapeuticRangeMin || "?"}–${draft.therapeuticRangeMax || "?"} ng/mL`
      : null;

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Add ingredient",
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
                  {draft.name.trim() || "New ingredient"}
                </Text>
                <Text muted numberOfLines={1} className="text-xs">
                  {[draft.molarMass && `${draft.molarMass} g/mol`, range].filter(Boolean).join(" · ") ||
                    "Ingredient"}
                </Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <Pressable
              onPress={save}
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
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 grow"
        contentInsetAdjustmentBehavior={scroll.contentInsetAdjustmentBehavior}
        contentContainerStyle={{ paddingTop: scroll.paddingTop, paddingBottom: scroll.paddingBottom }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <IngredientFields value={draft} onChange={update} />
        </View>
      </ScrollView>
    </View>
  );
}
