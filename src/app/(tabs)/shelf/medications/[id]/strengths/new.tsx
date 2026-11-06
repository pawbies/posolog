import StrengthFields from "@/components/strength/strength-fields";
import StrengthHeader from "@/components/strength/strength-header";
import { useMedication, useStrengths } from "@/contexts/medication";
import { allIngredients } from "@/db/queries/ingredients";
import { createStrength } from "@/db/queries/strengths";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import { canSaveStrengthDraft, validateStrengthDraft, type StrengthDraft } from "@/lib/strength";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useNavigation, useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { useRef, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function NewStrengthScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const scroll = useScrollInsets(16, 40);
  const medication = useMedication();
  const strengths = useStrengths();

  const { data: ingredients } = useLiveQuery(allIngredients());

  const [draft, setDraft] = useState<StrengthDraft>(() => ({
    unitInUse: "derived_from_medication",
    ingredients: [],
  }));
  const initialUnit = useRef(draft.unitInUse);
  const savingRef = useRef(false);
  const savedRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const canSave = canSaveStrengthDraft(draft) && !saving;
  const dirty = draft.unitInUse !== initialUnit.current || draft.ingredients.length > 0;

  usePreventRemove(dirty && !savedRef.current, ({ data }) => {
    if (savedRef.current) {
      navigation.dispatch(data.action);
      return;
    }

    Alert.alert("Discard strength?", "Your progress will be lost.", [
      { text: "Keep editing", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  const save = () => {
    if (savingRef.current) return;
    const problem = validateStrengthDraft(draft, new Map(ingredients.map((i) => [i.id, i.name])));
    if (problem) {
      Alert.alert("Can't save yet", problem);
      return;
    }
    savingRef.current = true;
    setSaving(true);

    try {
      const position = strengths.reduce((max, s) => Math.max(max, s.position + 1), 0);
      createStrength(medication.id, position, draft);
      savedRef.current = true;
      router.back();
    } catch {
      Alert.alert("Error", "Could not save the strength.");
      savingRef.current = false;
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StrengthHeader
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
        <StrengthFields value={draft} onChange={setDraft} ingredients={ingredients} />
      </ScrollView>
    </View>
  );
}
