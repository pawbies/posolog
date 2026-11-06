import StrengthFields from "@/components/strength/strength-fields";
import StrengthHeader from "@/components/strength/strength-header";
import { useStrengths } from "@/contexts/medication";
import { allIngredients } from "@/db/queries/ingredients";
import { updateStrength } from "@/db/queries/strengths";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import {
  canSaveStrengthDraft, toStrengthDraft, validateStrengthDraft, type StrengthDraft, type StrengthWithIngredients,
} from "@/lib/strength";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { useEffect, useRef, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

export default function EditStrengthScreen() {
  const router = useRouter();
  const { strengthId } = useLocalSearchParams<{ strengthId: string }>();
  const strength = useStrengths().find((s) => s.id === Number(strengthId));

  useEffect(() => {
    if (!strength) router.back();
  }, [strength, router]);

  if (!strength) return null;
  return <EditStrengthForm strength={strength} />;
}

function EditStrengthForm({ strength }: { strength: StrengthWithIngredients }) {
  const router = useRouter();
  const navigation = useNavigation();
  const scroll = useScrollInsets(16, 40);

  const { data: ingredients } = useLiveQuery(allIngredients());

  const [draft, setDraft] = useState<StrengthDraft>(() => toStrengthDraft(strength));
  const [initialDraft] = useState(() => JSON.stringify(draft));
  const savingRef = useRef(false);
  const savedRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(draft) !== initialDraft;
  const canSave = dirty && canSaveStrengthDraft(draft) && !saving;

  usePreventRemove(dirty && !savedRef.current, ({ data }) => {
    if (savedRef.current) {
      navigation.dispatch(data.action);
      return;
    }

    Alert.alert("Discard changes?", "Your edits to this strength will be lost.", [
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
      updateStrength(strength.id, draft);
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
        fallbackTitle="Edit strength"
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
