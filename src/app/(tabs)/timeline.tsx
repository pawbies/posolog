import EmptyState from "@/components/ui/empty-state";
import Screen from "@/components/ui/screen";
import ScreenTitle from "@/components/ui/screen-title";

export default function TimelineScreen() {
  return (
    <Screen>
      <ScreenTitle subtitle="Your doses over time">Timeline</ScreenTitle>
      <EmptyState
        title="Nothing here yet"
        body="Once you log doses, they'll line up here so you can look back at your day."
      />
    </Screen>
  );
}
