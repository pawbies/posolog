import { useRouter } from "expo-router";
import { Dna, HeartPulse, TestTubes, type LucideIcon } from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type MetricCardProps = {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

function MetricCard({ icon: Icon, iconColor, title, subtitle, onPress }: MetricCardProps) {
  return (
    <View className="w-1/2 px-1.5 mb-3">
      <Pressable
        onPress={onPress}
        className="h-36 bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-4 justify-between active:opacity-60"
      >
        <View className="w-11 h-11 rounded-full bg-white dark:bg-neutral-800 items-center justify-center">
          <Icon size={24} color={iconColor} />
        </View>
        <View>
          <Text className="text-lg font-medium text-black dark:text-white">{title}</Text>
          <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {subtitle}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

export default function TrackingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        className="px-4"
      >
        <Text className="text-3xl font-semibold text-black dark:text-white mb-6 ml-1">
          Tracking
        </Text>

        <Text className="text-base text-neutral-500 dark:text-neutral-400 ml-1 mb-3">
          Health metrics
        </Text>

        <View className="flex-row flex-wrap -mx-1.5">
          <MetricCard
            icon={HeartPulse}
            iconColor="#ef4444"
            title="Blood pressure"
            subtitle="Systolic / diastolic"
            onPress={() => router.push("/tracking/blood-pressure")}
          />
          <MetricCard
            icon={Dna}
            iconColor="#3b82f6"
            title="Biomarkers"
            subtitle="Tracked indicators"
          />
          <MetricCard
            icon={TestTubes}
            iconColor="#22c55e"
            title="Lab work"
            subtitle="Panels and results"
          />
        </View>
      </ScrollView>
    </View>
  );
}
