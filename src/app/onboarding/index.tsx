import Footer from "@/components/onboarding/footer";
import { Image } from "@/components/ui/image";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();

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
        onContinue={() => router.replace("/onboarding/disclaimer")}
        loading={false}
      />
    </Screen>
  );
}
