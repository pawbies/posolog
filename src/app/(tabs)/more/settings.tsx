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
  const { completedOnboarding, preventScreenCapture, setSetting } = useSettings();
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

  return (
    <Screen skipTopInset>
      <PageHero icon={Settings} iconColor="#3b82f6" tileClassName="bg-blue-100 dark:bg-blue-950" title="Settings" />

      <Section title="General">
        <ButtonRow
          icon={Languages}
          iconColor="#57e389"
          title="Language"
          description="Change the app's language via the devices settings"
          buttonText="Open Settings"
          onPress={Linking.openSettings}
        />
        <ToggleRow
          icon={DoorOpen}
          iconColor="#56a5f5"
          title="Completed onboarding"
          value={completedOnboarding}
          onValueChange={() => setSetting("completedOnboarding", false)}
          disabled={busy}
        />
      </Section>

      <Section title="Security">
        <ToggleRow
          icon={EyeOff}
          iconColor="#ef4444"
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
