import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import Mascot from "@/components/ui/mascot";
import Text from "@/components/ui/text";
import { View } from "react-native";

export default function Footer() {
  return (
    <Card tone="mint" className="mt-10 flex-row items-center gap-4 pr-3">
      <View className="flex-1">
        <Heading size="sm">Thanks for using posolog!</Heading>
        <Text muted className="mt-1 text-sm leading-5">
          We hope you like our app. Take care of yourself today.
        </Text>
      </View>
      <Mascot className="-mb-8 h-28 w-20" />
    </Card>
  );
}
