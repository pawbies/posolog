import FieldLabel from "@/components/form/field-label";
import NumberField from "@/components/form/number-field";
import PickerField from "@/components/form/picker-field";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import IconBadge from "@/components/ui/icon-badge";
import Pressable from "@/components/ui/pressable";
import Segmented from "@/components/ui/segmented";
import Text from "@/components/ui/text";
import type { Ingredient, Medication } from "@/db/schema";
import { usePalette } from "@/hooks/use-palette";
import {
  emptyStrengthIngredientDraft, formatMg, MASS_UNIT_OPTIONS, strengthUnitOptions, toAmountBase, unitName,
  type StrengthDraft, type StrengthIngredientDraft,
} from "@/lib/strength";
import { useRouter } from "expo-router";
import { Atom, FlaskConical, Percent, Plus, Scale, X } from "lucide-react-native";
import type { Dispatch, SetStateAction } from "react";
import { View } from "react-native";

type StrengthFieldsProps = {
  medication: Medication;
  value: StrengthDraft;
  onChange: Dispatch<SetStateAction<StrengthDraft>>;
  ingredients: Ingredient[];
};

export default function StrengthFields({ medication, value, onChange, ingredients }: StrengthFieldsProps) {
  const router = useRouter();
  const color = medication.color;
  const unitLabel = unitName(value.unitInUse, medication.form);
  const byId = new Map(ingredients.map((i) => [i.id, i]));

  const addIngredient = (ingredient: Ingredient) =>
    onChange((d) => ({ ...d, ingredients: [...d.ingredients, emptyStrengthIngredientDraft(ingredient.id)] }));

  const updateIngredient = (ingredientId: number, patch: Partial<StrengthIngredientDraft>) =>
    onChange((d) => ({
      ...d,
      ingredients: d.ingredients.map((item) => (item.ingredientId === ingredientId ? { ...item, ...patch } : item)),
    }));

  const removeIngredient = (ingredientId: number) =>
    onChange((d) => ({ ...d, ingredients: d.ingredients.filter((item) => item.ingredientId !== ingredientId) }));

  const unused = ingredients.filter((i) => !value.ingredients.some((item) => item.ingredientId === i.id));

  return (
    <>
      <PickerField
        label="Unit in use"
        options={strengthUnitOptions(medication.form)}
        selected={value.unitInUse}
        onChange={(unitInUse) => onChange((d) => ({ ...d, unitInUse }))}
        color={color}
      />

      <Heading size="sm" className="mb-3 ml-2 mt-2">Ingredients</Heading>

      <View className="gap-3">
        {value.ingredients.map((item) => {
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
        <FieldLabel>{value.ingredients.length ? "Add another ingredient" : "Add an ingredient"}</FieldLabel>
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
    </>
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
