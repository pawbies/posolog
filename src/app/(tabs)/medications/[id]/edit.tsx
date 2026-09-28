import ColorField from "@/components/color-field";
import Pressable from "@/components/pressable";
import RadioField from "@/components/radio-field";
import Screen from "@/components/screen";
import Text from "@/components/text";
import TextField from "@/components/text-field";
import { useMedication } from "@/contexts/medication";
import { FORM_META, FORMS, ROUTES } from "@/contexts/medication-draft";
import { db } from "@/db/client";
import { medications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import { Save } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

export default function EditMedicationScreen() {
  const router = useRouter();
  const medication = useMedication();
  const [name, setName] = useState(medication.name);
  const [color, setColor] = useState(medication.color);
  const [form, setForm] = useState(medication.form);
  const [route, setRoute] = useState(medication.route);
  const [notes, setNotes] = useState(medication.notes ?? "");

  const [updating, setUpdating] = useState(false);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await db.update(medications).set({
        name: name,
        color: color,
        form: form,
        route: route,
        notes: notes.trim() ? notes : null
      }).where(eq(medications.id, medication.id));
      router.dismissTo({ pathname: "/(tabs)/medications/[id]", params: { id: medication.id } });
    } catch {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setUpdating(false);
    }

  }

  return (
    <Screen>
      <TextField
        icon={FORM_META[form].icon}
        iconColor={color}
        label="Name"
        placeholder="Your medication's name"
        value={name}
        onChangeText={setName}
      />

      <ColorField
        label="Color"
        value={color}
        onCompleteJS={({ hex }) => setColor(hex)}
      />

      <RadioField
        label="Form"
        onChange={setForm}
        options={FORMS}
        selected={form}
        colorActive={color}
      />

      <RadioField
        label="Route"
        onChange={setRoute}
        options={ROUTES}
        selected={route}
        colorActive={color}
      />

      <TextField
        label="Notes"
        placeholder="Your notes"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <Pressable
        onPress={handleUpdate}
        disabled={updating}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${medication.name}`}
        style={{ backgroundColor: `${color}1a` }}
        className="mt-3 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl"
      >
        {updating ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <>
            <Save size={18} color={color} />
            <Text style={{ color: color }} className="text-base font-semibold">Update {medication.name}</Text>
          </>
        )}
      </Pressable>
    </Screen>
  );
}
