import ButtonRow, { ButtonRowProps } from "@/components/settings/button-row";
import ToggleRow, { ToggleRowProps } from "@/components/settings/toggle-row";
import {
  getPreventScreenCaptureSetting,
  setPreventScreenCaptureSetting
} from "@/lib/settings/security/prevent-screen-capture";
import * as Linking from "expo-linking";
import { EyeOff, Languages, Settings } from "lucide-react-native";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode
} from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SectionProps = {
  title?: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<ToggleRowProps | ButtonRowProps>[];

  return (
    <View className="mb-7">
      {title ? (
        <Text className="text-base text-neutral-500 dark:text-neutral-400 ml-5 mb-2">
          {title}
        </Text>
      ) : null}
      <View className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden">
        {rows.map((child, i) => cloneElement(child, { first: i === 0 }))}
      </View>
    </View>
  );
}


export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const [preventScreenCaptureToggleState, setPreventScreenCaptureToggleState] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);


  useEffect(() => {
    getPreventScreenCaptureSetting()
      .then((enabled) => {
        setPreventScreenCaptureToggleState(enabled);
      })
      .catch(() => {
        Alert.alert(
          "Couldn't load settings",
          "Your security settings could not be read. They may not reflect what's currently active."
        );
      })
      .finally(() => {
        setLoaded(true);
      });
  }, []);

  const handlePreventScreenCaptureChange = useCallback(
    async (next: boolean) => {
      if (busy) return;

      const previous = preventScreenCaptureToggleState;
      setPreventScreenCaptureToggleState(next);
      setBusy(true);

      try {
        await setPreventScreenCaptureSetting(next);
      } catch {
        setPreventScreenCaptureToggleState(previous);
        Alert.alert(
          "Couldn't change setting",
          "Screen capture protection could not be updated. Your previous setting is still active."
        );
      } finally {
        setBusy(false);
      }
    },
    [busy, preventScreenCaptureToggleState]
  );

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4"
      >
        <View className="items-center pt-10 pb-8">
          <View className="w-28 h-28 rounded-3xl bg-blue-100 dark:bg-blue-950 items-center justify-center">
            <Settings size={56} color="#3b82f6" />
          </View>
          <Text className="text-3xl font-semibold text-black dark:text-white mt-4 text-center">
            Settings
          </Text>
        </View>

        <Section title="General">
          <ButtonRow
            icon={Languages}
            iconColor="#57e389"
            title="Language"
            description="Change the app's language via the devices settings"
            buttonText="Open Settings"
            onPress={Linking.openSettings}
          />
        </Section>

        <Section title="Security">
          <ToggleRow
            icon={EyeOff}
            iconColor="#ef4444"
            title="Prevent Screen Capture"
            description="Blocks screenshots and screen recordings of the app"
            value={preventScreenCaptureToggleState}
            onValueChange={handlePreventScreenCaptureChange}
            disabled={!loaded || busy}
          />
        </Section>
      </ScrollView>
    </View>
  );
}