import Text from "@/components/text";
import { Check, LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

export type RadioOption = {
  icon: LucideIcon;
  name: string;
  value: string;
};

type RadioFieldProps = {
  label: string;
  options: RadioOption[];
  selected: RadioOption;
  onChange: (value: RadioOption) => void;
  colorActive: string;
};

export default function RadioField({
  label,
  options,
  selected,
  onChange,
  colorActive
}: RadioFieldProps) {
  return (
    <View className="mb-4">
      <Text muted className="text-xs font-semibold mb-1.5">
        {label}
      </Text>
      <View className="rounded-xl overflow-hidden bg-surface">
        {options.map((option, i) => {
          const active = option.value === selected.value;
          const Icon = option.icon;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              className={`flex-row items-center gap-3 px-3 py-3 ${
                i > 0 ? "border-t border-border" : ""
              } ${active ? "bg-neutral-200/60 dark:bg-neutral-800" : ""}`}
            >
              <Icon size={18} color={active ? colorActive : "#a3a3a3"} />
              <Text className={`flex-1 text-sm ${active ? "font-semibold" : ""}`}>
                {option.name}
              </Text>
              {active && <Check size={16} color="#0ea5e9" />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
