import WikiPage from "@/components/wiki/wiki-page";
import { findWikiArticle } from "@/lib/wiki";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";

export default function WikiArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const match = findWikiArticle(slug);

  if (!match) return <Redirect href="/more/wiki" />;

  const { section, article } = match;
  const Body = article.body;

  return (
    <>
      <Stack.Screen options={{ title: article.headerTitle ?? article.title }} />
      <WikiPage icon={article.icon} heading={article.title} path={section.path}>
        {Body && <Body />}
      </WikiPage>
    </>
  );
}
