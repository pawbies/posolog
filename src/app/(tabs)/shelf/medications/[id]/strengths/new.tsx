import StrengthFields from "@/components/strength/strength-fields";
import StrengthHeader from "@/components/strength/strength-header";
import { allIngredients } from "@/db/queries/ingredients";
import { createStrength } from "@/db/queries/strengths";
import type { Medication } from "@/db/schema";
import { useMedication } from "@/hooks/use-medication";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import {
  canSaveStrengthDraft, validateStrengthDraft, type StrengthDraft, type StrengthWithIngredients,
} from "@/lib/strength";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

const EMPTY_DRAFT: StrengthDraft = { unitInUse: "derived_from_medication", ingredients: [] };

export default function NewStrengthScreen() {
  const { medication, strengths } = useMedication();
  if (!medication) return null;
  return <NewStrengthForm medication={medication} strengths={strengths} />;
}

function NewStrengthForm({ medication, strengths }: { medication: Medication; strengths: StrengthWithIngredients[] }) {
  const scroll = useScrollInsets(16, 40);
  const { data: ingredients } = useLiveQuery(allIngredients());

  const [draft, setDraft] = useState<StrengthDraft>(EMPTY_DRAFT);
  const [saving, setSaving] = useState(false);
  const canSave = canSaveStrengthDraft(draft) && !saving;
  const dirty = draft.unitInUse !== EMPTY_DRAFT.unitInUse || draft.ingredients.length > 0;

  const leave = useUnsavedChanges(dirty, { title: "Discard strength?", message: "Your progress will be lost." });

  const save = () => {
    if (saving) return;
    const problem = validateStrengthDraft(draft, new Map(ingredients.map((i) => [i.id, i.name])));
    if (problem) {
      Alert.alert("Can't save yet", problem);
      return;
    }
    setSaving(true);

    try {
      const position = strengths.reduce((max, s) => Math.max(max, s.position + 1), 0);
      createStrength(medication.id, position, draft);
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
        fallbackTitle="New strength"
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
