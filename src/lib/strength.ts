// Functions related to medication strengths

import type { Ingredient, MedicationForm, Strength, StrengthIngredient, StrengthUnit } from "@/db/schema";
import { parseOptionalNumber } from "@/lib/ingredient";
import { FORM_META } from "@/lib/medication";
import { Droplet, Hash, type LucideIcon } from "lucide-react-native";

// How the name of the form translates to the unit name for derived_from_medication strengths
const FORM_UNIT_NAME: Record<MedicationForm, string> = {
  capsule: "capsule",
  tablet: "tablet",
  injection: "injection",
  patch: "patch",
  gel: "application",
  creme: "application",
  spray: "spray",
  inhaler: "puff",
  suppository: "suppository",
  other: "dose",
};

export const unitName = (unit: StrengthUnit, form: MedicationForm) => {
  switch (unit) {
    case "derived_from_medication":
      return FORM_UNIT_NAME[form];
    case "ml":
      return "mL";
    case "unit":
      return "unit";
    default:
      throw new Error(`Unknown strength unit: ${unit}`);
  }
}

export const unitIcon = (unit: StrengthUnit, form: MedicationForm): LucideIcon => {
  switch (unit) {
    case "derived_from_medication":
      return FORM_META[form].icon;
    case "ml":
      return Droplet;
    case "unit":
      return Hash;
    default:
      throw new Error(`Unknown strength unit: ${unit}`);
  }
}

// The options for the units that can be used in a form
export const strengthUnitOptions = (form: MedicationForm) =>
  (["derived_from_medication", "ml", "unit"] as const).map((value) => {
    const name = unitName(value, form);
    return {
      value,
      icon: unitIcon(value, form),
      name: value === "derived_from_medication" ? `Per ${name} (from medication)` : `Per ${name}`,
    };
  });


// Values of mass units to convert between them
export const MASS_UNITS = {
  g: 1000,
  mg: 1,
  "µg": 0.001,
} as const;
export type MassUnit = keyof typeof MASS_UNITS;
export const MASS_UNIT_OPTIONS = (Object.keys(MASS_UNITS) as MassUnit[]).map((key) => ({ key, label: key }));

// Draft when creating or editing a strength ingredient
export type StrengthIngredientDraft = {
  ingredientId: number;
  displayAmount: string;
  displayUnit: MassUnit;
  saltFactor: string;
};

// Draft when creating or editing a strength
export type StrengthDraft = {
  unitInUse: StrengthUnit;
  ingredients: StrengthIngredientDraft[];
};

export const emptyStrengthIngredientDraft = (ingredientId: number): StrengthIngredientDraft => ({
  ingredientId,
  displayAmount: "",
  displayUnit: "mg",
  saltFactor: "1",
});

// Calculate the real mg amount using the salt factor
export const toAmountBase = (draft: StrengthIngredientDraft) => {
  const amount = parseOptionalNumber(draft.displayAmount);
  const factor = parseOptionalNumber(draft.saltFactor);
  if (amount == null || factor == null) return null;
  return amount * MASS_UNITS[draft.displayUnit] * factor;
};

// Quick the if the draft is valid
export const canSaveStrengthDraft = (draft: StrengthDraft) =>
  draft.ingredients.length > 0 &&
  draft.ingredients.every((item) => (parseOptionalNumber(item.displayAmount) ?? 0) > 0);

// Check if a unit is a valid mass unit
const isMassUnit = (unit: string): unit is MassUnit => unit in MASS_UNITS;


// Convert a strength to a draft for editing
export const toStrengthDraft = (strength: StrengthWithIngredients): StrengthDraft => ({
  unitInUse: strength.unitInUse,
  ingredients: strength.ingredients.map((si) => ({
    ingredientId: si.ingredientId,
    displayAmount: String(si.displayAmount),
    displayUnit: isMassUnit(si.displayUnit) ? si.displayUnit : "mg",
    saltFactor: String(si.saltFactor),
  })),
});

// Validates the strength draft and returns an error message if invalid
export const validateStrengthDraft =(draft: StrengthDraft, names: Map<number, string>): string | null => {
  if (draft.ingredients.length === 0) return "Add at least one ingredient.";
  for (const item of draft.ingredients) {
    const name = names.get(item.ingredientId) ?? "an ingredient";
    const amount = parseOptionalNumber(item.displayAmount);
    if (amount == null || amount <= 0) return `Enter an amount above zero for ${name}.`;
    const factor = parseOptionalNumber(item.saltFactor);
    if (factor == null || factor <= 0 || factor > 1) return `The salt factor for ${name} must be above 0 and at most 1.`;
  }
  return null;
};

// The type for a strength combined with its ingredients
export type StrengthWithIngredients = Strength & {
  ingredients: (StrengthIngredient & { ingredient: Ingredient })[];
};

const formatNumber = (n: number) => String(Number(n.toFixed(3)));

// The label for a strength, e.g. "5 mg Paracetamol + 2 mg Caffeine"
export const strengthLabel = (strength: StrengthWithIngredients) =>
  strength.ingredients.length
    ? strength.ingredients
        .map((si) => `${formatNumber(si.displayAmount)} ${si.displayUnit} ${si.ingredient.name}`)
        .join(" + ")
    : "No ingredients";

export const formatMg = (mg: number) => `${formatNumber(mg)} mg`;
