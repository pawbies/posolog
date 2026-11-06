import MedicationFields from "@/components/medication/medication-fields";
import Text from "@/components/ui/text";
import { createMedication } from "@/db/queries/medications";
import { usePalette } from "@/hooks/use-palette";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { FORM_META, ROUTE_META, type MedicationDraft } from "@/lib/medication";
import { Stack } from "expo-router";
import { Save } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from "react-native";

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
  const FormIcon = FORM_META[draft.form].icon;
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
      <Stack.Screen
        options={{
          title: "Add medication",
          // Live preview of the medication being created.
          // Fixed width so the centered title doesn't shift as the name changes.
          headerTitle: () => (
            <View className="w-52 flex-row items-center gap-2.5">
              <View
                style={{ backgroundColor: `${draft.color}26` }}
                className="h-9 w-9 items-center justify-center rounded-xl"
              >
                <FormIcon size={18} color={draft.color} />
              </View>
              <View className="shrink">
                <Text numberOfLines={1} className="font-display-bold text-base">
                  {draft.name.trim() || "New medication"}
                </Text>
                <Text muted numberOfLines={1} className="text-xs">
                  {FORM_META[draft.form].name} · {ROUTE_META[draft.route].name}
                </Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <Pressable
              onPress={save}
              disabled={!canSave}
              accessibilityRole="button"
              accessibilityLabel="Save medication"
              hitSlop={8}
              style={{ opacity: canSave ? 1 : 0.4 }}
              className="h-9 w-9 items-center justify-center"
            >
              {saving ? (
                <ActivityIndicator size="small" color={draft.color} />
              ) : (
                <Save size={22} color={draft.color} strokeWidth={2.25} />
              )}
            </Pressable>
          ),
        }}
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
