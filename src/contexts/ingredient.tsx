import type { Ingredient } from "@/db/schema";
import { createContext, useContext } from "react";

const IngredientContext = createContext<Ingredient | null>(null);
export const IngredientProvider = IngredientContext.Provider;

export function useIngredient() {
  const ingredient = useContext(IngredientContext);
  if (!ingredient) throw new Error("useIngredient must be used inside IngredientProvider");
  return ingredient;
}
