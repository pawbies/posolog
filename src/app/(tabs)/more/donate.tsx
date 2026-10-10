import InfoCard from "@/components/ui/info-card";
import PageHero from "@/components/ui/page-hero";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { Heart } from "lucide-react-native";

export default function DonateScreen() {
  return (
    <Screen skipTopInset>
      <PageHero
        icon={Heart}
        iconColor="#ef4444"
        tileClassName="bg-red-100 dark:bg-red-950"
        title="Donations coming soon"
        subtitle="Not available yet"
      />

      <InfoCard>
        We don't currently accept donations, but we plan to in the future. Once support is
        ready, you'll be able to contribute right here to help keep posolog free and in
        active development.
      </InfoCard>

      <Text muted className="text-base leading-6 text-center px-2">
        Until then, thank you for using posolog. Sharing it with someone who might find it
        useful helps just as much.
      </Text>
    </Screen>
  );
}
