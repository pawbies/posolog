import IngredientFields from "@/components/ingredient/ingredient-fields";
import Text from "@/components/ui/text";
import { createIngredient } from "@/db/queries/ingredients";
import { useContentTopInset } from "@/hooks/use-content-top-inset";
import { usePalette } from "@/hooks/use-palette";
import { emptyIngredientDraft, validateIngredientDraft, type IngredientDraft } from "@/lib/ingredient";
import { Stack, useNavigation, useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { Atom, Save } from "lucide-react-native";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from "react-native";

export default function NewIngredientScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const topInset = useContentTopInset();
  const { tones } = usePalette();
  const accent = tones.lilac;
  const [draft, setDraft] = useState<IngredientDraft>(emptyIngredientDraft);
  const initialDraft = useRef(draft);
  const savingRef = useRef(false);
  const savedRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const canSave = !!draft.name.trim() && !saving;
  const dirty = (Object.keys(draft) as (keyof IngredientDraft)[]).some(
    (key) => draft[key] !== initialDraft.current[key],
  );

  usePreventRemove(dirty && !savedRef.current, ({ data }) => {
    if (savedRef.current) {
      navigation.dispatch(data.action);
      return;
    }

    Alert.alert("Discard ingredient?", "Your progress will be lost.", [
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
    if (savingRef.current) return;
    const problem = validateIngredientDraft(draft);
    if (problem) {
      Alert.alert("Can't save yet", problem);
      return;
    }
    savingRef.current = true;
    setSaving(true);

    try {
      await createIngredient(draft);
      savedRef.current = true;
      router.back();
    } catch (error) {
      const duplicate = String(error).includes("UNIQUE");
      Alert.alert(
        "Error",
        duplicate ? "An ingredient with this name already exists." : "Could not save the ingredient.",
      );
      savingRef.current = false;
      setSaving(false);
    }
  };

  const range =
    draft.therapeuticRangeMin || draft.therapeuticRangeMax
      ? `${draft.therapeuticRangeMin || "?"}–${draft.therapeuticRangeMax || "?"} ng/mL`
      : null;

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          title: "Add ingredient",
          headerTitle: () => (
            <View className="w-52 flex-row items-center gap-2.5">
              <View
                style={{ backgroundColor: `${accent}26` }}
                className="h-9 w-9 items-center justify-center rounded-xl"
              >
                <Atom size={18} color={accent} />
              </View>
              <View className="shrink">
                <Text numberOfLines={1} className="font-display-bold text-base">
                  {draft.name.trim() || "New ingredient"}
                </Text>
                <Text muted numberOfLines={1} className="text-xs">
                  {[draft.molarMass && `${draft.molarMass} g/mol`, range].filter(Boolean).join(" · ") ||
                    "Ingredient"}
                </Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <Pressable
              onPress={save}
              disabled={!canSave}
              accessibilityRole="button"
              accessibilityLabel="Save ingredient"
              hitSlop={8}
              style={{ opacity: canSave ? 1 : 0.4 }}
              className="h-9 w-9 items-center justify-center"
            >
              {saving ? (
                <ActivityIndicator size="small" color={accent} />
              ) : (
                <Save size={22} color={accent} strokeWidth={2.25} />
              )}
            </Pressable>
          ),
        }}
      />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-10 grow"
        contentContainerStyle={{ paddingTop: topInset + 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <IngredientFields value={draft} onChange={update} />
        </View>
      </ScrollView>
    </View>
  );
}
