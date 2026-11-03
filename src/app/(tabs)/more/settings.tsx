import ButtonRow from "@/components/list/button-row";
import Section from "@/components/list/section";
import ToggleRow from "@/components/list/toggle-row";
import PageHero from "@/components/ui/page-hero";
import Screen from "@/components/ui/screen";
import { useSettings } from "@/contexts/settings";
import * as Linking from "expo-linking";
import { DoorOpen, EyeOff, Languages, Settings } from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";

export default function SettingsScreen() {
  const { preventScreenCapture, setSetting } = useSettings();
  const [busy, setBusy] = useState(false);

  const changePreventScreenCapture = async (next: boolean) => {
    if (busy) return;
    setBusy(true);
    try {
      await setSetting("preventScreenCapture", next);
    } catch {
      Alert.alert(
        "Couldn't change setting",
        "Screen capture protection could not be updated. Your previous setting is still active."
      );
    } finally {
      setBusy(false);
    }
  };

  const restartOnboarding = () =>
    Alert.alert("Show onboarding again?", "You'll go through the welcome screens again. Your data stays as it is.", [
      { text: "Cancel", style: "cancel" },
      { text: "Show", onPress: () => setSetting("completedOnboarding", false) },
    ]);

  return (
    <Screen>
      <PageHero icon={Settings} tone="sky" title="Settings" />

      <Section title="General">
        <ButtonRow
          icon={Languages}
          tone="mint"
          title="Language"
          description="Change the app's language in your device's settings"
          buttonText="Open"
          onPress={Linking.openSettings}
        />
        <ButtonRow
          icon={DoorOpen}
          tone="sky"
          title="Onboarding"
          description="See the welcome screens again"
          buttonText="Show"
          onPress={restartOnboarding}
          disabled={busy}
        />
      </Section>

      <Section title="Security">
        <ToggleRow
          icon={EyeOff}
          tone="rose"
          title="Prevent Screen Capture"
          description="Blocks screenshots and screen recordings of the app"
          value={preventScreenCapture}
          onValueChange={changePreventScreenCapture}
          disabled={busy}
        />
      </Section>
    </Screen>
  );
}
