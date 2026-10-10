import MedicationFields from "@/components/medication/medication-fields";
import Pressable from "@/components/ui/pressable";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { useMedication } from "@/contexts/medication";
import { updateMedication } from "@/db/queries/medications";
import { toDraft, type MedicationDraft } from "@/lib/medication";
import { useRouter } from "expo-router";
import { Save } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

export default function EditMedicationScreen() {
  const router = useRouter();
  const medication = useMedication();
  const [draft, setDraft] = useState(() => toDraft(medication));
  const [updating, setUpdating] = useState(false);

  const update = (patch: Partial<MedicationDraft>) => setDraft((d) => ({ ...d, ...patch }));

  const save = async () => {
    setUpdating(true);
    try {
      await updateMedication(medication.id, draft);
      router.dismissTo({ pathname: "/(tabs)/medications/[id]", params: { id: medication.id } });
    } catch {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Screen>
      <MedicationFields value={draft} onChange={update} />

      <Pressable
        onPress={save}
        disabled={updating}
        accessibilityRole="button"
        accessibilityLabel={`Update ${medication.name}`}
        style={{ backgroundColor: `${draft.color}1a` }}
        className="mt-3 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl"
      >
        {updating ? (
          <ActivityIndicator size="small" color={draft.color} />
        ) : (
          <>
            <Save size={18} color={draft.color} />
            <Text style={{ color: draft.color }} className="text-base font-semibold">Update {medication.name}</Text>
          </>
        )}
      </Pressable>
    </Screen>
  );
}
