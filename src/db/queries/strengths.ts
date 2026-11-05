import { db } from "@/db/client";
import { strengths } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export const allStrengthsByMedicationId = (id: number) =>
  db.select().from(strengths).where(eq(strengths.medicationId, id)).orderBy(asc(strengths.position));
