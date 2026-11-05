import type { Medication, Strength } from "@/db/schema";
import { createContext, useContext, type ReactNode } from "react";

type MedicationContextValue = {
  medication: Medication;
  strengths: Strength[];
};

const MedicationContext = createContext<MedicationContextValue | null>(null);

export function MedicationProvider({
  medication,
  strengths,
  children,
}: MedicationContextValue & { children: ReactNode }) {
  return (
    <MedicationContext.Provider value={{ medication, strengths }}>
      {children}
    </MedicationContext.Provider>
  );
}

function useMedicationContext() {
  const value = useContext(MedicationContext);
  if (!value) throw new Error("Medication hooks must be used inside MedicationProvider");
  return value;
}

export const useMedication = () => useMedicationContext().medication;
export const useStrengths = () => useMedicationContext().strengths;
