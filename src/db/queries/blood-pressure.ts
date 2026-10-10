import { db } from "@/db/client";
import { bloodPressureReadings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export type ReadingDraft = {
  systolic: number;
  diastolic: number;
  pulse: number | undefined;
  readingAt: Date;
};

export const allReadings = () =>
  db.select().from(bloodPressureReadings).orderBy(desc(bloodPressureReadings.readingAt));

export const createReading = (draft: ReadingDraft) =>
  db.insert(bloodPressureReadings).values(draft);

export const updateReading = (id: number, draft: ReadingDraft) =>
  db
    .update(bloodPressureReadings)
    .set({ ...draft, pulse: draft.pulse ?? null })
    .where(eq(bloodPressureReadings.id, id));

export const deleteReading = (id: number) =>
  db.delete(bloodPressureReadings).where(eq(bloodPressureReadings.id, id));
