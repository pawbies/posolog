import { Heart } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DonateScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4"
      >
        <View className="items-center pt-10 pb-8">
          <View className="w-28 h-28 rounded-3xl bg-red-100 dark:bg-red-950 items-center justify-center">
            <Heart size={56} color="#ef4444" />
          </View>
          <Text className="text-3xl font-semibold text-black dark:text-white mt-4 text-center">
            Donations coming soon
          </Text>
          <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Not available yet
          </Text>
        </View>

        <View className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-4 mb-7">
          <Text className="text-base leading-6 text-neutral-600 dark:text-neutral-300">
            We don't currently accept donations, but we plan to in the future. Once support is
            ready, you'll be able to contribute right here to help keep posolog free and in
            active development.
          </Text>
        </View>

        <Text className="text-base leading-6 text-neutral-500 dark:text-neutral-400 text-center px-2">
          Until then, thank you for using posolog. Sharing it with someone who might find it
          useful helps just as much.
        </Text>
      </ScrollView>
    </View>
  );
}
