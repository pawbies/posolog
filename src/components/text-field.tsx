import Text from "@/components/text";
import { LucideIcon } from "lucide-react-native";
import { ColorValue, TextInputProps, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type FieldProps = TextInputProps & {
  icon?: LucideIcon;
  iconColor?: ColorValue;
  iconSize?: number;
  label: string;
};

export default function TextField({ icon: Icon, iconColor, iconSize, label, ...props }: FieldProps) {
  return (
    <View className="mb-4">
      <Text muted className="text-xs font-semibold mb-1.5">
        {label}
      </Text>
      <View className="flex-row items-center rounded-xl border border-border bg-surface">
        {Icon ? 
          <View className="pl-4">
            <Icon size={iconSize || 18} color={iconColor} />
          </View>
          : null
        }
        <TextInput
          placeholderTextColor="#a3a3a3"
          keyboardType="default"
          className="flex-1 px-3 py-3 text-base text-text"
          {...props}
        />
      </View>
    </View>
  );
}
