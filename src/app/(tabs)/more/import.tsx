import InfoCard from "@/components/ui/info-card";
import PageHero from "@/components/ui/page-hero";
import Screen from "@/components/ui/screen";
import { Download } from "lucide-react-native";

export default function ImportScreen() {
  return (
    <Screen>
      <PageHero icon={Download} tone="sky" title="Import" subtitle="Not available yet" />

      <InfoCard tone="sky">
        Importing isn't ready yet. Soon you'll be able to bring back data you exported from
        posolog, for example when moving to a new phone.
      </InfoCard>
    </Screen>
  );
}
