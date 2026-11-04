import IngredientFields from "@/components/ingredient/ingredient-fields";
import Button from "@/components/ui/button";
import Screen from "@/components/ui/screen";
import { useIngredient } from "@/contexts/ingredient";
import { updateIngredient } from "@/db/queries/ingredients";
import { usePalette } from "@/hooks/use-palette";
import { toIngredientDraft, validateIngredientDraft, type IngredientDraft } from "@/lib/ingredient";
import { useNavigation, useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { Save } from "lucide-react-native";
import { useRef, useState } from "react";
import { Alert } from "react-native";

export default function EditIngredientScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const ingredient = useIngredient();
  const { tones } = usePalette();
  const [draft, setDraft] = useState(() => toIngredientDraft(ingredient));
  const initialDraft = useRef(draft);
  const savedRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const canSave = !!draft.name.trim() && !saving;
  const dirty = (Object.keys(draft) as (keyof IngredientDraft)[]).some(
    (key) => draft[key] !== initialDraft.current[key],
  );

  usePreventRemove(dirty && !savedRef.current, ({ data }) => {
    // savedRef doesn't trigger a re-render, so the guard can still be armed right after saving.
    if (savedRef.current) {
      navigation.dispatch(data.action);
      return;
    }

    Alert.alert("Discard changes?", "Your edits to this ingredient will be lost.", [
      { text: "Keep editing", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
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
      savedRef.current = true;
      router.back();
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
