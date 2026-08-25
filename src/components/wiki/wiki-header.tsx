import Text from "@/components/text";
import { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

type WikiHeaderProps = {
  icon: LucideIcon;
  heading: string;
  path: string;
}

export default function WikiHeader({ icon: Icon, heading, path }: WikiHeaderProps) {
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#e879f9" : "#c026d3";

  return (
    <>
      <View className="pt-6 pb-2 flex-row items-center">
        <View className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-violet-950 items-center justify-center">
          <Icon size={26} color={iconColor} />
        </View>
        <View className="flex-1 ml-3">
          <Text muted className="text-xs font-medium uppercase tracking-wider">
            {path}
          </Text>
          <Text className="text-2xl font-semibold">
            {heading}
          </Text>
        </View>
      </View>

      <View className="h-px bg-border my-5" />
    </>
  )
}
