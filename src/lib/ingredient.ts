// Functions related to ingredients

import type { Ingredient } from "@/db/schema";

// The draft when creating or editing an ingredient
export type IngredientDraft = {
  name: string;
  notes: string;
  molarMass: string;
  maxPerDay: string;
  therapeuticRangeMin: string;
  therapeuticRangeMax: string;
  toxicThreshold: string;
};

export const emptyIngredientDraft = (): IngredientDraft => ({
  name: "",
  notes: "",
  molarMass: "",
  maxPerDay: "",
  therapeuticRangeMin: "",
  therapeuticRangeMax: "",
  toxicThreshold: "",
});

// Converts an int to a string
const str = (n: number | null) => (n == null ? "" : String(n));

// Converts an ingredient to a draft for editing
export const toIngredientDraft = (i: Ingredient): IngredientDraft => ({
  name: i.name,
  notes: i.notes ?? "",
  molarMass: str(i.molarMass),
  maxPerDay: str(i.maxPerDay),
  therapeuticRangeMin: str(i.therapeuticRangeMin),
  therapeuticRangeMax: str(i.therapeuticRangeMax),
  toxicThreshold: str(i.toxicThreshold),
});

// Converts a string to a number or null if empty
export const parseOptionalNumber = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : null;
};

// Checks if the draft is valid and saveable, returns an error if not
export const validateIngredientDraft = (draft: IngredientDraft): string | null => {
  if (!draft.name.trim()) return "Give the ingredient a name.";
  const min = parseOptionalNumber(draft.therapeuticRangeMin);
  const max = parseOptionalNumber(draft.therapeuticRangeMax);
  if (min != null && max != null && min > max) {
    return "The therapeutic range minimum can't be above the maximum.";
  }
  return null;
};
