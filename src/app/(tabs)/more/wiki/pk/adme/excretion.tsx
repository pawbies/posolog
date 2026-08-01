import WikiHeader from "@/components/wiki-header";
import { Droplets } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExcretionScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4"
      >
        <WikiHeader icon={Droplets} heading="Excretion" path="PK / ADME" />
      </ScrollView>
    </View>
  );
}
