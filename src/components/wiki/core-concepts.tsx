import Heading from "@/components/ui/heading";
import Text from "@/components/ui/text";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { View } from "react-native";

type ArticleSectionProps = {
  title: string;
  children: ReactNode;
};

function ArticleSection({ title, children }: ArticleSectionProps) {
  return (
    <View className="mb-7">
      <Heading size="md" className="mb-2 ml-1">{title}</Heading>
      <Text className="ml-1 text-base leading-7 opacity-80">
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
      <Heading size="md" className="mb-3 ml-1">{title}</Heading>
      <View className="overflow-hidden rounded-[28px] border-2 border-border bg-surface">
        {rows.map((child, i) => (
          <View
            key={i}
            className={`px-5 py-4 ${i === 0 ? "" : "border-t-2 border-border"}`}
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
      <Text className="mb-1 font-display-bold text-[17px]">{term}</Text>
      <Text muted className="text-base leading-6">
        {children}
      </Text>
    </View>
  );
}

export default function CoreConcepts() {
  return (
    <>
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
    </>
  );
}
