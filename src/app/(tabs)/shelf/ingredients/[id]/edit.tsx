import IngredientFields from "@/components/ingredient/ingredient-fields";
import Button from "@/components/ui/button";
import Screen from "@/components/ui/screen";
import { updateIngredient } from "@/db/queries/ingredients";
import type { Ingredient } from "@/db/schema";
import { useIngredient } from "@/hooks/use-ingredient";
import { usePalette } from "@/hooks/use-palette";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { toIngredientDraft, validateIngredientDraft, type IngredientDraft } from "@/lib/ingredient";
import { Save } from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";

export default function EditIngredientScreen() {
  const ingredient = useIngredient();
  if (!ingredient) return null;
  return <EditIngredientForm ingredient={ingredient} />;
}

function EditIngredientForm({ ingredient }: { ingredient: Ingredient }) {
  const { tones } = usePalette();
  const [draft, setDraft] = useState(() => toIngredientDraft(ingredient));
  const [initialDraft] = useState(draft);
  const [saving, setSaving] = useState(false);
  const canSave = !!draft.name.trim() && !saving;
  const dirty = (Object.keys(draft) as (keyof IngredientDraft)[]).some((key) => draft[key] !== initialDraft[key]);

  const leave = useUnsavedChanges(dirty, {
    title: "Discard changes?",
    message: "Your edits to this ingredient will be lost.",
  });

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
      await updateIngredient(ingredient.id, draft);
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
    <Screen
      footer={
        <Button
          label="Save changes"
          icon={Save}
          color={tones.lilac}
          onPress={save}
          loading={saving}
          disabled={!canSave}
          accessibilityLabel={`Save changes to ${ingredient.name}`}
        />
      }
    >
      <IngredientFields value={draft} onChange={update} />
    </Screen>
  );
}
