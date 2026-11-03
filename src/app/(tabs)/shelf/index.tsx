import IngredientCard from "@/components/medication/ingredient-card";
import MedicationCard from "@/components/medication/medication-card";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Fab from "@/components/ui/fab";
import Screen from "@/components/ui/screen";
import ScreenTitle from "@/components/ui/screen-title";
import SearchField from "@/components/ui/search-field";
import Segmented from "@/components/ui/segmented";
import TopFade from "@/components/ui/top-fade";
import { allIngredients } from "@/db/queries/ingredients";
import { allMedications } from "@/db/queries/medications";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Showing = "medications" | "ingredients";

const TABS = [
  { key: "medications", label: "Medications" },
  { key: "ingredients", label: "Ingredients" },
] as const;

export default function ShelfScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [showing, setShowing] = useState<Showing>("medications");

  const { data: medications, updatedAt: medicationsLoadedAt } = useLiveQuery(allMedications());
  const { data: ingredients, updatedAt: ingredientsLoadedAt } = useLiveQuery(allIngredients());

  const q = query.trim().toLowerCase();
  const matches = (...fields: (string | null)[]) => fields.join(" ").toLowerCase().includes(q);

  const filteredMedications = q
    ? medications.filter((m) => matches(m.name, m.notes, m.form, m.route))
    : medications;
  const filteredIngredients = q
    ? ingredients.filter((i) => matches(i.name, i.notes))
    : ingredients;

  const addMedication = () => router.push("/shelf/medications/new");

  const empty = (loaded: Date | undefined, total: number, noun: string) => {
    if (!loaded) return null;
    if (q) return <EmptyState title="Nothing found" body={`No ${noun} match “${query.trim()}”.`} />;
    if (total > 0) return null;
    return showing === "medications" ? (
      <EmptyState
        title="Your shelf is empty"
        body="Add your first medication to start logging doses and seeing plasma curves."
        action={<Button label="Add medication" icon={Plus} onPress={addMedication} />}
      />
    ) : (
      <EmptyState title="No ingredients yet" body="Ingredients show up here once your medications have some." />
    );
  };

  const listProps = {
    contentInsetAdjustmentBehavior: "automatic",
    keyExtractor: (item: { id: number }) => String(item.id),
    ItemSeparatorComponent: () => <View className="h-3" />,
    // Leave room so the FAB never covers the last item.
    contentContainerStyle: { paddingTop: 12, paddingBottom: insets.bottom + 112 },
    keyboardShouldPersistTaps: "handled",
    keyboardDismissMode: "on-drag",
    showsVerticalScrollIndicator: false,
  } as const;

  return (
    <Screen scrollView={false} skipBottomInset>
      <ScreenTitle subtitle="Everything you take">Shelf</ScreenTitle>

      {/* Pinned above the list so only the cards scroll. */}
      <Segmented options={TABS} value={showing} onChange={setShowing} className="mb-4" />
      <SearchField value={query} onChangeText={setQuery} placeholder={`Search ${showing}`} />

      <View className="-mt-2 flex-1">
        {showing === "medications" ? (
          <FlatList
            {...listProps}
            data={filteredMedications}
            ListEmptyComponent={empty(medicationsLoadedAt, medications.length, "medications")}
            renderItem={({ item }) => (
              <MedicationCard
                medication={item}
                onPress={() => router.push({ pathname: "/shelf/medications/[id]", params: { id: item.id } })}
              />
            )}
          />
        ) : (
          <FlatList
            {...listProps}
            data={filteredIngredients}
            ListEmptyComponent={empty(ingredientsLoadedAt, ingredients.length, "ingredients")}
            renderItem={({ item }) => (
              <IngredientCard
                ingredient={item}
                onPress={() => router.push({ pathname: "/shelf/ingredients/[id]", params: { id: item.id } })}
              />
            )}
          />
        )}
        <TopFade />
      </View>

      <Fab onPress={addMedication} icon={Plus} label="Add medication" />
    </Screen>
  );
}
