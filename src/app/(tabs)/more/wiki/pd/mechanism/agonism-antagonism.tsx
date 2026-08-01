import WikiHeader from "@/components/wiki-header";
import { ArrowLeftRight } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AgonismAntagonismScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4"
      >
        <WikiHeader icon={ArrowLeftRight} heading="Agonism and antagonism" path="PD / Mechanism" />
      </ScrollView>
    </View>
  );
}
