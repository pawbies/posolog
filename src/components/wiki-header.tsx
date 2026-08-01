import { LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Text, View } from "react-native";

type WikiHeaderProps = {
    icon: LucideIcon;
    heading: string;
    path: string;
}

export default function WikiHeader({icon: Icon, heading, path}: WikiHeaderProps) {
    const { colorScheme } = useColorScheme();
    const iconColor = colorScheme === "dark" ? "#fff" : "#000";

    return (
        <>
            <View className="pt-6 pb-1">
                <View className="flex-row items-center">
                <Icon size={28} color={iconColor} />
                <Text className="text-3xl font-semibold text-black dark:text-white ml-2">
                    {heading}
                </Text>
                </View>
                <Text className="text-base text-neutral-500 dark:text-neutral-400 mt-1 ml-1">
                    {path}
                </Text>
            </View>

            <View className="h-px bg-neutral-200 dark:bg-neutral-800 my-5" />
        </>
    )
}