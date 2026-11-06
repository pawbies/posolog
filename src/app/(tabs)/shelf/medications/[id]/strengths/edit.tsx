import StrengthFields from "@/components/strength/strength-fields";
import StrengthHeader from "@/components/strength/strength-header";
import { allIngredients } from "@/db/queries/ingredients";
import { updateStrength } from "@/db/queries/strengths";
import type { Medication } from "@/db/schema";
import { useMedication } from "@/hooks/use-medication";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import {
  canSaveStrengthDraft, toStrengthDraft, validateStrengthDraft, type StrengthDraft, type StrengthWithIngredients,
} from "@/lib/strength";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function EditStrengthScreen() {
  const { strengthId } = useLocalSearchParams<{ strengthId: string }>();
  const { medication, strengths } = useMedication();
  const strength = strengths.find((s) => s.id === Number(strengthId));

  if (!medication || !strength) return null;
  return <EditStrengthForm medication={medication} strength={strength} />;
}

function EditStrengthForm({ medication, strength }: { medication: Medication; strength: StrengthWithIngredients }) {
  const scroll = useScrollInsets(16, 40);
  const { data: ingredients } = useLiveQuery(allIngredients());

  const [draft, setDraft] = useState<StrengthDraft>(() => toStrengthDraft(strength));
  const [initialDraft] = useState(() => JSON.stringify(draft));
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== initialDraft;
  const canSave = dirty && canSaveStrengthDraft(draft) && !saving;

  const leave = useUnsavedChanges(dirty, {
    title: "Discard changes?",
    message: "Your edits to this strength will be lost.",
  });

  const save = () => {
    if (saving) return;
    const problem = validateStrengthDraft(draft, new Map(ingredients.map((i) => [i.id, i.name])));
    if (problem) {
      Alert.alert("Can't save yet", problem);
      return;
    }
    setSaving(true);

    try {
      updateStrength(strength.id, draft);
      leave();
    } catch {
      Alert.alert("Error", "Could not save the strength.");
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StrengthHeader
        medication={medication}
        draft={draft}
        ingredients={ingredients}
        fallbackTitle="Edit strength"
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
        <StrengthFields medication={medication} value={draft} onChange={setDraft} ingredients={ingredients} />
      </ScrollView>
    </View>
  );
}
