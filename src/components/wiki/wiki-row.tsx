import Pressable from "@/components/pressable";
import Text from "@/components/text";
import { Href, useRouter } from "expo-router";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { View } from "react-native";

export type WikiRowProps = {
  icon: LucideIcon;
  title: string;
  href: Href;
  first?: boolean;
};


export function WikiRow({ icon: Icon, title, href, first = false }: WikiRowProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  return (
    <Pressable onPress={() => router.push(href)}>
      <View className={`ml-4 py-4 pr-4 flex-row items-center ${ first ? "" : "border-t border-border" }`}>
        <Icon
          size={24}
          color={colorScheme === "dark" ? "#9333ea" : "#a78bfa"}
        />
        <Text className="flex-1 ml-4 text-lg">{title}</Text>
        <ChevronRight
          size={20}
          color={colorScheme === "dark" ? "#71717a" : "#a1a1aa"}
        />
      </View>
    </Pressable>
  );
}
