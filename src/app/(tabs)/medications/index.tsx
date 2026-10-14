import IngredientCard from "@/components/medication/ingredient-card";
import MedicationCard from "@/components/medication/medication-card";
import Fab from "@/components/ui/fab";
import Pressable from "@/components/ui/pressable";
import Screen from "@/components/ui/screen";
import ScreenTitle from "@/components/ui/screen-title";
import SearchField from "@/components/ui/search-field";
import { allIngredients } from "@/db/queries/ingredients";
import { allMedications } from "@/db/queries/medications";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MedicationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [showing, setShowing] = useState<"medications" | "ingredients">("medications");

  const { data: medications } = useLiveQuery(allMedications());
  const { data: ingredients } = useLiveQuery(allIngredients());

  const q = query.trim().toLowerCase();
  const matches = (...fields: (string | null)[]) => fields.join(" ").toLowerCase().includes(q);

  const filteredMedications = q
    ? medications.filter((m) => matches(m.name, m.notes, m.form, m.route))
    : medications;
  const filteredIngredients = q
    ? ingredients.filter((i) => matches(i.name, i.notes))
    : ingredients;

  const listProps = {
    contentInsetAdjustmentBehavior: "automatic",
    keyExtractor: (item: { id: number }) => String(item.id),
    ListHeaderComponent: (
      <SearchField value={query} onChangeText={setQuery} placeholder={`Search ${showing}`} />
    ),
    ItemSeparatorComponent: <View className="h-2" />,
    contentContainerStyle: { paddingBottom: insets.bottom + 24 },
    showsVerticalScrollIndicator: false,
  } as const;

  return (
    <Screen scrollView={false}>
      <View className="flex-row gap-2.5">
        <Pressable
          className={showing === "medications" ? "opacity-100" : "opacity-50"}
          onPress={() => setShowing("medications")}
        >
          <ScreenTitle>Medications</ScreenTitle>
        </Pressable>
        <Pressable
          className={showing === "ingredients" ? "opacity-100" : "opacity-50"}
          onPress={() => setShowing("ingredients")}
        >
          <ScreenTitle>Ingredients</ScreenTitle>
        </Pressable>
      </View>

      {showing === "medications" ? (
        <FlatList
          {...listProps}
          data={filteredMedications}
          renderItem={({ item }) => (
            <MedicationCard
              medication={item}
              onPress={() => router.push({ pathname: "/medications/[id]", params: { id: item.id } })}
            />
          )}
        />
      ) : (
        <FlatList
          {...listProps}
          data={filteredIngredients}
          renderItem={({ item }) => (
            <IngredientCard
              ingredient={item}
              onPress={() => router.push({ pathname: "/medications/ingredients/[id]", params: { id: item.id } })}
            />
          )}
        />
      )}

      <Fab onPress={() => router.push("/medications/new")} icon={Plus} label="Add medication" />
    </Screen>
  );
}
