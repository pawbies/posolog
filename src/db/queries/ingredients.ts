import { db } from "@/db/client";
import { ingredients } from "@/db/schema";
import { asc } from "drizzle-orm";

export const allIngredients = () =>
  db.select().from(ingredients).orderBy(asc(ingredients.name));
