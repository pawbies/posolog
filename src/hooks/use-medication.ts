import { medicationById } from "@/db/queries/medications";
import { allStrengthIngredientsByMedicationId, allStrengthsByMedicationId } from "@/db/queries/strengths";
import type { StrengthWithIngredients } from "@/lib/strength";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

// Used inside the medication [id] pages, still arguably worse than a context but simpler
// Also includes strength data
export function useMedication() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const medicationId = Number(id);

  const { data } = useLiveQuery(medicationById(medicationId), [medicationId]);
  const { data: strengthRows, updatedAt } = useLiveQuery(allStrengthsByMedicationId(medicationId), [medicationId]);
  const { data: ingredientRows } = useLiveQuery(
    allStrengthIngredientsByMedicationId(medicationId),
    [medicationId, updatedAt],
  );

  const strengths = useMemo<StrengthWithIngredients[]>(
    () =>
      strengthRows.map((strength) => ({
        ...strength,
        ingredients: ingredientRows
          .filter((row) => row.strengthIngredient.strengthId === strength.id)
          .map((row) => ({ ...row.strengthIngredient, ingredient: row.ingredient })),
      })),
    [strengthRows, ingredientRows],
  );

  return { medication: data?.[0], strengths };
}
