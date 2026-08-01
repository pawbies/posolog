import WikiHeader from "@/components/wiki-header";
import { SlidersHorizontal } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TherapeuticWindowScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4"
      >
        <WikiHeader icon={SlidersHorizontal} heading="Therapeutic window" path="PD / Quantitative response" />
      </ScrollView>
    </View>
  );
}
