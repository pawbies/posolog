import { ingredientById } from "@/db/queries/ingredients";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useLocalSearchParams } from "expo-router";

// Used inside the ingredient [id] pages, arguably worse than a context but simpler
export function useIngredient() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const ingredientId = Number(id);
  const { data } = useLiveQuery(ingredientById(ingredientId), [ingredientId]);
  return data?.[0];
}
