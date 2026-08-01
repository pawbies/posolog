import { Microscope } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CommonTerminologyScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4"
      >
        <View className="pt-6 pb-1">
          <View className="flex-row items-center">
            <Microscope size={28} color={iconColor} />
            <Text className="text-3xl font-semibold text-black dark:text-white ml-2">
              Distribution
            </Text>
          </View>
          <Text className="text-base text-neutral-500 dark:text-neutral-400 mt-1 ml-1">
            Pharmacokinetics / ADME
          </Text>
        </View>

        <View className="h-px bg-neutral-200 dark:bg-neutral-800 my-5" />
      </ScrollView>
    </View>
  );
}
