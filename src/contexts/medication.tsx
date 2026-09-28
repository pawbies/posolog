import { medications } from "@/db/schema";
import { createContext, useContext } from "react";

type Medication = typeof medications.$inferSelect;

const MedicationContext = createContext<Medication | null>(null);
export const MedicationProvider = MedicationContext.Provider;

export function useMedication() {
  const medication = useContext(MedicationContext);
  if (!medication) throw new Error("Must be used inside the provider");
  return medication;
}
