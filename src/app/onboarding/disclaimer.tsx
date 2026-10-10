import Footer from "@/components/onboarding/footer";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { useSettings } from "@/contexts/settings";
import { Checkbox, Host } from "@expo/ui";
import { useRouter } from "expo-router";
import { TriangleAlert } from "lucide-react-native";
import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Alert, View } from "react-native";

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
    } catch {
      Alert.alert("Error", "Something went wrong.");
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

      <View className="mt-32 bg-surface rounded-xl items-center py-4 px-3">
        <TriangleAlert size={64} color="#db3737" />
        <Text className="text-2xl font-bold">Important</Text>

        <Text className="mt-6 text-center">
          This app offers no medical advice,
          always consult a medical professional before making decisions.
        </Text>

        <Text className="mt-3 text-center">
          Posolog is NOT a medical device and should not be treated as such.
        </Text>

        <Text className="mt-3 text-center">
          Do NOT assume all data is correct.
        </Text>

        <View className="mt-12 items-center">
          <Text muted className="mb-4">Please confirm you understand these points:</Text>
          <Host matchContents>
              <Checkbox value={checked} onValueChange={setChecked} />
          </Host>
        </View>
      </View>

      <Footer
        disabled={!checked}
        continueText={t("onboarding.continue_to_app")}
        onContinue={finish}
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
