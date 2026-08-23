import Pressable from "@/components/pressable";
import { useRouter, type Href } from "expo-router";
import {
    AreaChart,
    ArrowLeftRight,
    Atom,
    BookOpenText,
    Boxes,
    ChartNoAxesCombined,
    ChartScatter,
    ChartSpline,
    ChevronRight,
    Clock,
    Droplet,
    Droplets,
    FlaskConical,
    HeartPulse,
    Magnet,
    Microscope,
    Repeat,
    Scale,
    Share2,
    SlidersHorizontal,
    TestTubeDiagonal,
    TrendingDown,
    type LucideIcon
} from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<RowProps>[];

  return (
    <View className="mb-7">
      <Text className="text-base text-text-muted ml-5 mb-2">
        {title}
      </Text>
      <View className="bg-surface rounded-2xl overflow-hidden">
        {rows.map((child, i) => cloneElement(child, { first: i === 0 }))}
      </View>
    </View>
  );
}

type RowProps = {
  icon: LucideIcon;
  title: string;
  href: Href;
  first?: boolean;
};

function Row({ icon: Icon, title, href, first = false }: RowProps) {
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  return (
    <Pressable onPress={() => router.push(href)}>
      <View className={`ml-4 py-4 pr-4 flex-row items-center ${ first ? "" : "border-t border-border" }`}>
        <Icon
          size={24}
          color={colorScheme === "dark" ? "#9333ea" : "#a78bfa"}
        />
        <Text className="flex-1 ml-4 text-lg text-black dark:text-white">{title}</Text>
        <ChevronRight
          size={20}
          color={colorScheme === "dark" ? "#71717a" : "#a1a1aa"}
        />
      </View>
    </Pressable>
  );
}

export default function WikiScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView className="px-4 flex-1 bg-background">
      <View className="items-center pt-10 pb-8">
        <View className="w-28 h-28 rounded-3xl bg-purple-100 dark:bg-violet-100 items-center justify-center">
          <BookOpenText size={56} color="#c026d3" />
        </View>
        <Text className="text-3xl font-semibold text-text mt-4 text-center">
          Wiki
        </Text>
      </View>

      <View className="bg-surface rounded-2xl p-4 mb-7">
        <Text className="text-base leading-6 text-text-muted">
          We encourage you to read through our wiki pages to learn
          more about how posolog calculates its values and to gain deeper
          insight into pharmacokinetics.
        </Text>
      </View>

      <Section title="Basic pharmacology">
        <Row icon={Microscope} title="Core concepts" href="/more/wiki/core-concepts" />
        <Row icon={TestTubeDiagonal} title="Common terminology" href="/more/wiki/common-terminology" />
      </Section>

      <Text className="text-xl font-semibold text-black dark:text-white mb-3 ml-1">
        Pharmacokinetics
      </Text>

      <Section title="Processes - ADME">
        <Row icon={Droplet} title="Absorption" href="/more/wiki/pk/adme/absorption" />
        <Row icon={Share2} title="Distribution" href="/more/wiki/pk/adme/distribution" />
        <Row icon={FlaskConical} title="Metabolism" href="/more/wiki/pk/adme/metabolism" />
        <Row icon={Droplets} title="Excretion" href="/more/wiki/pk/adme/excretion" />
      </Section>

      <Section title="Modeling and simulation - M&S">
        <Row icon={Boxes} title="Compartment modeling" href="/more/wiki/pk/ms/compartment-modeling" />
        <Row icon={AreaChart} title="Non-compartment analysis - NCA" href="/more/wiki/pk/ms/non-compartment-analysis" />
        <Row icon={HeartPulse} title="Physiologically based PK - PBPK" href="/more/wiki/pk/ms/pbpk" />
        <Row icon={ChartScatter} title="Population PK - popPK" href="/more/wiki/pk/ms/pop-pk" />
        <Row icon={ChartSpline} title="Linear vs. nonlinear kinetics" href="/more/wiki/pk/ms/linear-nonlinear-kinetics" />
        <Row icon={Repeat} title="Multiple-dose kinetics" href="/more/wiki/pk/ms/multiple-dose-kinetics" />
      </Section>

      <Text className="text-xl font-semibold text-black dark:text-white mb-3 ml-1">
        Pharmacodynamics
      </Text>

      <Section title="Mechanism">
        <Row icon={Atom} title="Receptor theory" href="/more/wiki/pd/mechanism/receptor-theory" />
        <Row icon={ArrowLeftRight} title="Agonism and antagonism" href="/more/wiki/pd/mechanism/agonism-antagonism" />
        <Row icon={Magnet} title="Affinity and efficacy" href="/more/wiki/pd/mechanism/affinity-efficacy" />
      </Section>

      <Section title="Quantitative response">
        <Row icon={ChartNoAxesCombined} title="Emax and Hill models" href="/more/wiki/pd/quantitative-response/emax-hill-models" />
        <Row icon={Scale} title="Potency vs. efficacy" href="/more/wiki/pd/quantitative-response/potency-vs-efficacy" />
        <Row icon={SlidersHorizontal} title="Therapeutic window" href="/more/wiki/pd/quantitative-response/therapeutic-window" />
        <Row icon={Clock} title="Effect delay" href="/more/wiki/pd/quantitative-response/effect-delay" />
        <Row icon={TrendingDown} title="Tolerance" href="/more/wiki/pd/quantitative-response/tolerance" />
      </Section>
    </ScrollView>
  );
}
