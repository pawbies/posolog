import EmptyState from "@/components/ui/empty-state";
import Screen from "@/components/ui/screen";

export default function IngredientScreen() {
  return (
    <Screen>
      <EmptyState
        title="Coming soon"
        body="Ingredient details are still being built. Check back in a future update."
      />
    </Screen>
  );
}
