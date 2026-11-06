import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import IconBadge from "@/components/ui/icon-badge";
import Text from "@/components/ui/text";
import { type Tone } from "@/constants/colors";
import { useContentTopInset } from "@/hooks/use-content-top-inset";
import { usePalette } from "@/hooks/use-palette";
import * as WebBrowser from "expo-web-browser";
import { ExternalLink, type LucideIcon } from "lucide-react-native";
import { type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CONTACT_URL = "https://github.com/pawbies/posolog/issues";

type LegalSectionProps = {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  children: string;
};

export function LegalSection({ icon, tone, title, children }: LegalSectionProps) {
  return (
    <Card className="mb-4">
      <View className="mb-3 flex-row items-center gap-3">
        <IconBadge icon={icon} tone={tone} size="sm" />
        <Heading size="sm" className="flex-1">{title}</Heading>
      </View>
      <Text muted className="text-base leading-6">{children}</Text>
    </Card>
  );
}

type LegalPageProps = {
  lastUpdated: string;
  intro: string;
  contactTitle: string;
  children: ReactNode;
};

/** Shared layout for the privacy policy and terms of service. */
export default function LegalPage({ lastUpdated, intro, contactTitle, children }: LegalPageProps) {
  const insets = useSafeAreaInsets();
  const topInset = useContentTopInset();
  const { chevron } = usePalette();

  return (
    <ScrollView
      className="flex-1 bg-background px-5"
      contentContainerStyle={{ paddingTop: topInset + 16, paddingBottom: insets.bottom + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-5 self-center rounded-full bg-surface-alt px-3 py-1">
        <Text muted className="text-sm font-semibold">Last updated {lastUpdated}</Text>
      </View>

      <Card tone="cream" className="mb-4">
        <Text className="text-base leading-6 opacity-80">{intro}</Text>
      </Card>

      {children}

      <Heading size="xs" className="mb-2.5 ml-2 mt-4 text-text-muted">Contact</Heading>
      <Card
        onPress={() => WebBrowser.openBrowserAsync(CONTACT_URL)}
        accessibilityLabel={`${contactTitle} Open an issue on GitHub`}
        className="flex-row items-center gap-4 py-4"
      >
        <IconBadge icon={ExternalLink} tone="sky" size="sm" />
        <View className="flex-1">
          <Text className="font-display-bold text-base">{contactTitle}</Text>
          <Text muted className="mt-0.5 text-sm">Open an issue on GitHub</Text>
        </View>
        <ExternalLink size={18} color={chevron} />
      </Card>
    </ScrollView>
  );
}
