import IngredientFields from "@/components/ingredient/ingredient-fields";
import IngredientHeader from "@/components/ingredient/ingredient-header";
import { createIngredient } from "@/db/queries/ingredients";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { emptyIngredientDraft, validateIngredientDraft, type IngredientDraft } from "@/lib/ingredient";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function NewIngredientScreen() {
  const scroll = useScrollInsets(16, 40);
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

  return (
    <View className="flex-1 bg-background">
      <IngredientHeader
        draft={draft}
        fallbackTitle="New ingredient"
        onSave={save}
        canSave={canSave}
        saving={saving}
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
