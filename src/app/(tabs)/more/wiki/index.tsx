import Row from "@/components/list/link-row";
import Section from "@/components/list/section";
import InfoCard from "@/components/ui/info-card";
import PageHero from "@/components/ui/page-hero";
import Screen from "@/components/ui/screen";
import Heading from "@/components/ui/heading";
import { WIKI_SECTIONS } from "@/lib/wiki";
import { BookOpenText } from "lucide-react-native";
import { Fragment } from "react";

export default function WikiScreen() {
  return (
    <Screen>
      <PageHero icon={BookOpenText} tone="lilac" title="Wiki" />

      <InfoCard tone="lilac">
        We encourage you to read through our wiki pages to learn
        more about how posolog calculates its values and to gain deeper
        insight into pharmacokinetics.
      </InfoCard>

      {WIKI_SECTIONS.map((section) => (
        <Fragment key={section.title}>
          {section.group && (
            <Heading size="md" className="mb-3 ml-1 mt-2">
              {section.group}
            </Heading>
          )}
          <Section title={section.title}>
            {section.articles.map((article) => (
              <Row
                key={article.slug}
                icon={article.icon}
                tone="lilac"
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
