import { Image } from "@/components/ui/image";
import { openURL } from "expo-linking";
import { ExternalLink } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

function DeveloperCard({ name, role, image, url }: { name: string; role: string; image: any; url: string }) {
  return (
    <TouchableOpacity
      onPress={() => openURL(url)}
      className="w-full mt-3 bg-purple-50 border border-purple-200 h-24 flex flex-row items-center pr-3 rounded-md"
    >
      <Image
        source={image}
        className="h-full aspect-square rounded-md"
      />
      <View className="flex-1 justify-center ml-3">
        <Text className="text-lg text-black dark:text-white">{name}</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">{role}</Text>
      </View>

      <ExternalLink size={32} color={"#ddd"} />

    </TouchableOpacity>
  );
}

export default function AboutScreen() {
  return (
    <View className="flex-1 justify-center bg-white dark:bg-black">
      <Image
        source={require("@/assets/images/icon.png")}
        className="mx-auto w-44 h-44 mb-4"
      />
      <Text className="text-3xl mx-auto text-black dark:text-white">posolog</Text>

      <Text className="text-lg w-full text-center px-3 mt-12 text-gray-500 dark:text-gray-400">
        posolog is a simple and easy-to-use app for logging your thoughts and ideas. It is designed to help you capture your thoughts quickly and easily, so you can focus on what matters most.
      </Text>

      <View className="mx-3 mt-12">
        <Text className="text-3xl mx-3">The developers</Text>
        <DeveloperCard
          name="pawbies"
          role="Lead developer"
          image={require("@/assets/images/developers/pawbies.png")}
          url="https://github.com/pawbies"
        />
        <DeveloperCard
          name="Alexi"
          role="Lead faggot"
          image={require("@/assets/images/developers/alexi.png")}
          url="https://github.com/Alexander-Metzger"
        />
      </View>
    </View>
  );
}
