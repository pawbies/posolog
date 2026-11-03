import Chart from "@/components/home/chart";
import CheckIns from "@/components/home/check-ins";
import Footer from "@/components/home/footer";
import Regimen from "@/components/home/regimen";
import Mascot from "@/components/ui/mascot";
import Screen from "@/components/ui/screen";
import ScreenTitle from "@/components/ui/screen-title";
import { useLocales } from "expo-localization";
import { View } from "react-native";

function greeting(hour: number) {
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const locale = useLocales()[0]?.languageTag ?? "en-US";
  const now = new Date();
  const todaysDate = now.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <Screen>
      <ScreenTitle
        subtitle={todaysDate}
        right={
          <View className="-mb-2 h-20 w-20 items-center justify-center rounded-full bg-tint-mint">
            <Mascot variant="head" className="h-16 w-16" />
          </View>
        }
      >
        {greeting(now.getHours())}
      </ScreenTitle>

      <Chart />
      <Regimen />
      <CheckIns />
      <Footer />
    </Screen>
  );
}
