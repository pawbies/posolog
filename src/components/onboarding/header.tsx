import { Image } from "@/components/ui/image";
import Text from "@/components/ui/text";
import { View } from "react-native";

export default function Header() {
  return (
    <View className="flex-row mx-auto items-center gap-2 mt-2">
      <Image
        source={require("@/assets/images/android-icon-foreground.png")}
        className="aspect-square w-12 h-12"
      />
      <Text className="font-bold text-4xl text-center">
        Posolog
      </Text>
    </View>
  );
}
