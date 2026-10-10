import type { Medication } from "@/db/schema";
import { createContext, useContext } from "react";

const MedicationContext = createContext<Medication | null>(null);
export const MedicationProvider = MedicationContext.Provider;

export function useMedication() {
  const medication = useContext(MedicationContext);
  if (!medication) throw new Error("useMedication must be used inside MedicationProvider");
  return medication;
}
