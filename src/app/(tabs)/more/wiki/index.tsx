import Row from "@/components/list/link-row";
import Section from "@/components/list/section";
import InfoCard from "@/components/ui/info-card";
import PageHero from "@/components/ui/page-hero";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { WIKI_SECTIONS } from "@/lib/wiki";
import { BookOpenText } from "lucide-react-native";
import { Fragment } from "react";

export default function WikiScreen() {
  return (
    <Screen skipTopInset>
      <PageHero
        icon={BookOpenText}
        iconColor="#c026d3"
        tileClassName="bg-purple-100 dark:bg-violet-100"
        title="Wiki"
      />

      <InfoCard>
        We encourage you to read through our wiki pages to learn
        more about how posolog calculates its values and to gain deeper
        insight into pharmacokinetics.
      </InfoCard>

      {WIKI_SECTIONS.map((section) => (
        <Fragment key={section.title}>
          {section.group && (
            <Text className="text-xl font-semibold mb-3 ml-1">
              {section.group}
            </Text>
          )}
          <Section title={section.title}>
            {section.articles.map((article) => (
              <Row
                key={article.slug}
                icon={article.icon}
                title={article.title}
                href={{ pathname: "/more/wiki/[slug]", params: { slug: article.slug } }}
              />
            ))}
          </Section>
        </Fragment>
      ))}
    </Screen>
  );
}
