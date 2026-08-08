import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function BloodPressureScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        className="px-4"
      >
        <Text className="text-3xl font-semibold text-black dark:text-white mb-6 ml-1">
          Blood pressure
        </Text>
      </ScrollView>
    </View>
  );
}
