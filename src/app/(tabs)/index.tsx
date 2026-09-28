import Chart from "@/components/home/chart";
import CheckIns from "@/components/home/check-ins";
import Footer from "@/components/home/footer";
import Regimen from "@/components/home/regimen";
import Screen from "@/components/screen";
import Text from "@/components/text";
import { useLocales } from "expo-localization";

export default function HomeScreen() {
  const locale = useLocales()[0].languageTag ?? "en-US";
  const todaysDate = new Date().toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Screen>
      <Text className="text-xl font-semibold">{todaysDate}</Text>

      <Chart />
      <Regimen />
      <CheckIns />
      <Footer />
    </Screen>
  );
}
