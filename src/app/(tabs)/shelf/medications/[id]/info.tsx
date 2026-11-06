import SingleDoseChart, { type SingleDosePoint } from "@/components/medication/single-dose-chart";
import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import {
  absorptionModels,
  absorptionPhases,
  dispositionModels,
  ingredients,
  strengthIngredients,
  strengths,
} from "@/db/schema";
import { useMedication } from "@/hooks/use-medication";
import { FORM_META, ROUTE_META } from "@/lib/medication";
import { unitName } from "@/lib/strength";
import {
  Activity,
  Atom,
  FlaskConical,
  GitBranch,
  Layers,
  LineChart,
  ShieldAlert,
  Timer,
  type LucideIcon,
} from "lucide-react-native";
import { useMemo, type ReactNode } from "react";
import { View } from "react-native";

type Ingredient = Pick<typeof ingredients.$inferSelect,
  "id" | "name" | "notes" | "molarMass" | "parentIngredientId" | "maxPerDay" |
  "therapeuticRangeMin" | "therapeuticRangeMax" | "toxicThreshold">;
type Disposition = Pick<typeof dispositionModels.$inferSelect,
  "ingredientId" | "name" | "source" | "compartmentModel" | "parameterBasis" |
  "fBasisPercent" | "v1" | "v2" | "v3" | "cl" | "q2" | "q3">;
type Strength = Pick<typeof strengths.$inferSelect, "id" | "unitInUse">;
type StrengthIngredient = Pick<typeof strengthIngredients.$inferSelect,
  "ingredientId" | "amountBase" | "displayAmount" | "displayUnit" | "saltFactor">;
type Absorption = Pick<typeof absorptionModels.$inferSelect, "name" | "source" | "fPercent">;
type Phase = Pick<typeof absorptionPhases.$inferSelect,
  "position" | "kind" | "fractionPercent" | "kA" | "tLag" | "inputDuration">;

const INGREDIENTS: Ingredient[] = [
  {
    id: 1,
    name: "Lisdexamfetamine",
    notes: "Inactive prodrug, cleaved in red blood cells to dextroamphetamine.",
    molarMass: 263.38,
    parentIngredientId: null,
    maxPerDay: 70,
    therapeuticRangeMin: null,
    therapeuticRangeMax: null,
    toxicThreshold: null,
  },
  {
    id: 2,
    name: "Dextroamphetamine",
    notes: "Active metabolite responsible for the clinical effect.",
    molarMass: 135.21,
    parentIngredientId: 1,
    maxPerDay: null,
    therapeuticRangeMin: 20,
    therapeuticRangeMax: 100,
    toxicThreshold: 200,
  },
];

const DISPOSITION: Disposition[] = [
  {
    ingredientId: 1,
    name: "Adult, fasted",
    source: "Placeholder",
    compartmentModel: "one",
    parameterBasis: "apparent",
    fBasisPercent: null,
    v1: 100, v2: null, v3: null,
    cl: 90, q2: null, q3: null,
  },
  {
    ingredientId: 2,
    name: "Adult",
    source: "Placeholder",
    compartmentModel: "two",
    parameterBasis: "systemic",
    fBasisPercent: 100,
    v1: 150, v2: 100, v3: null,
    cl: 18, q2: 30, q3: null,
  },
];

const STRENGTH: Strength = { id: 1, unitInUse: "derived_from_medication" };

const STRENGTH_INGREDIENTS: StrengthIngredient[] = [
  { ingredientId: 1, displayAmount: 30, displayUnit: "mg dimesylate", saltFactor: 0.578, amountBase: 17.34 },
];

const ABSORPTION: Absorption = { name: "Oral capsule", source: "Placeholder", fPercent: 96 };

const PHASES: Phase[] = [
  { position: 0, kind: "first_order", fractionPercent: 100, kA: 2.0, tLag: 0.25, inputDuration: null },
];

// ---------------------------------------------------------------------------
// Derived PK values
// ---------------------------------------------------------------------------

