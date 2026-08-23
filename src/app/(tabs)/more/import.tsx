import Text from "@/components/text";
import { Download } from "lucide-react-native";
import { ScrollView, View } from "react-native";


export default function ImportScreen() {
  return (
    <ScrollView className="px-4 flex-1 bg-background">
      <View className="items-center pt-10 pb-8">
        <View className="w-28 h-28 rounded-3xl bg-yellow-100 dark:bg-yellow-950 items-center justify-center">
          <Download size={56} color="#fde047" />
        </View>
        <Text className="text-3xl font-semibold mt-4 text-center">
          Import
        </Text>
      </View>
    </ScrollView>
  );
}
