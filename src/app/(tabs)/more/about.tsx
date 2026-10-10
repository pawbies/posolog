import Section from "@/components/list/section";
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
  const { isDark, chevron } = usePalette();

  return (
    <Screen skipTopInset>
      <View className="items-center pt-10 pb-8">
        <Image
          source={require("@/assets/images/icon.png")}
          contentFit="cover"
          className="w-28 h-28 rounded-3xl"
        />
        <Text className="text-3xl font-semibold mt-4">
          posolog
        </Text>
        {version ? (
          <Text muted className="text-sm mt-1">
            Version {version}
          </Text>
        ) : null}
      </View>

      <InfoCard>
        posolog is a simple and easy-to-use app for logging your medication intake. It is
        designed to help you analyze your plasma curves quickly and easily, so you can gain insight on your health.
      </InfoCard>

      <View className="bg-surface rounded-2xl p-4 mb-7">
        <View className="flex-row items-center mb-2">
          <HatGlasses size={20} color={isDark ? "#943bc4" : "#7918ad"} />
          <Text className="text-base font-medium ml-2">
            Privacy
          </Text>
        </View>
        <Text muted className="text-base leading-6">
          posolog is built to be privacy focused by design. All data stays on your device — nothing
          is uploaded to a server. There are no accounts, no sign-in, and no analytics or tracking.
          You control your data and can export or import it whenever you want.
        </Text>
      </View>

      <Section title="The developers">
        {DEVELOPERS.map((dev) => (
          <Pressable
            key={dev.name}
            onPress={() => WebBrowser.openBrowserAsync(dev.github)}
            className="flex-row items-center px-4 py-3"
          >
            <Image
              source={dev.image}
              contentFit="cover"
              className="w-12 h-12 rounded-full bg-surface"
            />
            <View className="flex-1 ml-4">
              <Text className="text-lg">{dev.name}</Text>
              <Text muted className="text-sm">{dev.role}</Text>
            </View>
            <ExternalLink size={20} color={chevron} />
          </Pressable>
        ))}
      </Section>
    </Screen>
  );
}
