import Footer from "@/components/onboarding/footer";
import Header from "@/components/onboarding/header";
import IconBadge from "@/components/ui/icon-badge";
import { Link } from "@/components/ui/link";
import PageHero from "@/components/ui/page-hero";
import Pressable from "@/components/ui/pressable";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { useSettings } from "@/contexts/settings";
import { usePalette } from "@/hooks/use-palette";
import { cn } from "@/lib/cn";
import { Checkbox, Host } from "@expo/ui";
import { useRouter } from "expo-router";
import { DatabaseZap, ShieldOff, Stethoscope, TriangleAlert } from "lucide-react-native";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Alert, View } from "react-native";

const POINTS = [
  {
    icon: Stethoscope,
    title: "Not medical advice",
    body: "Always consult a medical professional before making any decisions about your health.",
  },
  {
    icon: ShieldOff,
    title: "Not a medical device",
    body: "Posolog is a personal tracking tool and should not be treated as a medical device.",
  },
  {
    icon: DatabaseZap,
    title: "Data may be incorrect",
    body: "Don't assume all information in the app is accurate. Double-check anything important.",
  },
];

export default function DisclaimerScreen() {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const { setSetting } = useSettings();
  const { t } = useTranslation();
  const { brand } = usePalette();

  const finish = async () => {
    setLoading(true);
    try {
      await setSetting("completedOnboarding", true);
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      footer={
        <Footer
          disabled={!checked}
          continueText={t("onboarding.continue_to_app")}
          onContinue={finish}
          animated
          bottomElement={
            <Text muted className="px-2 text-center text-sm leading-5">
              <Trans
                i18nKey="onboarding.consent"
                components={{
                  tos: <Link href="/legal/terms-of-service" className="font-bold text-primary" />,
                  pp: <Link href="/legal/privacy-policy" className="font-bold text-primary" />,
                }}
              />
            </Text>
          }
          loading={loading}
        />
      }
    >
      <Header />

      <PageHero
        icon={TriangleAlert}
        tone="peach"
        title="Before you start"
        subtitle="Please read these points carefully"
      />

      <View className="overflow-hidden rounded-[28px] border-2 border-border bg-surface px-4">
        {POINTS.map(({ icon, title, body }, i) => (
          <View
            key={title}
            className={cn("flex-row gap-4 py-4", i > 0 && "border-t-2 border-border")}
          >
            <IconBadge icon={icon} tone="peach" size="sm" className="h-10 w-10" />
            <View className="flex-1">
              <Text className="font-display-bold text-base">{title}</Text>
              <Text muted className="mt-0.5 text-sm leading-5">{body}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={() => setChecked((c) => !c)}
        className={cn(
          "mt-4 flex-row items-center gap-3 rounded-[24px] border-2 p-4",
          checked ? "border-primary bg-tint-mint" : "border-border bg-transparent"
        )}
      >
        <Host matchContents seedColor={brand}>
          <Checkbox value={checked} onValueChange={setChecked} />
        </Host>
        <Text className="flex-1 text-base font-medium">I understand and accept these points</Text>
      </Pressable>
    </Screen>
  );
}
