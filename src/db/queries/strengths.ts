import { db } from "@/db/client";
import { ingredients, strengthIngredients, strengths } from "@/db/schema";
import { toAmountBase, type StrengthDraft } from "@/lib/strength";
import { asc, eq } from "drizzle-orm";

export const allStrengthsByMedicationId = (id: number) =>
  db.select().from(strengths).where(eq(strengths.medicationId, id)).orderBy(asc(strengths.position));

/** Every strength_ingredient row of a medication, joined with its ingredient. */
export const allStrengthIngredientsByMedicationId = (id: number) =>
  db
    .select({ strengthIngredient: strengthIngredients, ingredient: ingredients })
    .from(strengthIngredients)
    .innerJoin(ingredients, eq(ingredients.id, strengthIngredients.ingredientId))
    .innerJoin(strengths, eq(strengths.id, strengthIngredients.strengthId))
    .where(eq(strengths.medicationId, id))
    .orderBy(asc(ingredients.name));

export const createStrength = (medicationId: number, position: number, draft: StrengthDraft) =>
  // The expo-sqlite driver is synchronous, so the transaction body uses run/get.
  db.transaction((tx) => {
    const strength = tx
      .insert(strengths)
      .values({ medicationId, position, unitInUse: draft.unitInUse })
      .returning({ id: strengths.id })
      .get();

    tx.insert(strengthIngredients)
      .values(
        // Drafts are validated before saving, so every number parses.
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

export const deleteStrength = (id: number) =>
  db.delete(strengths).where(eq(strengths.id, id));
