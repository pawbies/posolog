import FieldLabel from "@/components/form/field-label";
import NumberField from "@/components/form/number-field";
import PickerField from "@/components/form/picker-field";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import IconBadge from "@/components/ui/icon-badge";
import Pressable from "@/components/ui/pressable";
import Segmented from "@/components/ui/segmented";
import Text from "@/components/ui/text";
import { useMedication, useStrengths } from "@/contexts/medication";
import { allIngredients } from "@/db/queries/ingredients";
import { createStrength } from "@/db/queries/strengths";
import type { Ingredient } from "@/db/schema";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import { usePalette } from "@/hooks/use-palette";
import { parseOptionalNumber } from "@/lib/ingredient";
import {
  emptyStrengthIngredientDraft, formatMg, MASS_UNIT_OPTIONS, strengthUnitOptions, toAmountBase, unitIcon, unitName,
  validateStrengthDraft, type StrengthDraft, type StrengthIngredientDraft,
} from "@/lib/strength";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useNavigation, useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { Atom, FlaskConical, Percent, Plus, Save, Scale, X } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

export default function NewStrengthScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const scroll = useScrollInsets(16, 40);
  const medication = useMedication();
  const strengths = useStrengths();
  const color = medication.color;

  const { data: ingredients } = useLiveQuery(allIngredients());
  const byId = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);

  const [draft, setDraft] = useState<StrengthDraft>(() => ({
    unitInUse: "derived_from_medication",
    ingredients: [],
  }));
  const initialUnit = useRef(draft.unitInUse);
  const savingRef = useRef(false);
  const savedRef = useRef(false);
  const [saving, setSaving] = useState(false);
  const allAmountsSet = draft.ingredients.every((item) => (parseOptionalNumber(item.displayAmount) ?? 0) > 0);
  const canSave = draft.ingredients.length > 0 && allAmountsSet && !saving;
  const dirty = draft.unitInUse !== initialUnit.current || draft.ingredients.length > 0;
  const unitLabel = unitName(draft.unitInUse, medication.form);
  const UnitIcon = unitIcon(draft.unitInUse, medication.form);

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

  const addIngredient = (ingredient: Ingredient) =>
    setDraft((d) => ({ ...d, ingredients: [...d.ingredients, emptyStrengthIngredientDraft(ingredient.id)] }));

  const updateIngredient = (ingredientId: number, patch: Partial<StrengthIngredientDraft>) =>
    setDraft((d) => ({
      ...d,
      ingredients: d.ingredients.map((item) => (item.ingredientId === ingredientId ? { ...item, ...patch } : item)),
    }));

  const removeIngredient = (ingredientId: number) =>
    setDraft((d) => ({ ...d, ingredients: d.ingredients.filter((item) => item.ingredientId !== ingredientId) }));

  const unused = ingredients.filter((i) => !draft.ingredients.some((item) => item.ingredientId === i.id));

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

  const summary = draft.ingredients
    .map((item) => {
      const name = byId.get(item.ingredientId)?.name ?? "?";
      return item.displayAmount ? `${item.displayAmount} ${item.displayUnit} ${name}` : name;
    })
    .join(" + ");

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View className="w-52 flex-row items-center gap-2.5">
              <View
                style={{ backgroundColor: `${color}26` }}
                className="h-9 w-9 items-center justify-center rounded-xl"
              >
                <UnitIcon size={18} color={color} />
              </View>
              <View className="shrink">
                <Text numberOfLines={1} className="font-display-bold text-base">
                  {summary || "New strength"}
                </Text>
                <Text muted numberOfLines={1} className="text-xs">
                  {medication.name} · per {unitLabel}
                </Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <Pressable
              onPress={save}
              disabled={!canSave}
              accessibilityRole="button"
              accessibilityLabel="Save strength"
              hitSlop={8}
              style={{ opacity: canSave ? 1 : 0.4 }}
              className="h-9 w-9 items-center justify-center"
            >
              {saving ? (
                <ActivityIndicator size="small" color={color} />
              ) : (
                <Save size={22} color={color} strokeWidth={2.25} />
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
        <PickerField
          label="Unit in use"
          options={strengthUnitOptions(medication.form)}
          selected={draft.unitInUse}
          onChange={(unitInUse) => setDraft((d) => ({ ...d, unitInUse }))}
          color={color}
        />

        <Heading size="sm" className="mb-3 ml-2 mt-2">Ingredients</Heading>

        <View className="gap-3">
          {draft.ingredients.map((item) => {
            const ingredient = byId.get(item.ingredientId);
            if (!ingredient) return null;
            return (
              <IngredientEditor
                key={item.ingredientId}
                ingredient={ingredient}
                value={item}
                unitName={unitLabel}
                color={color}
                onChange={(patch) => updateIngredient(item.ingredientId, patch)}
                onRemove={() => removeIngredient(item.ingredientId)}
              />
            );
          })}
        </View>

        <View className="mt-4">
          <FieldLabel>{draft.ingredients.length ? "Add another ingredient" : "Add an ingredient"}</FieldLabel>
          <View className="flex-row flex-wrap gap-2">
            {unused.map((ingredient) => (
              <Pressable
                key={ingredient.id}
                onPress={() => addIngredient(ingredient)}
                accessibilityRole="button"
                accessibilityLabel={`Add ${ingredient.name}`}
                className="flex-row items-center gap-1.5 rounded-full px-4 py-2.5"
                style={{ backgroundColor: `${color}1a` }}
              >
                <Plus size={16} color={color} strokeWidth={2.75} />
                <Text className="font-display-bold text-sm" style={{ color }}>{ingredient.name}</Text>
              </Pressable>
            ))}
          </View>
          {ingredients.length === 0 ? (
            <Text muted className="mb-3 ml-2 text-sm leading-5">
              You don't have any ingredients yet. Create one first, then come back to add it here.
            </Text>
          ) : null}
          <Button
            label="Create new ingredient"
            icon={FlaskConical}
            variant="secondary"
            className="mt-3"
            onPress={() => router.push("/shelf/ingredients/new")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

type IngredientEditorProps = {
  ingredient: Ingredient;
  value: StrengthIngredientDraft;
  unitName: string;
  color: string;
  onChange: (patch: Partial<StrengthIngredientDraft>) => void;
  onRemove: () => void;
};

function IngredientEditor({ ingredient, value, unitName, color, onChange, onRemove }: IngredientEditorProps) {
  const { muted, tones } = usePalette();
  const base = toAmountBase(value);

  return (
    <View className="rounded-[24px] border-2 border-border bg-surface p-3.5 pb-0">
      <View className="mb-4 flex-row items-center">
        <IconBadge icon={Atom} tone="lilac" size="sm" />
        <Text className="ml-3 flex-1 font-display-bold text-lg" numberOfLines={1}>{ingredient.name}</Text>
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Remove ${ingredient.name}`}
          className="h-9 w-9 items-center justify-center rounded-full"
        >
          <X size={20} color={muted} strokeWidth={2.5} />
        </Pressable>
      </View>

      <NumberField
        decimal
        icon={Scale}
        iconColor={color}
        iconSize={18}
        label={`Amount per ${unitName}`}
        placeholder="500"
        unit={value.displayUnit}
        value={value.displayAmount}
        onChangeText={(displayAmount) => onChange({ displayAmount })}
      />

      <Segmented
        options={MASS_UNIT_OPTIONS}
        value={value.displayUnit}
        onChange={(displayUnit) => onChange({ displayUnit })}
        className="-mt-2 mb-5"
      />

      <NumberField
        decimal
        icon={Percent}
        iconColor={tones.lilac}
        iconSize={18}
        label="Salt factor (free-base fraction)"
        placeholder="1"
        value={value.saltFactor}
        onChangeText={(saltFactor) => onChange({ saltFactor })}
      />

      <Text muted className="-mt-3 mb-4 ml-2 text-xs leading-4">
        {base != null ? `= ${formatMg(base)} free base per ${unitName}. ` : ""}
        Use 1 if the label amount is already the free base.
      </Text>
    </View>
  );
}
