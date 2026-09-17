import Pressable from "@/components/pressable";
import Text from "@/components/text";
import { LucideIcon } from "lucide-react-native";
import { View } from "react-native";

type MetricCardProps = {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export default function MetricCard({ icon: Icon, iconColor, title, subtitle, onPress }: MetricCardProps) {
  return (

    <View className="w-1/2 px-1.5 mb-3">
      <Pressable
        onPress={onPress}
        className="h-36 bg-surface rounded-2xl p-4 justify-between active:opacity-60"
      >
        <View className="w-11 h-11 rounded-full bg-white dark:bg-neutral-800 items-center justify-center">
          <Icon size={24} color={iconColor} />
        </View>
        <View>
          <Text className="text-lg font-medium">{title}</Text>
          <Text muted className="text-sm mt-0.5">
            {subtitle}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
