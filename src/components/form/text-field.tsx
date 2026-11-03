import FieldLabel, { fieldBox } from "@/components/form/field-label";
import { usePalette } from "@/hooks/use-palette";
import { cn } from "@/lib/cn";
import { LucideIcon } from "lucide-react-native";
import { ColorValue, TextInputProps, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type FieldProps = TextInputProps & {
  icon?: LucideIcon;
  iconColor?: ColorValue;
  iconSize?: number;
  label: string;
};

export default function TextField({ icon: Icon, iconColor, iconSize, label, multiline, ...props }: FieldProps) {
  const { muted, placeholder, brand } = usePalette();
  const accent = typeof iconColor === "string" ? iconColor : brand;

  return (
    <View className="mb-5">
      <FieldLabel>{label}</FieldLabel>
      <View className={cn(fieldBox, multiline && "items-start")}>
        {Icon ? (
          <View className={cn("pl-4", multiline && "pt-4")}>
            <Icon size={iconSize || 20} color={iconColor ?? muted} strokeWidth={2.25} />
          </View>
        ) : null}
        <TextInput
          placeholderTextColor={placeholder}
          selectionColor={accent}
          cursorColor={accent}
          keyboardType="default"
          multiline={multiline}
          accessibilityLabel={label}
          // No line height: on iOS it pushes the text below the centre of the field.
          className={cn("flex-1 px-4 py-4 text-[16px] text-text", multiline && "min-h-28")}
          style={multiline ? { textAlignVertical: "top" } : undefined}
          {...props}
        />
      </View>
    </View>
  );
}
