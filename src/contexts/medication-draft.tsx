import { medications } from "@/db/schema";
import { ArrowDownToLine, Bandage, Cigarette, CircleSmall, Droplets, Layers2, LucideIcon, MoreHorizontal, Pill, Smile, SoapDispenserDroplet, SprayCan, Syringe, Tablets, Wind } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import {
  createContext, useCallback,
  useContext,
  useMemo, useRef, useState,
  type ReactNode
} from "react";

type Form = (typeof medications.$inferInsert)["form"];
type Route = (typeof medications.$inferInsert)["route"];

export const FORM_META: Record<Form, { icon: LucideIcon; name: string }> = {
  capsule:     { icon: Pill, name: "Capsule" },
  tablet:      { icon: Tablets, name: "Tablet" },
  injection:   { icon: Syringe, name: "Injection" },
  patch:       { icon: Bandage, name: "Patch" },
  gel:         { icon: Droplets, name: "Gel" },
  creme:       { icon: SoapDispenserDroplet, name: "Creme" },
  spray:       { icon: SprayCan, name: "Spray" },
  inhaler:     { icon: Cigarette, name: "Inhaler" },
  suppository: { icon: CircleSmall, name: "Suppository" },
  other:       { icon: MoreHorizontal, name: "Other" },
};

export const FORMS = (Object.entries(FORM_META) as [Form, { icon: LucideIcon; name: string }][])
  .map(([value, meta]) => ({ value, ...meta }));

export const ROUTE_META: Record<Route, { icon: LucideIcon; name: string }> = {
  oral:        { icon: Pill, name: "Oral" },
  sublingual:  { icon: ArrowDownToLine, name: "Sublingual" },
  buccal:      { icon: Smile, name: "Buccal" },
  rectal:      { icon: CircleSmall, name: "Rectal" },
  iv:          { icon: Droplets, name: "IV" },
  im:          { icon: Syringe, name: "IM" },
  scsq:        { icon: Layers2, name: "SC/SQ" },
  transdermal: { icon: Bandage, name: "Transdermal" },
  inhaled:     { icon: Wind, name: "Inhaled" },
  nasal:       { icon: SprayCan, name: "Nasal" },
  other:       { icon: MoreHorizontal, name: "Other" },
};

export const ROUTES = (Object.entries(ROUTE_META) as [Route, { icon: LucideIcon; name: string }][])
  .map(([value, meta]) => ({ value, ...meta }));

export type MedicationDraft = {
  name: string;
  color: string;
  form: Form;
  route: Route;
  notes: string;
};

type Value = {
  draft: MedicationDraft;
  update: (patch: Partial<MedicationDraft>) => void;
  reset: () => void;
  dirty: boolean;
};

const MedicationDraftContext = createContext<Value | null>(null);

export function MedicationDraftProvider({ children }: { children: ReactNode }) {
  const { colorScheme } = useColorScheme();

  const initial = useRef<MedicationDraft>({
    name: "",
    color: colorScheme === "dark" ? "#49a6b2" : "#1682ad",
    form: "capsule",
    route: "oral",
    notes: ""
  }).current;

  const [draft, setDraft] = useState(initial);

  const update = useCallback(
    (patch: Partial<MedicationDraft>) => setDraft((d) => ({ ...d, ...patch })),
    []
  );

  const reset = useCallback(() => setDraft(initial), [initial]);

  const dirty = useMemo(
    () => (Object.keys(draft) as (keyof MedicationDraft)[])
      .some((k) => draft[k] !== initial[k]),
    [draft, initial]
  );

  const value = useMemo(
    () => ({ draft, update, reset, dirty }),
    [draft, update, reset, dirty]
  );

  return (
    <MedicationDraftContext.Provider value={value}>
      {children}
    </MedicationDraftContext.Provider>
  );
}

export function useMedicationDraft() {
  const ctx = useContext(MedicationDraftContext);
  if (!ctx) throw new Error("Must be used inside the provider");
  return ctx;
}
