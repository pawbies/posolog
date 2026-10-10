import Footer from "@/components/onboarding/footer";
import Screen from "@/components/screen";
import Text from "@/components/text";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { useOnboarding } from "@/contexts/onboarding";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Alert, View } from "react-native";

export default function OnboardingScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {setCompletedOnboarding} = useOnboarding();
  const { t } = useTranslation();
  
  const handle = async () => {
    setLoading(true);
    try {
      await setCompletedOnboarding(true);
      router.replace("/");
    } catch {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <View className="flex-row mx-auto items-center gap-2 mt-2">
        <Image
          source={require("@/assets/images/android-icon-foreground.png")}
          className="aspect-square w-12 h-12"
        />
        <Text className="font-bold text-4xl text-center">
          Posolog
        </Text>
      </View>

      <Footer
        continueText={t("onboarding.continue")}
        onContinue={handle}
        bottomElement={
          <Text className="text-center text-sm">
            <Trans
              i18nKey="onboarding.consent"
              components={{
                tos: <Link href="/legal/terms-of-service" className="text-blue-600 font-semibold" />,
                pp: <Link href="/legal/privacy-policy" className="text-blue-600 font-semibold" />,
              }}
              />
          </Text>
        }
        loading={loading}
      />
    </Screen>
  );
}
