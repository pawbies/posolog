import MedicationCard from "@/components/medication/medication-card";
import Fab from "@/components/ui/fab";
import Screen from "@/components/ui/screen";
import ScreenTitle from "@/components/ui/screen-title";
import SearchField from "@/components/ui/search-field";
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
  const { data: medications } = useLiveQuery(allMedications());

  const q = query.trim().toLowerCase();
  const filtered = q
    ? medications.filter((m) => `${m.name} ${m.notes ?? ""} ${m.form} ${m.route}`.toLowerCase().includes(q))
    : medications;

  return (
    <Screen scrollView={false}>
      <ScreenTitle>Medications</ScreenTitle>

      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MedicationCard
            medication={item}
            onPress={() => router.push({ pathname: "/(tabs)/medications/[id]", params: { id: item.id } })}
          />
        )}
        ListHeaderComponent={
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Search medications"
          />
        }
        ItemSeparatorComponent={() => <View className="h-2" />}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      />
      <Fab onPress={() => router.push("/medications/creation/basic-information")} icon={Plus} label="Add medication" />
    </Screen>
  );
}
