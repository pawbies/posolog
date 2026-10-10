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
      <ScreenTitle>More</ScreenTitle>

      <Section title="Tools">
        <LinkRow icon={Calculator} title="Calculator" href="/more/calculator" iconColor="#ef4444" />
        <LinkRow icon={ChartColumn} title="Statistics" href="/more/statistics" iconColor="#f97316" />
      </Section>

      <Section title="Data">
        <LinkRow icon={Download} title="Import" href="/more/import" iconColor="#fde047" />
        <LinkRow icon={Upload} title="Export" href="/more/export" iconColor="#22c55e" />
      </Section>

      <Section title="App">
        <LinkRow icon={Settings} title="Settings" href="/more/settings" iconColor="#3b82f6" />
        <LinkRow icon={BookOpenText} title="Wiki" href="/more/wiki" iconColor="#c026d3" />
        <LinkRow icon={Heart} title="Donate" href="/more/donate" iconColor="#ef4444" />
        <LinkRow icon={Info} title="About" href="/more/about" iconColor="#22c55e" />
      </Section>

      <Section title="Legal">
        <LinkRow icon={HatGlasses} title="Privacy Policy" href="/legal/privacy-policy" iconColor="#3b82f6" />
        <LinkRow icon={Handshake} title="Terms of Service" href="/legal/terms-of-service" iconColor="#c026d3" />
      </Section>
    </Screen>
  );
}
