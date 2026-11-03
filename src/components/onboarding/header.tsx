import Heading from "@/components/ui/heading";
import Mascot from "@/components/ui/mascot";
import { View } from "react-native";

export default function Header() {
  return (
    <View className="mx-auto mt-2 flex-row items-center gap-1.5">
      <Mascot variant="head" className="h-11 w-11" />
      <Heading size="lg">posolog</Heading>
    </View>
  );
}
