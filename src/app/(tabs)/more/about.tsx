import { Image } from "@/components/ui/image";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import { ExternalLink, HatGlasses } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SectionProps = {
  title?: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<DeveloperRowProps>[];

  return (
    <View className="mb-7">
      {title ? (
        <Text className="text-base text-neutral-500 dark:text-neutral-400 ml-5 mb-2">
          {title}
        </Text>
      ) : null}
      <View className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden">
        {rows.map((child, i) => cloneElement(child, { first: i === 0 }))}
      </View>
    </View>
  );
}

type DeveloperRowProps = {
  name: string;
  role: string;
  image: any;
  url: string;
  first?: boolean;
};

function DeveloperRow({ name, role, image, url, first = false }: DeveloperRowProps) {
  const { colorScheme } = useColorScheme();
  const icon = colorScheme === "dark" ? "#71717a" : "#a1a1aa";

  return (
    <Pressable
      onPress={async () => await WebBrowser.openBrowserAsync(url)}
      className={`flex-row items-center py-3 pr-4 ml-4 active:opacity-60 ${
        first ? "" : "border-t border-neutral-200 dark:border-neutral-800"
      }`}
    >
      <Image
        source={image}
        contentFit="cover"
        className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800"
      />
      <View className="flex-1 ml-4">
        <Text className="text-lg text-black dark:text-white">{name}</Text>
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">{role}</Text>
      </View>
      <ExternalLink size={20} color={icon} />
    </Pressable>
  );
}

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const version = Constants.expoConfig?.version;
  const { colorScheme } = useColorScheme();
  const privacyIconColor = colorScheme === "dark" ? "#a1a1aa" : "#71717a";

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4"
      >
        <View className="items-center pt-10 pb-8">
          <Image
            source={require("@/assets/images/icon.png")}
            contentFit="cover"
            className="w-28 h-28 rounded-3xl"
          />
          <Text className="text-3xl font-semibold text-black dark:text-white mt-4">
            posolog
          </Text>
          {version ? (
            <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Version {version}
            </Text>
          ) : null}
        </View>

        <View className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-4 mb-7">
          <Text className="text-base leading-6 text-neutral-600 dark:text-neutral-300">
            posolog is a simple and easy-to-use app for logging your medication intake. It is
            designed to help you analyze your plasma curves quickly and easily, so you can gain insight on your health.
          </Text>
        </View>

        <View className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-4 mb-7">
          <View className="flex-row items-center mb-2">
            <HatGlasses size={20} color={privacyIconColor} />
            <Text className="text-base font-medium text-black dark:text-white ml-2">
              Privacy
            </Text>
          </View>
          <Text className="text-base leading-6 text-neutral-600 dark:text-neutral-300">
            posolog is built to be privacy focused by design. All data stays on your device — nothing
            is uploaded to a server. There are no accounts, no sign-in, and no analytics or tracking.
            You control your data and can export or import it whenever you want.
          </Text>
        </View>

        <Section title="The developers">
          <DeveloperRow
            name="pawbies"
            role="Lead programmer"
            image={require("@/assets/images/developers/pawbies.png")}
            url="https://github.com/pawbies"
          />
          <DeveloperRow
            name="Alexi"
            role="Lead designer"
            image={require("@/assets/images/developers/alexi.png")}
            url="https://github.com/Alexander-Metzger"
          />
        </Section>
      </ScrollView>
    </View>
  );
}
