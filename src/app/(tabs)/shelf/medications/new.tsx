import MedicationFields from "@/components/medication/medication-fields";
import MedicationHeader from "@/components/medication/medication-header";
import { createMedication } from "@/db/queries/medications";
import { usePalette } from "@/hooks/use-palette";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { type MedicationDraft } from "@/lib/medication";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function NewMedicationScreen() {
  const scroll = useScrollInsets(16, 40);
  const { tones } = usePalette();
  const [draft, setDraft] = useState<MedicationDraft>(() => ({
    name: "",
    color: tones.sky,
    form: "capsule",
    route: "oral",
    notes: "",
  }));
  const [initialDraft] = useState(draft);
  const [saving, setSaving] = useState(false);
  const canSave = !!draft.name.trim() && !saving;
  const dirty = (Object.keys(draft) as (keyof MedicationDraft)[]).some((key) => draft[key] !== initialDraft[key]);

  const leave = useUnsavedChanges(dirty, { title: "Discard medication?", message: "Your progress will be lost." });

  const update = (patch: Partial<MedicationDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const save = async () => {
    if (saving || !draft.name.trim()) return;
    setSaving(true);

    try {
      await createMedication(draft);
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
        fallbackTitle="New medication"
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
