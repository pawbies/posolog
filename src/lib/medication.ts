import type { Medication, MedicationForm, MedicationRoute } from "@/db/schema";
import {
  ArrowDownToLine, Bandage, Cigarette, CircleSmall, Droplets, Layers2, MoreHorizontal, Pill, Smile,
  SoapDispenserDroplet, SprayCan, Syringe, Tablets, Wind, type LucideIcon,
} from "lucide-react-native";

type Meta = { icon: LucideIcon; name: string };

export const FORM_META: Record<MedicationForm, Meta> = {
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

export const ROUTE_META: Record<MedicationRoute, Meta> = {
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

const toOptions = <T extends string>(meta: Record<T, Meta>) =>
  (Object.entries(meta) as [T, Meta][]).map(([value, m]) => ({ value, ...m }));

export const FORMS = toOptions(FORM_META);
export const ROUTES = toOptions(ROUTE_META);


export type MedicationDraft = {
  name: string;
  color: string;
  form: MedicationForm;
  route: MedicationRoute;
  notes: string;
};

export const toDraft = (m: Medication): MedicationDraft => ({
  name: m.name,
  color: m.color,
  form: m.form,
  route: m.route,
  notes: m.notes ?? "",
});
