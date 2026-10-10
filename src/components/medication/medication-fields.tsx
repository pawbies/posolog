import ColorField from "@/components/form/color-field";
import PickerField from "@/components/form/picker-field";
import TextField from "@/components/form/text-field";
import { FORM_META, FORMS, ROUTES, type MedicationDraft } from "@/lib/medication";

type MedicationFieldsProps = {
  value: MedicationDraft;
  onChange: (patch: Partial<MedicationDraft>) => void;
};

/** The editable medication fields, shared by the creation flow and the edit screen. */
export default function MedicationFields({ value, onChange }: MedicationFieldsProps) {
  return (
    <>
      <TextField
        icon={FORM_META[value.form].icon}
        iconColor={value.color}
        label="Name"
        placeholder="Your medication's name"
        value={value.name}
        onChangeText={(name) => onChange({ name })}
      />

      <ColorField
        label="Color"
        value={value.color}
        onCompleteJS={({ hex }) => onChange({ color: hex })}
      />

      <PickerField
        label="Form"
        onChange={(form) => onChange({ form })}
        options={FORMS}
        selected={value.form}
        color={value.color}
      />

      <PickerField
        label="Route"
        onChange={(route) => onChange({ route })}
        options={ROUTES}
        selected={value.route}
        color={value.color}
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
