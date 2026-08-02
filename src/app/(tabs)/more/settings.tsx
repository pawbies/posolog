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
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { ScrollView, Switch, Text, View } from "react-native";
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
  first?: boolean;
};

function ToggleRow({
  icon: Icon,
  iconColor,
  title,
  description,
  value,
  onValueChange,
  first = false,
}: ToggleRowProps) {
  const { colorScheme } = useColorScheme();
  const accent = colorScheme === "dark" ? "#9333ea" : "#a78bfa";

  return (
    <View
      className={`flex-row items-center py-4 pr-4 pl-4 ${
        first ? "" : "border-t border-neutral-200 dark:border-neutral-800"
      }`}
    >
      <Icon size={24} color={iconColor || accent} />
      <View className="flex-1 ml-4">
        <Text className="text-lg text-black dark:text-white">{title}</Text>
        {description ? (
          <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            {description}
          </Text>
        ) : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const [preventScreenCaptureToggle, setPreventScreenCaptureToggle] = useState(false);

  useEffect(() => {
    getPreventScreenCapture().then(setPreventScreenCaptureToggle);
  }, []);

  const handlePreventScreenCaptureChange = (value: boolean) => {
    const previous = preventScreenCaptureToggle;
    setPreventScreenCaptureToggle(value);

    setPreventScreenCapture(value).catch(() => {
      setPreventScreenCaptureToggle(previous);
    });
  };

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
            value={preventScreenCaptureToggle}
            onValueChange={handlePreventScreenCaptureChange}
          />
        </Section>
      </ScrollView>
    </View>
  );
}
