import Pressable from "@/components/pressable";
import { useOnboarding } from "@/contexts/onboarding";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const {setCompletedOnboarding} = useOnboarding();
  
  const handle = async () => {
    setLoading(true);
    await setCompletedOnboarding(false);
    setLoading(false);
    router.replace("/");
  }

  return (
    <ScrollView
      className="px-4 flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Text>Hello</Text>

      <Pressable
          accessibilityRole="button"
          onPress={handle}
          disabled={loading}
          className="mt-14 min-h-16 flex-row items-center justify-center gap-2 rounded-full bg-primary"
        >
          {loading ?
            <ActivityIndicator size="small" color="#ffffff" /> :
            <Text className="text-lg font-semibold text-white">Un-Complete onboarding</Text>
          }
        </Pressable>
    </ScrollView>
  );
}
