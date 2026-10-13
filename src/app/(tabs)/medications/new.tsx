import MedicationFields from "@/components/medication/medication-fields";
import { createMedication } from "@/db/queries/medications";
import { usePalette } from "@/hooks/use-palette";
import type { MedicationDraft } from "@/lib/medication";
import { Stack, useNavigation, useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { Save } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useRef, useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";

export default function NewMedicationScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { colorScheme } = useColorScheme();
  const { brand } = usePalette();
  const [draft, setDraft] = useState<MedicationDraft>(() => ({
    name: "",
    color: colorScheme === "dark" ? "#49a6b2" : "#1682ad",
    form: "capsule",
    route: "oral",
    notes: "",
  }));
  const initialDraft = useRef(draft);
  const savingRef = useRef(false);
  const savedRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const dirty = (Object.keys(draft) as (keyof MedicationDraft)[]).some(
    (key) => draft[key] !== initialDraft.current[key],
  );

  usePreventRemove(dirty && !savedRef.current, ({ data }) => {
    if (savedRef.current) {
      navigation.dispatch(data.action);
      return;
    }

    Alert.alert("Discard medication?", "Your progress will be lost.", [
      { text: "Keep editing", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  const update = (patch: Partial<MedicationDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const save = async () => {
    if (savingRef.current || !draft.name.trim()) return;
    savingRef.current = true;
    setSaving(true);

    try {
      await createMedication(draft);
      savedRef.current = true;
      router.dismissTo("/medications");
    } catch {
      Alert.alert("Error", "Could not save the medication.");
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Add medication",
          headerRight: () => (
            <Pressable
              onPress={save}
              disabled={!draft.name.trim() || saving}
              accessibilityRole="button"
              accessibilityLabel="Save medication"
              hitSlop={8}
              style={{ opacity: !draft.name.trim() || saving ? 0.4 : 1 }}
            >
              <Save size={22} color={brand} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 py-4 grow"
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
