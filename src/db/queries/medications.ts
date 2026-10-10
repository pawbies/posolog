import { db } from "@/db/client";
import { medications } from "@/db/schema";
import type { MedicationDraft } from "@/lib/medication";
import { asc, eq } from "drizzle-orm";

const toRow = (draft: MedicationDraft) => ({
  name: draft.name.trim(),
  color: draft.color,
  form: draft.form,
  route: draft.route,
  notes: draft.notes.trim() ? draft.notes : null,
});

export const allMedications = () =>
  db.select().from(medications).orderBy(asc(medications.name));

export const medicationById = (id: number) =>
  db.select().from(medications).where(eq(medications.id, id)).limit(1);

export const createMedication = (draft: MedicationDraft) =>
  db.insert(medications).values(toRow(draft));

export const updateMedication = (id: number, draft: MedicationDraft) =>
  db.update(medications).set(toRow(draft)).where(eq(medications.id, id));

export const deleteMedication = (id: number) =>
  db.delete(medications).where(eq(medications.id, id));
