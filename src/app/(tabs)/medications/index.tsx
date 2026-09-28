import Fab from "@/components/fab";
import Medication from "@/components/medication/medication";
import Screen from "@/components/screen";
import SearchField from "@/components/search-bar";
import Text from "@/components/text";
import { db } from "@/db/client";
import { medications as medicationTable } from "@/db/schema";
import { asc } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useRouter } from "expo-router";
import { Plus } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MedicationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const { data: medications } = useLiveQuery(
    db.select().from(medicationTable).orderBy(asc(medicationTable.name))
  );

  const haystack = useMemo(
    () => (medications ?? []).map((m) => ({
      medication: m,
      text: `${m.name} ${m.notes ?? ""} ${m.form} ${m.route}`.toLowerCase(),
    })),
    [medications],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return medications ?? [];
    return haystack.filter((m) => m.text.includes(q)).map((m) => m.medication);
  }, [haystack, medications, query]);
  
  return (
    <Screen scrollView={false}>
      <Text className="text-3xl font-semibold mb-6 ml-1">
        Medications
      </Text>

      <FlatList
        contentInsetAdjustmentBehavior="automatic"
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Medication medication={item} onPress={() => router.push({ pathname: "/(tabs)/medications/[id]", params: { id: item.id } }) } />
        )}
        ListHeaderComponent={
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Search medications"
          />
        }
        ItemSeparatorComponent={() => <View className="h-2" />}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      />
      <Fab onPress={() => router.push("/medications/creation/basic-information") } icon={Plus} label="Add medication" />
    </Screen>
  );
}
