import { db } from "@/db/client";
import { ingredients } from "@/db/schema";
import { parseOptionalNumber, type IngredientDraft } from "@/lib/ingredient";
import { asc, eq } from "drizzle-orm";

const toRow = (draft: IngredientDraft) => ({
  name: draft.name.trim(),
  notes: draft.notes.trim() ? draft.notes : null,
  molarMass: parseOptionalNumber(draft.molarMass),
  maxPerDay: parseOptionalNumber(draft.maxPerDay),
  therapeuticRangeMin: parseOptionalNumber(draft.therapeuticRangeMin),
  therapeuticRangeMax: parseOptionalNumber(draft.therapeuticRangeMax),
  toxicThreshold: parseOptionalNumber(draft.toxicThreshold),
});

export const allIngredients = () =>
  db.select().from(ingredients).orderBy(asc(ingredients.name));

export const ingredientById = (id: number) =>
  db.select().from(ingredients).where(eq(ingredients.id, id)).limit(1);

export const createIngredient = (draft: IngredientDraft) =>
  db.insert(ingredients).values(toRow(draft));

export const updateIngredient = (id: number, draft: IngredientDraft) =>
  db.update(ingredients).set(toRow(draft)).where(eq(ingredients.id, id));

export const deleteIngredient = (id: number) =>
  db.delete(ingredients).where(eq(ingredients.id, id));
