import InfoCard from "@/components/ui/info-card";
import Mascot from "@/components/ui/mascot";
import PageHero from "@/components/ui/page-hero";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { Heart } from "lucide-react-native";
import { View } from "react-native";

export default function DonateScreen() {
  return (
    <Screen>
      <PageHero icon={Heart} tone="rose" title="Donations coming soon" subtitle="Not available yet" />

      <InfoCard tone="rose">
        We don't currently accept donations, but we plan to in the future. Once support is
        ready, you'll be able to contribute right here to help keep posolog free and in
        active development.
      </InfoCard>

      <Text muted className="px-2 text-center text-base leading-6">
        Until then, thank you for using posolog. Sharing it with someone who might find it
        useful helps just as much.
      </Text>

      <View className="mt-6 items-center">
        <Mascot />
      </View>
    </Screen>
  );
}
