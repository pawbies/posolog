import Heading from "@/components/ui/heading";
import Screen from "@/components/ui/screen";
import ScreenTitle from "@/components/ui/screen-title";
import MetricCard from "@/components/tracking/metric-card";
import { useRouter } from "expo-router";
import { Dna, HeartPulse, TestTubes } from "lucide-react-native";
import { Alert, View } from "react-native";

export default function TrackingScreen() {
  const router = useRouter();

  return (
    <Screen>
      <ScreenTitle subtitle="Keep an eye on your health">Tracking</ScreenTitle>

      <Heading size="xs" className="mb-3 ml-2 text-text-muted">Health metrics</Heading>

      <View className="-mx-1.5 flex-row flex-wrap">
        <MetricCard
          icon={HeartPulse}
          tone="rose"
          title="Blood pressure"
          subtitle="Systolic / diastolic"
          onPress={() => router.push("/tracking/blood-pressure")}
        />
        <MetricCard
          icon={Dna}
          tone="sky"
          title="Biomarkers"
          subtitle="Tracked indicators"
          onPress={() => Alert.alert("Not implemented yet", "The biomarker pages are still in development")}
        />
        <MetricCard
          icon={TestTubes}
          tone="mint"
          title="Lab work"
          subtitle="Panels and results"
          onPress={() => Alert.alert("Not implemented yet", "The lab work pages are still in development")}
        />
      </View>
    </Screen>
  );
}
