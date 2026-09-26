import Text from "@/components/text";
import { Check, LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

export type RadioOption<T extends string = string> = {
  icon: LucideIcon;
  name: string;
  value: T;
};

type RadioFieldProps<T extends string> = {
  label: string;
  options: RadioOption<T>[];
  selected: T;
  onChange: (value: T) => void;
  colorActive: string;
};

export default function RadioField<T extends string>({
  label,
  options,
  selected,
  onChange,
  colorActive
}: RadioFieldProps<T>) {
  return (
    <View className="mb-4">
      <Text muted className="text-xs font-semibold mb-1.5">
        {label}
      </Text>
      <View accessibilityRole="radiogroup" className="rounded-xl overflow-hidden bg-surface">
        {options.map((option, i) => {
          const active = option.value === selected;
          const Icon = option.icon;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
              className={`flex-row items-center gap-3 px-3 py-3 ${
                i > 0 ? "border-t border-border" : ""
              } ${active ? "bg-neutral-200/60 dark:bg-neutral-800" : ""}`}
            >
              <Icon size={18} color={active ? colorActive : "#a3a3a3"} />
              <Text className={`flex-1 text-[14px] ${active ? "font-semibold" : ""}`}>
                {option.name}
              </Text>
              {active && <Check size={16} color={colorActive} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
