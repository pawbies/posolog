import Pressable from "@/components/pressable";
import Text from "@/components/text";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { useOnboarding } from "@/contexts/onboarding";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {setCompletedOnboarding} = useOnboarding();
  
  const handle = async () => {
    setLoading(true);
    await setCompletedOnboarding(true);
    setLoading(false);
    router.replace("/");
  }

  return (
    <ScrollView
      className="px-4 flex-1 bg-background"
      contentContainerStyle={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-row mx-auto items-center gap-2 mt-2">
        <Image
          source={require("@/assets/images/android-icon-foreground.png")}
          className="aspect-square w-12 h-12"
        />
        <Text className="font-bold text-4xl text-center">
          Posolog
        </Text>
      </View>

      <View
        className="absolute left-1/2 -translate-x-1/2 flex flex-col gap-1"
        style={{ bottom: insets.bottom }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={handle}
          disabled={loading}
          className="min-h-16 min-w-full flex-row items-center justify-center rounded-full bg-primary"
        >
          {loading ?
            <ActivityIndicator size="small" color="#ffffff" /> :
            <Text className="text-xl font-semibold text-white">Continue to the app</Text>
          }
        </Pressable>

        <Text className="text-center text-sm">
          By completing the onboarding you agree and consent to
          our{" "}
          <Link href={"/legal/terms-of-service"} className="text-blue-600 font-semibold">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href={"/legal/privacy-policy"} className="text-blue-600 font-semibold">
            Privacy Policy
          </Link>
          .
        </Text>
      </View>
    </ScrollView>
  );
}
