import Chart from "@/components/home/chart";
import CheckIns from "@/components/home/check-ins";
import Footer from "@/components/home/footer";
import Regimen from "@/components/home/regimen";
import Text from "@/components/text";
import { useLocales } from "expo-localization";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const locale = useLocales()[0].languageTag ?? "en-US";
  const todaysDate = new Date().toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4 flex-1 bg-background"
      >
        <Text className="text-xl font-semibold">{todaysDate}</Text>

        <Chart />
        <Regimen />
        <CheckIns />
        <Footer />
      </ScrollView>
    </View>
  );
}