/** Terminal half-life (h) from clearance / volume parameters. */
function terminalHalfLife(d: Disposition): number {
  const k10 = d.cl / d.v1;
  if (d.compartmentModel === "one" || d.v2 == null || d.q2 == null) return Math.LN2 / k10;

  // Two-compartment: β is the smaller root of λ² − (k10+k12+k21)λ + k10·k21 = 0.
  // (Three-compartment falls back to the two-compartment estimate for the placeholder.)
  const k12 = d.q2 / d.v1;
  const k21 = d.q2 / d.v2;
  const a = k10 + k12 + k21;
  const beta = (a - Math.sqrt(a * a - 4 * k10 * k21)) / 2;
  return Math.LN2 / beta;
}

function simulateSingleDose(hours = 24, dt = 0.01, sampleEvery = 0.25): SingleDosePoint[] {
  const [prodrug, active] = INGREDIENTS;
  const pro = DISPOSITION.find((d) => d.ingredientId === prodrug.id)!;
  const act = DISPOSITION.find((d) => d.ingredientId === active.id)!;
  const phase = PHASES[0];
  const dose = STRENGTH_INGREDIENTS[0].amountBase * (ABSORPTION.fPercent / 100);
  const ratio = (active.molarMass ?? 1) / (prodrug.molarMass ?? 1);

  const ka = phase.kA ?? 1;
  const kPro = pro.cl / pro.v1;
  const k10 = act.cl / act.v1;
  const k12 = (act.q2 ?? 0) / act.v1;
  const k21 = act.v2 ? (act.q2 ?? 0) / act.v2 : 0;

  let gut = dose, aPro = 0, a1 = 0, a2 = 0;
  const out: SingleDosePoint[] = [];
  const stride = Math.round(sampleEvery / dt);

  for (let i = 0; i <= Math.round(hours / dt); i++) {
    const t = i * dt;
    if (i % stride === 0) {
      out.push({ t, prodrug: (aPro / pro.v1) * 1000, active: (a1 / act.v1) * 1000 });
    }
    const absorbed = t >= phase.tLag ? ka * gut : 0;
    const converted = kPro * aPro;
    gut -= absorbed * dt;
    aPro += (absorbed - converted) * dt;
    const d1 = converted * ratio - (k10 + k12) * a1 + k21 * a2;
    const d2 = k12 * a1 - k21 * a2;
    a1 += d1 * dt;
    a2 += d2 * dt;
  }
  return out;
}

const vss = (d: Disposition) => d.v1 + (d.v2 ?? 0) + (d.v3 ?? 0);

const fmt = (n: number, digits = 1) =>
  Number.isInteger(n) ? String(n) : n.toFixed(digits);

const COMPARTMENTS = { one: "1-compartment", two: "2-compartment", three: "3-compartment" };
const PHASE_KIND = { first_order: "First-order", zero_order: "Zero-order" };

function Section({ icon: Icon, title, color, children }: {
  icon: LucideIcon; title: string; color: string; children: ReactNode;
}) {
  return (
    <Card className="mt-4">
      <View className="flex-row items-center gap-2">
        <Icon size={18} color={color} strokeWidth={2.5} />
        <Heading size="sm" className="flex-1" numberOfLines={1}>{title}</Heading>
      </View>
      <View className="mt-3">{children}</View>
    </Card>
  );
}

function Row({ label, value, first = false }: { label: string; value: ReactNode; first?: boolean }) {
  return (
    <View className={`flex-row items-center py-3 ${first ? "" : "border-t-2 border-border"}`}>
      <Text muted className="flex-1 text-sm">{label}</Text>
      {typeof value === "string" ? <Text className="text-sm font-medium">{value}</Text> : value}
    </View>
  );
}

function Stat({ label, value, unit, color }: { label: string; value: string; unit?: string; color: string }) {
  return (
    <View className="flex-1 rounded-[20px] p-3.5" style={{ backgroundColor: `${color}14` }}>
      <Text muted className="text-xs font-medium">{label}</Text>
      <Text className="mt-1 font-display-bold text-xl" style={{ color }}>
        {value}
        {unit ? <Text muted className="text-xs font-normal"> {unit}</Text> : null}
      </Text>
    </View>
  );
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <View className="rounded-full px-3 py-1" style={{ backgroundColor: `${color}1a` }}>
      <Text className="text-xs font-semibold" style={{ color }}>{label}</Text>
    </View>
  );
}

