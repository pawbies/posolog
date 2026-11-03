import { usePalette } from "@/hooks/use-palette";
import { Search, X } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchField({ value, onChangeText, placeholder }: Props) {
  const { muted, brand, placeholder: placeholderColor } = usePalette();

  return (
    <View className="mb-4 flex-row items-center rounded-full border-2 border-border bg-surface">
      <View className="pl-5">
        <Search size={18} color={muted} strokeWidth={2.5} />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        selectionColor={brand}
        cursorColor={brand}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        className="flex-1 px-3 py-3.5 text-[16px] text-text"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          className="mr-3 h-7 w-7 items-center justify-center rounded-full bg-surface-alt active:opacity-60"
        >
          <X size={14} color={muted} strokeWidth={2.5} />
        </Pressable>
      ) : null}
    </View>
  );
}
