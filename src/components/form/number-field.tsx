import FieldLabel, { fieldBox } from "@/components/form/field-label";
import Text from "@/components/ui/text";
import { usePalette } from "@/hooks/use-palette";
import { LucideIcon } from "lucide-react-native";
import { ColorValue, TextInputProps, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type FieldProps = TextInputProps & {
  icon: LucideIcon;
  iconColor?: ColorValue;
  iconSize?: number;
  label: string;
  unit?: string;
  decimal?: boolean;
};

const sanitizeDecimal = (text: string) => {
  const [whole, ...rest] = text.replace(/,/g, ".").replace(/[^0-9.]/g, "").split(".");
  return rest.length ? `${whole}.${rest.join("")}` : whole;
};

export default function NumberField({ icon: Icon, iconColor, iconSize, label, unit, decimal, onChangeText, ...props }: FieldProps) {
  const { placeholder, brand } = usePalette();
  const accent = typeof iconColor === "string" ? iconColor : brand;

  return (
    <View className="mb-5">
      <FieldLabel>{label}</FieldLabel>
      <View className={fieldBox}>
        <View className="pl-4">
          <Icon size={iconSize || 20} color={iconColor} strokeWidth={2.25} />
        </View>
        <TextInput
          onChangeText={(text) =>
            onChangeText?.(decimal ? sanitizeDecimal(text) : text.replace(/[^0-9]/g, ""))
          }
          placeholderTextColor={placeholder}
          selectionColor={accent}
          cursorColor={accent}
          keyboardType={decimal ? "decimal-pad" : "number-pad"}
          maxLength={decimal ? 10 : 3}
          accessibilityLabel={label}
          className="flex-1 px-3 py-4 font-display-bold text-[18px] text-text"
          {...props}
        />
        <Text muted className="pr-5 text-sm font-medium">{unit}</Text>
      </View>
    </View>
  );
}
