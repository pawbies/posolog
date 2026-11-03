import Footer from "@/components/onboarding/footer";
import Header from "@/components/onboarding/header";
import Heading from "@/components/ui/heading";
import IconBadge from "@/components/ui/icon-badge";
import Mascot from "@/components/ui/mascot";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { type Tone } from "@/constants/colors";
import { cn } from "@/lib/cn";
import { toneBg } from "@/constants/colors";
import { useRouter } from "expo-router";
import { ChartSpline, HatGlasses, Pill, type LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

const FEATURES: { icon: LucideIcon; tone: Tone; title: string; body: string }[] = [
  { icon: Pill, tone: "peach", title: "Log your medications", body: "Keep every pill, patch and spray on one tidy shelf." },
  { icon: ChartSpline, tone: "sky", title: "See your plasma curves", body: "Understand how much is active in your body, right now." },
  { icon: HatGlasses, tone: "lilac", title: "Private by design", body: "No accounts, no tracking. Your data never leaves your phone." },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Screen
      footer={
        <Footer
          continueText={t("onboarding.continue")}
          onContinue={() => router.replace("/onboarding/disclaimer")}
          loading={false}
        />
      }
    >
      <Header />

      <View className="mt-8 items-center">
        <View className="h-56 w-56 items-center justify-center rounded-full bg-tint-mint">
          <Mascot className="h-48 w-36" />
        </View>
        <Heading size="xl" className="mt-6 text-center">Your meds,{"\n"}made simple</Heading>
        <Text muted className="mt-2 px-4 text-center text-base leading-6">
          Track what you take and learn how it works, without the guesswork.
        </Text>
      </View>

      <View className="mt-8 gap-3">
        {FEATURES.map(({ icon, tone, title, body }) => (
          <View key={title} className={cn("flex-row items-center gap-4 rounded-[24px] p-4", toneBg[tone])}>
            <IconBadge icon={icon} tone={tone} onTint />
            <View className="flex-1">
              <Text className="font-display-bold text-base">{title}</Text>
              <Text muted className="mt-0.5 text-sm leading-5">{body}</Text>
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
}
