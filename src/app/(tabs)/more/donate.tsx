import { Heart } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DonateScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView className="px-4 flex-1 bg-background">
      <View className="items-center pt-10 pb-8">
        <View className="w-28 h-28 rounded-3xl bg-red-100 dark:bg-red-950 items-center justify-center">
          <Heart size={56} color="#ef4444" />
        </View>
        <Text className="text-3xl font-semibold text-text mt-4 text-center">
          Donations coming soon
        </Text>
        <Text className="text-sm text-text-muted mt-1">
          Not available yet
        </Text>
      </View>

      <View className="bg-surface rounded-2xl p-4 mb-7">
        <Text className="text-base leading-6 text-text-muted">
          We don't currently accept donations, but we plan to in the future. Once support is
          ready, you'll be able to contribute right here to help keep posolog free and in
          active development.
        </Text>
      </View>

      <Text className="text-base leading-6 text-text-muted text-center px-2">
        Until then, thank you for using posolog. Sharing it with someone who might find it
        useful helps just as much.
      </Text>
    </ScrollView>
  );
}
