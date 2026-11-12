import MedicationFields from "@/components/medication/medication-fields";
import MedicationHeader from "@/components/medication/medication-header";
import { updateMedication } from "@/db/queries/medications";
import type { Medication } from "@/db/schema";
import { useMedication } from "@/hooks/use-medication";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { toDraft, type MedicationDraft } from "@/lib/medication";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function EditMedicationScreen() {
  const { medication } = useMedication();
  if (!medication) return null;
  return <EditMedicationForm medication={medication} />;
}

function EditMedicationForm({ medication }: { medication: Medication }) {
  const scroll = useScrollInsets(16, 40);
  const [draft, setDraft] = useState(() => toDraft(medication));
  const [initialDraft] = useState(draft);
  const [saving, setSaving] = useState(false);
  const dirty = (Object.keys(draft) as (keyof MedicationDraft)[]).some((key) => draft[key] !== initialDraft[key]);
  const canSave = dirty && !!draft.name.trim() && !saving;

  const leave = useUnsavedChanges(dirty, {
    title: "Discard changes?",
    message: "Your edits to this medication will be lost.",
  });

  const update = (patch: Partial<MedicationDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const save = async () => {
    if (saving || !draft.name.trim()) return;
    setSaving(true);

    try {
      await updateMedication(medication.id, draft);
      leave();
    } catch {
      Alert.alert("Error", "Could not save the medication.");
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <MedicationHeader
        draft={draft}
        fallbackTitle="Edit medication"
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
          <MedicationFields value={draft} onChange={update} />
        </View>
      </ScrollView>
    </View>
  );
}
