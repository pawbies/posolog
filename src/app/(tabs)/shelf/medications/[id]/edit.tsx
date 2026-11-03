import MedicationFields from "@/components/medication/medication-fields";
import Button from "@/components/ui/button";
import Screen from "@/components/ui/screen";
import { useMedication } from "@/contexts/medication";
import { updateMedication } from "@/db/queries/medications";
import { toDraft, type MedicationDraft } from "@/lib/medication";
import { useRouter } from "expo-router";
import { Save } from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";

export default function EditMedicationScreen() {
  const router = useRouter();
  const medication = useMedication();
  const [draft, setDraft] = useState(() => toDraft(medication));
  const [updating, setUpdating] = useState(false);
  const canSave = !!draft.name.trim();

  const update = (patch: Partial<MedicationDraft>) => setDraft((d) => ({ ...d, ...patch }));

  const save = async () => {
    if (!canSave) return;
    setUpdating(true);
    try {
      await updateMedication(medication.id, draft);
      router.back();
    } catch {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Screen
      footer={
        <Button
          label="Save changes"
          icon={Save}
          color={draft.color}
          onPress={save}
          loading={updating}
          disabled={!canSave}
          accessibilityLabel={`Save changes to ${medication.name}`}
        />
      }
    >
      <MedicationFields value={draft} onChange={update} />
    </Screen>
  );
}
