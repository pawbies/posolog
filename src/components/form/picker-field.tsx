import Text from "@/components/ui/text";
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
    <View className="mb-4">
      <Text muted className="text-xs font-semibold mb-1.5">
        {label}
      </Text>
      <View className="flex-row items-center rounded-xl border border-border bg-surface min-h-12 pl-4 pr-1">
        {Icon ? <Icon size={18} color={color} /> : null}
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
