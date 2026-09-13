import Pressable from "@/components/pressable";
import Text from "@/components/text";
import { Moon, Sun } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

export default function CheckIns() {
  const colorScheme = useColorScheme().colorScheme;
  const yellow = colorScheme === "dark" ? "#facc15" : "#eab308";
  const blue = colorScheme === "dark" ? "#3b82f6" : "#2563eb";

  return (
    <>
      <Text className="mt-6 mb-2 text-lg font-medium">Check ins</Text>
      <View className="flex-row items-center w-full justify-between gap-5">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start morning check in"
          hitSlop={8}
          className="p-3 rounded-lg border w-[47%] h-32"
          style={{ backgroundColor: `${yellow}1a`, borderColor: `${yellow}40` }}
        >
          <Sun size={24} color={yellow} />

          <Text className="mt-3 text-base font-semibold">Morning</Text>
          <Text muted className="mt-1 text-sm">Check in</Text>
        </Pressable>
        
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Start evening check in"
          hitSlop={8}
          className="p-3 rounded-lg border w-[47%] h-32"
          style={{ backgroundColor: `${blue}1a`, borderColor: `${blue}40` }}
        >
          <Moon size={24} color={blue} />

          <Text className="mt-3 text-base font-semibold">Evening</Text>
          <Text muted className="mt-1 text-sm">Check in</Text>
        </Pressable>
      </View>
    </>
  );
}
