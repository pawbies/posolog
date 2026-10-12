import Footer from "@/components/onboarding/footer";
import Header from "@/components/onboarding/header";
import Screen from "@/components/ui/screen";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen>
      <Header />

      <Footer
        continueText={t("onboarding.continue")}
        onContinue={() => router.replace("/onboarding/disclaimer")}
        loading={false}
      />
    </Screen>
  );
}
