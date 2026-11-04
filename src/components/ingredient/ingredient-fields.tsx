import NumberField from "@/components/form/number-field";
import TextField from "@/components/form/text-field";
import { usePalette } from "@/hooks/use-palette";
import type { IngredientDraft } from "@/lib/ingredient";
import { ArrowDownToLine, ArrowUpToLine, Atom, CalendarClock, Scale, Skull } from "lucide-react-native";

type IngredientFieldsProps = {
  value: IngredientDraft;
  onChange: (patch: Partial<IngredientDraft>) => void;
};

export default function IngredientFields({ value, onChange }: IngredientFieldsProps) {
  const { tones } = usePalette();

  return (
    <>
      <TextField
        icon={Atom}
        iconColor={tones.lilac}
        label="Name"
        placeholder="e.g. Paracetamol"
        value={value.name}
        onChangeText={(name) => onChange({ name })}
      />

      <NumberField
        decimal
        icon={Scale}
        iconColor={tones.lilac}
        iconSize={18}
        label="Molar mass (optional)"
        placeholder="151.16"
        unit="g/mol"
        value={value.molarMass}
        onChangeText={(molarMass) => onChange({ molarMass })}
      />

      <NumberField
        decimal
        icon={CalendarClock}
        iconColor={tones.sky}
        iconSize={18}
        label="Max per day (optional)"
        placeholder="4000"
        unit="mg"
        value={value.maxPerDay}
        onChangeText={(maxPerDay) => onChange({ maxPerDay })}
      />

      <NumberField
        decimal
        icon={ArrowDownToLine}
        iconColor={tones.mint}
        iconSize={18}
        label="Therapeutic range min (optional)"
        placeholder="10"
        unit="ng/mL"
        value={value.therapeuticRangeMin}
        onChangeText={(therapeuticRangeMin) => onChange({ therapeuticRangeMin })}
      />

      <NumberField
        decimal
        icon={ArrowUpToLine}
        iconColor={tones.mint}
        iconSize={18}
        label="Therapeutic range max (optional)"
        placeholder="20"
        unit="ng/mL"
        value={value.therapeuticRangeMax}
        onChangeText={(therapeuticRangeMax) => onChange({ therapeuticRangeMax })}
      />

      <NumberField
        decimal
        icon={Skull}
        iconColor={tones.rose}
        iconSize={18}
        label="Toxic threshold (optional)"
        placeholder="150"
        unit="ng/mL"
        value={value.toxicThreshold}
        onChangeText={(toxicThreshold) => onChange({ toxicThreshold })}
      />

      <TextField
        label="Notes"
        placeholder="Your notes"
        multiline
        value={value.notes}
        onChangeText={(notes) => onChange({ notes })}
      />
    </>
  );
}
