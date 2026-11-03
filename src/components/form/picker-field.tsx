import FieldLabel, { fieldBox } from "@/components/form/field-label";
import { cn } from "@/lib/cn";
import { Host, Picker } from "@expo/ui";
import { type LucideIcon } from "lucide-react-native";
import { Platform, View } from "react-native";

export type PickerOption<T extends string = string> = {
  icon: LucideIcon;
  name: string;
  value: T;
};

type PickerFieldProps<T extends string> = {
  label: string;
  options: PickerOption<T>[];
  selected: T;
  onChange: (value: T) => void;
  color: string;
};

export default function PickerField<T extends string>({ label, options, selected, onChange, color }: PickerFieldProps<T>) {
  const Icon = options.find((o) => o.value === selected)?.icon;

  return (
    <View className="mb-5">
      <FieldLabel>{label}</FieldLabel>
      <View className={cn(fieldBox, "min-h-14 pl-4 pr-1")}>
        {Icon ? <Icon size={20} color={color} strokeWidth={2.25} /> : null}
        <Host
          seedColor={color}
          matchContents={Platform.OS === "ios" ? true : { vertical: true }}
          style={Platform.OS === "ios" ? { marginLeft: "auto" } : { flex: 1, marginLeft: 8 }}
        >
          <Picker selectedValue={selected} onValueChange={onChange}>
            {options.map((o) => (
              <Picker.Item key={o.value} label={o.name} value={o.value} />
            ))}
          </Picker>
        </Host>
      </View>
    </View>
  );
}
