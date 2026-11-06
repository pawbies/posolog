import { db } from "@/db/client";
import { ingredients, strengthIngredients, strengths } from "@/db/schema";
import { toAmountBase, type StrengthDraft } from "@/lib/strength";
import { asc, eq, inArray } from "drizzle-orm";

export const allStrengthsByMedicationId = (id: number) =>
  db.select().from(strengths).where(eq(strengths.medicationId, id)).orderBy(asc(strengths.position));

export const allStrengthIngredientsByMedicationId = (id: number) =>
  db
    .select({ strengthIngredient: strengthIngredients, ingredient: ingredients })
    .from(strengthIngredients)
    .innerJoin(ingredients, eq(ingredients.id, strengthIngredients.ingredientId))
    .innerJoin(strengths, eq(strengths.id, strengthIngredients.strengthId))
    .where(eq(strengths.medicationId, id))
    .orderBy(asc(ingredients.name));

export const createStrength = (medicationId: number, position: number, draft: StrengthDraft) =>
  db.transaction((tx) => {
    const strength = tx
      .insert(strengths)
      .values({ medicationId, position, unitInUse: draft.unitInUse })
      .returning({ id: strengths.id })
      .get();

    tx.insert(strengthIngredients)
      .values(
        draft.ingredients.map((item) => ({
          strengthId: strength.id,
          ingredientId: item.ingredientId,
          displayAmount: Number(item.displayAmount),
          displayUnit: item.displayUnit,
          saltFactor: Number(item.saltFactor),
          amountBase: toAmountBase(item)!,
        })),
      )
      .run();

    return strength.id;
  });

export const updateStrength = (id: number, draft: StrengthDraft) =>
  db.transaction((tx) => {
    tx.update(strengths).set({ unitInUse: draft.unitInUse }).where(eq(strengths.id, id)).run();

    const existing = tx
      .select({ id: strengthIngredients.id, ingredientId: strengthIngredients.ingredientId })
      .from(strengthIngredients)
      .where(eq(strengthIngredients.strengthId, id))
      .all();
    const keep = new Set(draft.ingredients.map((item) => item.ingredientId));
    const removed = existing.filter((row) => !keep.has(row.ingredientId)).map((row) => row.id);
    if (removed.length) tx.delete(strengthIngredients).where(inArray(strengthIngredients.id, removed)).run();

    for (const item of draft.ingredients) {
      // Drafts are validated before saving, so every number parses.
      const values = {
        displayAmount: Number(item.displayAmount),
        displayUnit: item.displayUnit,
        saltFactor: Number(item.saltFactor),
        amountBase: toAmountBase(item)!,
      };
      const row = existing.find((r) => r.ingredientId === item.ingredientId);
      if (row) tx.update(strengthIngredients).set(values).where(eq(strengthIngredients.id, row.id)).run();
      else tx.insert(strengthIngredients).values({ strengthId: id, ingredientId: item.ingredientId, ...values }).run();
    }
  });

export const deleteStrength = (id: number) =>
  db.delete(strengths).where(eq(strengths.id, id));
