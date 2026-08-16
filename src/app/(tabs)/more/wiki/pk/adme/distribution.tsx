import WikiHeader from "@/components/wiki/wiki-header";
import { Share2 } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DistributionScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4"
      >
        <WikiHeader icon={Share2} heading="Distribution" path="PK / ADME" />
      </ScrollView>
    </View>
  );
}
