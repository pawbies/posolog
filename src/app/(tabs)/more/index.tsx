import LinkRow from "@/components/list/link-row";
import Section from "@/components/list/section";
import Screen from "@/components/ui/screen";
import ScreenTitle from "@/components/ui/screen-title";
import {
  BookOpenText,
  Calculator,
  ChartColumn,
  Download,
  Handshake,
  HatGlasses,
  Heart,
  Info,
  Settings,
  Upload,
} from "lucide-react-native";

export default function MoreScreen() {
  return (
    <Screen>
      <ScreenTitle subtitle="Tools, data and settings">More</ScreenTitle>

      <Section title="Tools">
        <LinkRow icon={Calculator} title="Calculator" href="/more/calculator" tone="peach" />
        <LinkRow icon={ChartColumn} title="Statistics" href="/more/statistics" tone="cream" />
      </Section>

      <Section title="Data">
        <LinkRow icon={Download} title="Import" href="/more/import" tone="sky" />
        <LinkRow icon={Upload} title="Export" href="/more/export" tone="mint" />
      </Section>

      <Section title="App">
        <LinkRow icon={Settings} title="Settings" href="/more/settings" tone="sky" />
        <LinkRow icon={BookOpenText} title="Wiki" href="/more/wiki" tone="lilac" />
        <LinkRow icon={Heart} title="Donate" href="/more/donate" tone="rose" />
        <LinkRow icon={Info} title="About" href="/more/about" tone="mint" />
      </Section>

      <Section title="Legal">
        <LinkRow icon={HatGlasses} title="Privacy Policy" href="/legal/privacy-policy" tone="sky" />
        <LinkRow icon={Handshake} title="Terms of Service" href="/legal/terms-of-service" tone="lilac" />
      </Section>
    </Screen>
  );
}
