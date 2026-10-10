import type { MedicationDraft } from "@/lib/medication";
import { useColorScheme } from "nativewind";
import { createContext, useContext, useState, type ReactNode } from "react";

type MedicationDraftValue = {
  draft: MedicationDraft;
  update: (patch: Partial<MedicationDraft>) => void;
  reset: () => void;
  dirty: boolean;
};

const MedicationDraftContext = createContext<MedicationDraftValue | null>(null);

export function MedicationDraftProvider({ children }: { children: ReactNode }) {
  const { colorScheme } = useColorScheme();

  const [initial] = useState<MedicationDraft>(() => ({
    name: "",
    color: colorScheme === "dark" ? "#49a6b2" : "#1682ad",
    form: "capsule",
    route: "oral",
    notes: "",
  }));
  const [draft, setDraft] = useState(initial);

  const update = (patch: Partial<MedicationDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const reset = () => setDraft(initial);
  const dirty = (Object.keys(draft) as (keyof MedicationDraft)[]).some((k) => draft[k] !== initial[k]);

  return (
    <MedicationDraftContext.Provider value={{ draft, update, reset, dirty }}>
      {children}
    </MedicationDraftContext.Provider>
  );
}

export function useMedicationDraft() {
  const ctx = useContext(MedicationDraftContext);
  if (!ctx) throw new Error("useMedicationDraft must be used inside MedicationDraftProvider");
  return ctx;
}
