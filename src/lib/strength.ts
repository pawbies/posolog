import type { Ingredient, MedicationForm, Strength, StrengthIngredient, StrengthUnit } from "@/db/schema";
import { parseOptionalNumber } from "@/lib/ingredient";
import { FORM_META } from "@/lib/medication";
import { Droplet, Hash, type LucideIcon } from "lucide-react-native";

/** What one of a form is called when it's the unit in use, e.g. "per puff". */
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

/** Lower-case singular name of a strength's unit, resolving "derived_from_medication" via the form. */
export const unitName = (unit: StrengthUnit, form: MedicationForm) =>
  unit === "derived_from_medication" ? FORM_UNIT_NAME[form] : unit === "ml" ? "mL" : "unit";

export const unitIcon = (unit: StrengthUnit, form: MedicationForm): LucideIcon =>
  unit === "derived_from_medication" ? FORM_META[form].icon : unit === "ml" ? Droplet : Hash;

/** Picker options for a medication of the given form. */
export const strengthUnitOptions = (form: MedicationForm) =>
  (["derived_from_medication", "ml", "unit"] as const).map((value) => {
    const name = unitName(value, form);
    return {
      value,
      icon: unitIcon(value, form),
      name: value === "derived_from_medication" ? `Per ${name} (from medication)` : `Per ${name}`,
    };
  });

/** Mass units an ingredient amount can be entered in, with their factor to mg. */
export const MASS_UNITS = {
  g: 1000,
  mg: 1,
  "µg": 0.001,
} as const;
export type MassUnit = keyof typeof MASS_UNITS;
export const MASS_UNIT_OPTIONS = (Object.keys(MASS_UNITS) as MassUnit[]).map((key) => ({ key, label: key }));

export type StrengthIngredientDraft = {
  ingredientId: number;
  displayAmount: string;
  displayUnit: MassUnit;
  /** Fraction of the labelled amount that is free base, e.g. 0.877 for a hydrochloride salt. */
  saltFactor: string;
};

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

/** mg of free base per unitInUse, or null while the inputs are incomplete. */
export const toAmountBase = (draft: StrengthIngredientDraft) => {
  const amount = parseOptionalNumber(draft.displayAmount);
  const factor = parseOptionalNumber(draft.saltFactor);
  if (amount == null || factor == null) return null;
  return amount * MASS_UNITS[draft.displayUnit] * factor;
};

/** Cheap check for enabling the save button; validateStrengthDraft explains what's wrong. */
export const canSaveStrengthDraft = (draft: StrengthDraft) =>
  draft.ingredients.length > 0 &&
  draft.ingredients.every((item) => (parseOptionalNumber(item.displayAmount) ?? 0) > 0);

const isMassUnit = (unit: string): unit is MassUnit => unit in MASS_UNITS;

/** Editable draft of a saved strength. */
export const toStrengthDraft = (strength: StrengthWithIngredients): StrengthDraft => ({
  unitInUse: strength.unitInUse,
  ingredients: strength.ingredients.map((si) => ({
    ingredientId: si.ingredientId,
    displayAmount: String(si.displayAmount),
    displayUnit: isMassUnit(si.displayUnit) ? si.displayUnit : "mg",
    saltFactor: String(si.saltFactor),
  })),
});

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

export type StrengthWithIngredients = Strength & {
  ingredients: (StrengthIngredient & { ingredient: Ingredient })[];
};

const formatNumber = (n: number) => String(Number(n.toFixed(3)));

/** e.g. "500 mg Paracetamol + 30 mg Codeine" */
export const strengthLabel = (strength: StrengthWithIngredients) =>
  strength.ingredients.length
    ? strength.ingredients
        .map((si) => `${formatNumber(si.displayAmount)} ${si.displayUnit} ${si.ingredient.name}`)
        .join(" + ")
    : "No ingredients";

export const formatMg = (mg: number) => `${formatNumber(mg)} mg`;
