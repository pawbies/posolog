import Text from "@/components/text";
import { LucideIcon } from "lucide-react-native";
import { ColorValue, TextInputProps, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type FieldProps = TextInputProps & {
  icon: LucideIcon;
  iconColor?: ColorValue;
  iconSize?: number;
  label: string;
  unit?: string;
};

export default function NumberField({ icon: Icon, iconColor, iconSize, label, unit, onChangeText, ...props }: FieldProps) {
  return (
    <View className="mb-4">
      <Text muted className="text-xs font-semibold mb-1.5">
        {label}
      </Text>
      <View className="flex-row items-center rounded-xl border border-border bg-surface">
        <View className="pl-4">
          <Icon size={iconSize || 18} color={iconColor} />
        </View>
        <TextInput
          onChangeText={(text) => onChangeText && onChangeText(text.replace(/[^0-9]/g, ""))}
          placeholderTextColor="#a3a3a3"
          keyboardType="number-pad"
          maxLength={3}
          className="flex-1 px-3 py-3 text-[14px] text-text"
          {...props}
        />
        <Text muted className="pr-4 text-sm">{unit}</Text>
      </View>
    </View>
  );
}
