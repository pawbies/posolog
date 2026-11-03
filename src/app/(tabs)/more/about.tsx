import Section from "@/components/list/section";
import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import IconBadge from "@/components/ui/icon-badge";
import InfoCard from "@/components/ui/info-card";
import Pressable from "@/components/ui/pressable";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { usePalette } from "@/hooks/use-palette";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { ExternalLink, HatGlasses } from "lucide-react-native";
import { View } from "react-native";

const DEVELOPERS = [
  { name: "pawbies", role: "Lead programmer", github: "https://github.com/pawbies", image: require("@/assets/images/developers/pawbies.png") },
  { name: "Alexi", role: "Lead designer", github: "https://github.com/Alexander-Metzger", image: require("@/assets/images/developers/alexi.png") }
];

export default function AboutScreen() {
  const version = Constants.expoConfig?.version;
  const { chevron } = usePalette();

  return (
    <Screen>
      <View className="items-center pb-8 pt-6">
        <Image
          source={require("@/assets/images/icon.png")}
          contentFit="cover"
          className="h-28 w-28 -rotate-3 rounded-[32px]"
        />
        <Heading size="lg" className="mt-5">posolog</Heading>
        {version ? (
          <View className="mt-2 rounded-full bg-surface-alt px-3 py-1">
            <Text muted className="text-sm font-semibold">Version {version}</Text>
          </View>
        ) : null}
      </View>

      <InfoCard>
        posolog is a simple and easy-to-use app for logging your medication intake. It is
        designed to help you analyze your plasma curves quickly and easily, so you can gain insight on your health.
      </InfoCard>

      <Card tone="lilac" className="mb-7">
        <View className="mb-3 flex-row items-center gap-3">
          <IconBadge icon={HatGlasses} tone="lilac" size="sm" onTint />
          <Heading size="sm">Privacy</Heading>
        </View>
        <Text className="text-base leading-6 opacity-80">
          posolog is built to be privacy focused by design. All data stays on your device — nothing
          is uploaded to a server. There are no accounts, no sign-in, and no analytics or tracking.
          You control your data and can export or import it whenever you want.
        </Text>
      </Card>

      <Section title="The developers">
        {DEVELOPERS.map((dev) => (
          <Pressable
            key={dev.name}
            onPress={() => WebBrowser.openBrowserAsync(dev.github)}
            accessibilityRole="link"
            accessibilityLabel={`${dev.name}, ${dev.role}. Open GitHub profile`}
            className="flex-row items-center px-3.5 py-3"
          >
            <Image
              source={dev.image}
              contentFit="cover"
              className="h-12 w-12 rounded-full bg-surface-alt"
            />
            <View className="ml-4 flex-1">
              <Text className="font-display-bold text-[17px]">{dev.name}</Text>
              <Text muted className="text-sm">{dev.role}</Text>
            </View>
            <ExternalLink size={20} color={chevron} />
          </Pressable>
        ))}
      </Section>
    </Screen>
  );
}
