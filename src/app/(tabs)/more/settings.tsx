import {
  getPreventScreenCapture,
  setPreventScreenCapture,
} from "@/lib/screen-capture-setting";
import { EyeOff, Settings, type LucideIcon } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { Alert, ScrollView, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SectionProps = {
  title?: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<ToggleRowProps>[];

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

type ToggleRowProps = {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  first?: boolean;
};

function ToggleRow({
  icon: Icon,
  iconColor,
  title,
  description,
  value,
  onValueChange,
  disabled = false,
  first = false,
}: ToggleRowProps) {
  const { colorScheme } = useColorScheme();
  const accent = colorScheme === "dark" ? "#9333ea" : "#a78bfa";

  return (
    <View
      className={`flex-row items-center py-4 pr-4 pl-4 ${
        first ? "" : "border-t border-neutral-200 dark:border-neutral-800"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Icon size={24} color={iconColor ?? accent} />
      <View className="flex-1 ml-4">
        <Text className="text-lg text-black dark:text-white">{title}</Text>
        {description ? (
          <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {description}
          </Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={title}
        accessibilityHint={description}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const [preventScreenCapture, setPreventScreenCaptureToggle] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    getPreventScreenCapture()
      .then((enabled) => {
        if (mounted.current) setPreventScreenCaptureToggle(enabled);
      })
      .catch((error) => {
        console.warn("Failed to read screen capture setting", error);
        Alert.alert(
          "Couldn't load settings",
          "Your security settings could not be read. They may not reflect what's currently active."
        );
      })
      .finally(() => {
        if (mounted.current) setLoaded(true);
      });
  }, []);

  const handlePreventScreenCaptureChange = useCallback(
    async (next: boolean) => {
      if (busy) return;

      const previous = preventScreenCapture;
      setPreventScreenCaptureToggle(next);
      setBusy(true);

      try {
        await setPreventScreenCapture(next);
      } catch (error) {
        console.warn("Failed to update screen capture setting", error);
        if (mounted.current) setPreventScreenCaptureToggle(previous);
        Alert.alert(
          "Couldn't change setting",
          "Screen capture protection could not be updated. Your previous setting is still active."
        );
      } finally {
        if (mounted.current) setBusy(false);
      }
    },
    [busy, preventScreenCapture]
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

        <Section title="Security">
          <ToggleRow
            icon={EyeOff}
            iconColor="#ef4444"
            title="Prevent Screen Capture"
            description="Blocks screenshots and screen recordings of the app"
            value={preventScreenCapture}
            onValueChange={handlePreventScreenCaptureChange}
            disabled={!loaded || busy}
          />
        </Section>
      </ScrollView>
    </View>
  );
}