function IngredientCard({ ingredient, color }: { ingredient: Ingredient; color: string }) {
  const disposition = DISPOSITION.find((d) => d.ingredientId === ingredient.id);
  const parent = INGREDIENTS.find((i) => i.id === ingredient.parentIngredientId);
  const range =
    ingredient.therapeuticRangeMin != null && ingredient.therapeuticRangeMax != null
      ? `${fmt(ingredient.therapeuticRangeMin)}–${fmt(ingredient.therapeuticRangeMax)} ng/mL`
      : "—";

  return (
    <Section icon={Atom} title={ingredient.name} color={color}>
      {parent ? (
        <View className="mb-3 flex-row items-center gap-1.5">
          <GitBranch size={14} color={color} />
          <Text muted className="text-xs">Metabolite of {parent.name}</Text>
        </View>
      ) : null}

      {ingredient.notes ? <Text className="mb-3 text-sm leading-5">{ingredient.notes}</Text> : null}

      {disposition ? (
        <>
          <View className="flex-row gap-2">
            <Stat label="t½" value={fmt(terminalHalfLife(disposition))} unit="h" color={color} />
            <Stat label="CL" value={fmt(disposition.cl)} unit="L/h" color={color} />
            <Stat label="Vss" value={fmt(vss(disposition))} unit="L" color={color} />
          </View>

          <View className="mt-3 flex-row flex-wrap gap-1.5">
            <Chip label={COMPARTMENTS[disposition.compartmentModel]} color={color} />
            <Chip label={disposition.parameterBasis === "apparent" ? "Apparent (CL/F)" : "Systemic"} color={color} />
            {disposition.fBasisPercent != null ? <Chip label={`F basis ${disposition.fBasisPercent}%`} color={color} /> : null}
          </View>

          <View className="mt-2">
            <Row first label="V1 (central)" value={`${fmt(disposition.v1)} L`} />
            {disposition.v2 != null ? <Row label="V2 (peripheral)" value={`${fmt(disposition.v2)} L`} /> : null}
            {disposition.q2 != null ? <Row label="Q2 (inter-compartmental)" value={`${fmt(disposition.q2)} L/h`} /> : null}
            {disposition.v3 != null ? <Row label="V3" value={`${fmt(disposition.v3)} L`} /> : null}
            {disposition.q3 != null ? <Row label="Q3" value={`${fmt(disposition.q3)} L/h`} /> : null}
            <Row label="Molar mass" value={ingredient.molarMass ? `${fmt(ingredient.molarMass, 2)} g/mol` : "—"} />
            <Row label="Max per day" value={ingredient.maxPerDay ? `${fmt(ingredient.maxPerDay)} mg` : "—"} />
          </View>
          {disposition.name || disposition.source ? (
            <Text muted className="mt-2 text-[11px]">
              Model: {disposition.name ?? "Unnamed"}{disposition.source ? ` · ${disposition.source}` : ""}
            </Text>
          ) : null}
        </>
      ) : (
        <Text muted className="text-sm">No disposition model yet.</Text>
      )}

      {ingredient.therapeuticRangeMin != null || ingredient.toxicThreshold != null ? (
        <View className="mt-3 rounded-[20px] p-3.5" style={{ backgroundColor: `${color}0d` }}>
          <View className="flex-row items-center gap-1.5">
            <ShieldAlert size={16} color={color} strokeWidth={2.5} />
            <Text className="font-display-medium text-sm">Concentration targets</Text>
          </View>
          <Row first label="Therapeutic range" value={range} />
          <Row
            label="Toxic threshold"
            value={ingredient.toxicThreshold != null ? `${fmt(ingredient.toxicThreshold)} ng/mL` : "—"}
          />
        </View>
      ) : null}
    </Section>
  );
}

