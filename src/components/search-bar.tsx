import { Search, X } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchField({ value, onChangeText, placeholder }: Props) {
  return (
    <View className="mb-3 flex-row items-center rounded-xl border border-border bg-surface">
      <View className="pl-4">
        <Search size={18} color="#a3a3a3" />
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#a3a3a3"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        className="flex-1 px-3 py-3 text-base text-text"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          className="pr-4 active:opacity-60"
        >
          <X size={16} color="#a3a3a3" />
        </Pressable>
      ) : null}
    </View>
  );
}
