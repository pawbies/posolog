import Pressable from "@/components/pressable";
import { Image } from "@/components/ui/image";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { ExternalLink, HatGlasses } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { ScrollView, Text, View } from "react-native";

const DEVELOPERS = [
  { name: "pawbies", role: "Lead programmer", github: "https://github.com/pawbies", image: require("@/assets/images/developers/pawbies.png") },
  { name: "Alexi", role: "Lead designer", github: "https://github.com/Alexander-Metzger", image: require("@/assets/images/developers/alexi.png") }
]

export default function AboutScreen() {
  const version = Constants.expoConfig?.version;
  const { colorScheme } = useColorScheme();

  return (
    <ScrollView className="px-4 flex-1 bg-background">
      <View className="items-center pt-10 pb-8">
        <Image
          source={require("@/assets/images/icon.png")}
          contentFit="cover"
          className="w-28 h-28 rounded-3xl"
        />
        <Text className="text-3xl font-semibold text-text mt-4">
          posolog
        </Text>
        {version ? (
          <Text className="text-sm text-text-muted dark:text-neutral-400 mt-1">
            Version {version}
          </Text>
        ) : null}
      </View>

      <View className="bg-surface rounded-2xl p-4 mb-7">
        <Text className="text-base leading-6 text-neutral-600 dark:text-neutral-300">
          posolog is a simple and easy-to-use app for logging your medication intake. It is
          designed to help you analyze your plasma curves quickly and easily, so you can gain insight on your health.
        </Text>
      </View>

      <View className="bg-surface rounded-2xl p-4 mb-7">
        <View className="flex-row items-center mb-2">
          <HatGlasses size={20} color={colorScheme === "dark" ? "#943bc4" : "#7918ad"} />
          <Text className="text-base font-medium text-text ml-2">
            Privacy
          </Text>
        </View>
        <Text className="text-base leading-6 text-text-muted">
          posolog is built to be privacy focused by design. All data stays on your device — nothing
          is uploaded to a server. There are no accounts, no sign-in, and no analytics or tracking.
          You control your data and can export or import it whenever you want.
        </Text>
      </View>

      <View className="mb-7">
          <Text className="text-base text-text-muted ml-5 mb-2">
            The developers
          </Text>
        <View className="bg-surface rounded-2xl overflow-hidden">
          {DEVELOPERS.map((dev, i) => (
            <Pressable
              key={dev.name}
              onPress={async () => await WebBrowser.openBrowserAsync(dev.github)}
            >
              <View
                className={`ml-4 flex-1 flex-row items-center py-3 pr-4 ${ i === 0 ? "" : "border-t border-border" }`}
              >
                <Image
                  source={dev.image}
                  contentFit="cover"
                  className="w-12 h-12 rounded-full bg-surface"
                />
                <View className="flex-1 ml-4">
                  <Text className="text-lg text-text">{dev.name}</Text>
                  <Text className="text-sm text-text-muted">{dev.role}</Text>
                </View>
                <ExternalLink size={20} color={colorScheme === "dark" ? "#71717a" : "#a1a1aa"} />
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