export default function MedicationInfoScreen() {
  const { medication } = useMedication();
  const curve = useMemo(() => simulateSingleDose(), []);
  if (!medication) return null;

  const color = medication.color;
  const form = FORM_META[medication.form];
  const strengthUnit = unitName(STRENGTH.unitInUse, medication.form);
  const route = ROUTE_META[medication.route];
  const active = INGREDIENTS[1];

  return (
    <Screen>
      <View className="mt-2">
        <Heading size="xl">{medication.name}</Heading>
        <View className="mt-2 flex-row">
          <View className="rounded-full bg-tint-cream px-3 py-1">
            <Text className="text-xs font-semibold">Placeholder data</Text>
          </View>
        </View>
      </View>

      <Section icon={Layers} title="Overview" color={color}>
        <Row first label="Form" value={form.name} />
        <Row label="Route" value={route.name} />
        <Row label="Unit in use" value={strengthUnit} />
        <Row
          label="Color"
          value={
            <View className="flex-row items-center gap-2">
              <View className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
              <Text className="text-sm font-medium">{color.toUpperCase()}</Text>
            </View>
          }
        />
      </Section>

      <Section icon={LineChart} title="Single dose · plasma curve" color={color}>
        <SingleDoseChart
          data={curve}
          color={color}
          labels={{ prodrug: INGREDIENTS[0].name, active: active.name }}
          band={
            active.therapeuticRangeMin != null && active.therapeuticRangeMax != null
              ? { min: active.therapeuticRangeMin, max: active.therapeuticRangeMax }
              : undefined
          }
        />
        <Text muted className="mt-3 text-[11px] leading-4">
          One {strengthUnit} ({fmt(STRENGTH_INGREDIENTS[0].displayAmount)} {STRENGTH_INGREDIENTS[0].displayUnit}),
          simulated from the models below. Touch and drag to read values.
        </Text>
      </Section>

      <Section icon={FlaskConical} title={`Strength · per ${strengthUnit}`} color={color}>
        {STRENGTH_INGREDIENTS.map((si, i) => {
          const ingredient = INGREDIENTS.find((x) => x.id === si.ingredientId);
          return (
            <View key={si.ingredientId} className={i === 0 ? "" : "mt-3 border-t-2 border-border pt-3"}>
              <Text className="font-display-bold text-base">{ingredient?.name}</Text>
              <View className="mt-2 flex-row gap-2">
                <Stat label="Labelled" value={fmt(si.displayAmount)} unit={si.displayUnit} color={color} />
                <Stat label="Free base" value={fmt(si.amountBase, 2)} unit="mg" color={color} />
              </View>
              <Row first label="Salt factor" value={`× ${fmt(si.saltFactor, 3)}`} />
            </View>
          );
        })}
      </Section>

      <Section icon={Timer} title="Absorption" color={color}>
        <View className="flex-row gap-2">
          <Stat label="Bioavailability" value={String(ABSORPTION.fPercent)} unit="%" color={color} />
          <Stat label="Phases" value={String(PHASES.length)} color={color} />
        </View>
        {PHASES.map((p) => (
          <View key={p.position} className="mt-3">
            <View className="flex-row items-center gap-2">
              <Chip label={`Phase ${p.position + 1}`} color={color} />
              <Text className="text-sm font-medium">{PHASE_KIND[p.kind]}</Text>
              <Text muted className="text-sm">· {p.fractionPercent}% of dose</Text>
            </View>
            <View className="mt-1">
              {p.kA != null ? <Row first label="kₐ (absorption rate)" value={`${fmt(p.kA, 2)} /h`} /> : null}
              {p.kA != null ? <Row label="Absorption t½" value={`${fmt((Math.LN2 / p.kA) * 60, 0)} min`} /> : null}
              {p.inputDuration != null ? <Row first label="Input duration" value={`${fmt(p.inputDuration)} h`} /> : null}
              <Row label="Lag time" value={`${fmt(p.tLag * 60, 0)} min`} />
            </View>
          </View>
        ))}
        {ABSORPTION.name ? (
          <Text muted className="mt-2 text-[11px]">
            Model: {ABSORPTION.name}{ABSORPTION.source ? ` · ${ABSORPTION.source}` : ""}
          </Text>
        ) : null}
      </Section>

      <View className="ml-2 mt-10 flex-row items-center gap-2">
        <Activity size={20} color={color} strokeWidth={2.5} />
        <Heading size="md">Ingredients & kinetics</Heading>
      </View>
      {INGREDIENTS.map((ingredient) => (
        <IngredientCard key={ingredient.id} ingredient={ingredient} color={color} />
      ))}

      {medication.notes ? (
        <Section icon={Layers} title="Notes" color={color}>
          <Text className="text-sm leading-5">{medication.notes}</Text>
        </Section>
      ) : null}
    </Screen>
  );
}
