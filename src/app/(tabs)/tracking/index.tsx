import Screen from "@/components/ui/screen";
import ScreenTitle from "@/components/ui/screen-title";
import Text from "@/components/ui/text";
import MetricCard from "@/components/tracking/metric-card";
import { useRouter } from "expo-router";
import { Dna, HeartPulse, TestTubes } from "lucide-react-native";
import { Alert, View } from "react-native";

export default function TrackingScreen() {
  const router = useRouter();

  return (
    <Screen>
      <ScreenTitle>Tracking</ScreenTitle>

      <Text muted className="text-base ml-1 mb-3">
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
          onPress={() => Alert.alert("Not implemented yet", "The biomarker pages are still in development")}
        />
        <MetricCard
          icon={TestTubes}
          iconColor="#22c55e"
          title="Lab work"
          subtitle="Panels and results"
          onPress={() => Alert.alert("Not implemented yet", "The lab work pages are still in development")}
        />
      </View>
    </Screen>
  );
}
