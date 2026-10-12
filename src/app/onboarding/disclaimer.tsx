import Footer from "@/components/onboarding/footer";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import PageHero from "@/components/ui/page-hero";
import Pressable from "@/components/ui/pressable";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { useSettings } from "@/contexts/settings";
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

      <PageHero
        icon={TriangleAlert}
        iconColor="#db3737"
        tileClassName="bg-red-100 dark:bg-red-950"
        title="Before you start"
        subtitle="Please read these points carefully"
      />

      <View className="bg-surface rounded-2xl px-4">
        {POINTS.map(({ icon: Icon, title, body }, i) => (
          <View
            key={title}
            className={cn("flex-row gap-4 py-4", i > 0 && "border-t border-border")}
          >
            <View className="w-10 h-10 rounded-xl items-center justify-center bg-red-100 dark:bg-red-950">
              <Icon size={20} color="#db3737" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold">{title}</Text>
              <Text muted className="text-sm leading-5 mt-0.5">{body}</Text>
            </View>
          </View>
        ))}
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        onPress={() => setChecked((c) => !c)}
        className={cn(
          "flex-row items-center gap-3 mt-4 mb-40 rounded-2xl p-4 border-2",
          checked ? "border-primary bg-primary/10" : "border-border bg-transparent"
        )}
      >
        <Host matchContents>
          <Checkbox value={checked} onValueChange={setChecked} />
        </Host>
        <Text className="flex-1 text-base">I understand and accept these points</Text>
      </Pressable>

      <Footer
        disabled={!checked}
        continueText={t("onboarding.continue_to_app")}
        onContinue={finish}
        animated
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
