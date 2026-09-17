import Text from "@/components/text";
import { Image } from "expo-image";
import { Heart } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

export default function Footer() {
  const { colorScheme } = useColorScheme();
  const red = colorScheme === "dark" ? "#ff2800" : "#ff1400"

  return (
    <>
      <View className="mt-16 flex-row items-center justify-center gap-1.5">
        <Heart size={16} color={red} />
        <Text>
          Thank you for using posolog, we hope you like our app!
        </Text>
      </View>
      <View className="w-full flex-row justify-end">
        <Image
          source={require("@/assets/images/android-icon-foreground.png")}
          contentFit="cover"
          className="w-52 h-52 rounded-3xl"
        />
      </View>
    </>
  );
}
