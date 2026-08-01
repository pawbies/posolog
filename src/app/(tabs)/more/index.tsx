import { useRouter, type Href } from "expo-router";
import {
  Calculator,
  ChartColumn,
  ChevronRight,
  CircleQuestionMark,
  Download,
  Heart,
  Info,
  Settings,
  Upload,
  type LucideIcon,
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SectionProps = {
  title?: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<RowProps>[];

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

type RowProps = {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  href: Href;
  first?: boolean;
};

function Row({ icon: Icon, title, href, first = false, iconColor = undefined }: RowProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const accent = colorScheme === "dark" ? "#9333ea" : "#a78bfa";
  const chevron = colorScheme === "dark" ? "#71717a" : "#a1a1aa";

  return (
    <Pressable
      onPress={() => router.push(href)}
      className={`flex-row items-center py-4 pr-4 ml-4 active:opacity-60 ${
        first ? "" : "border-t border-neutral-200 dark:border-neutral-800"
      }`}
    >
      <Icon size={24} color={iconColor || accent} />
      <Text className="flex-1 ml-4 text-lg text-black dark:text-white">{title}</Text>
      <ChevronRight size={20} color={chevron} />
    </Pressable>
  );
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        className="px-4"
      >
        <Text className="text-3xl font-semibold text-black dark:text-white mb-6 ml-1">
          More
        </Text>

        <Section title="Tools">
          <Row icon={Calculator} title="Calculator" href="/more/calculator" iconColor="#ef4444" />
          <Row icon={ChartColumn} title="Statistics" href="/more/statistics" iconColor="#f97316" />
        </Section>

        <Section title="Data">
          <Row icon={Download} title="Import" href="/more/import" iconColor="#fde047" />
          <Row icon={Upload} title="Export" href="/more/export" iconColor="#22c55e" />
        </Section>

        <Section title="App">
          <Row icon={Settings} title="Settings" href="/more/settings" iconColor="#3b82f6" />
          <Row icon={CircleQuestionMark} title="Wiki" href="/more/wiki" iconColor="#c026d3" />
          <Row icon={Heart} title="Donate" href="/more/donate" iconColor="#ef4444" />
          <Row icon={Info} title="About" href="/more/about" iconColor="#22c55e" />
        </Section>
      </ScrollView>
    </View>
  );
}