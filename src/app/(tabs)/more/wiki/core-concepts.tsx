import { Microscope } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ArticleSectionProps = {
  title: string;
  children: ReactNode;
};

function ArticleSection({ title, children }: ArticleSectionProps) {
  return (
    <View className="mb-7">
      <Text className="text-xl font-semibold text-black dark:text-white mb-2 ml-1">
        {title}
      </Text>
      <Text className="text-base leading-6 text-neutral-600 dark:text-neutral-300 ml-1">
        {children}
      </Text>
    </View>
  );
}

type DefinitionListProps = {
  title: string;
  children: ReactNode;
};

function DefinitionList({ title, children }: DefinitionListProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<DefinitionProps>[];

  return (
    <View className="mb-7">
      <Text className="text-xl font-semibold text-black dark:text-white mb-2 ml-1">
        {title}
      </Text>
      <View className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden">
        {rows.map((child, i) => (
          <View
            key={i}
            className={`px-4 py-3 ${i === 0 ? "" : "border-t border-neutral-200 dark:border-neutral-800"}`}
          >
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}

type DefinitionProps = {
  term: string;
  children: ReactNode;
};

function Definition({ term, children }: DefinitionProps) {
  return (
    <View>
      <Text className="text-base font-medium text-black dark:text-white mb-1">{term}</Text>
      <Text className="text-base leading-6 text-neutral-600 dark:text-neutral-300">
        {children}
      </Text>
    </View>
  );
}

export default function CoreConceptsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#fff" : "#000";

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4"
      >
        <View className="pt-6 pb-1">
          <View className="flex-row items-center">
            <Microscope size={28} color={iconColor} />
            <Text className="text-3xl font-semibold text-black dark:text-white ml-2">
              Core concepts
            </Text>
          </View>
          <Text className="text-base text-neutral-500 dark:text-neutral-400 mt-1 ml-1">
            Basic pharmacology
          </Text>
        </View>

        <View className="h-px bg-neutral-200 dark:bg-neutral-800 my-5" />

        <ArticleSection title="Pharmacokinetics vs. pharmacodynamics">
          Pharmacology is generally split into two complementary views of a drug's
          journey through the body. Pharmacokinetics (PK) describes what the body
          does to a drug — its absorption, distribution, metabolism, and excretion.
          Pharmacodynamics (PD) describes what the drug does to the body — the
          relationship between drug concentration and its biological effect.
          Together, PK and PD explain why a dose works, how long it lasts, and how
          changes in dosing translate into changes in effect.
        </ArticleSection>

        <ArticleSection title="The plasma concentration curve">
          After a dose is taken, the concentration of a drug in the blood rises as
          it is absorbed and falls as it is eliminated, tracing a curve over time.
          This curve is the foundation for most of the calculations in posolog: it
          determines when a drug reaches its peak effect, how much of it is in the
          body at any given moment, and when the next dose should be taken to
          maintain a therapeutic level.
        </ArticleSection>

        <DefinitionList title="Key terms">
          <Definition term="Bioavailability (F)">
            The fraction of an administered dose that reaches systemic circulation
            unchanged. An intravenous dose has 100% bioavailability; oral doses are
            usually lower due to incomplete absorption and first-pass metabolism.
          </Definition>
          <Definition term="Cmax and Tmax">
            Cmax is the peak plasma concentration reached after a dose. Tmax is the
            time it takes to reach that peak. Together they describe how quickly
            and how strongly a dose takes effect.
          </Definition>
          <Definition term="Half-life (t½)">
            The time it takes for the plasma concentration of a drug to fall by
            half. Half-life determines how quickly a drug clears the body and how
            often it needs to be redosed.
          </Definition>
          <Definition term="Volume of distribution (Vd)">
            A theoretical volume that relates the total amount of drug in the body
            to its plasma concentration. It reflects how extensively a drug spreads
            into tissues versus staying in the bloodstream.
          </Definition>
          <Definition term="Clearance (CL)">
            The volume of plasma from which a drug is completely removed per unit
            of time. Clearance, together with volume of distribution, determines a
            drug's half-life.
          </Definition>
          <Definition term="Steady state">
            The point during repeated dosing at which the amount of drug taken in
            each interval equals the amount eliminated, so plasma concentrations
            plateau between a predictable peak and trough.
          </Definition>
        </DefinitionList>
      </ScrollView>
    </View>
  );
}
