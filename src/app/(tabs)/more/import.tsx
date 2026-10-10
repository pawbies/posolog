import PageHero from "@/components/ui/page-hero";
import Screen from "@/components/ui/screen";
import { Download } from "lucide-react-native";

export default function ImportScreen() {
  return (
    <Screen skipTopInset>
      <PageHero icon={Download} iconColor="#fde047" tileClassName="bg-yellow-100 dark:bg-yellow-950" title="Import" />
    </Screen>
  );
}
