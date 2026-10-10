import Graph from "@/components/tracking/blood-pressure/graph";
import Reading from "@/components/tracking/blood-pressure/reading";
import ReadingSheet from "@/components/tracking/blood-pressure/reading-sheet";
import Screen from "@/components/ui/screen";
import { allReadings, createReading, deleteReading, updateReading } from "@/db/queries/blood-pressure";
import type { BloodPressureReading } from "@/db/schema";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BloodPressureScreen() {
  const insets = useSafeAreaInsets();
  const [showAddReading, setShowAddReading] = useState(false);
  const [editingReading, setEditingReading] = useState<BloodPressureReading | null>(null);
  const { data: readings, error, updatedAt } = useLiveQuery(allReadings());

  const loading = !updatedAt && !error;

  useEffect(() => {
    if (error) Alert.alert("Error", "Failed to load blood pressure readings.");
  }, [error]);

  const confirmDelete = (id: number) => {
    Alert.alert("Delete reading", "This reading will be removed permanently.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteReading(id) },
    ]);
  };

  return (
    <Screen scrollView={false} skipBottomInset skipTopInset>
      <Stack.Screen
        options={{
          title: "Blood pressure",
          headerRight: ({ tintColor }) => (
            <Pressable
              onPress={() => setShowAddReading(true)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Add reading"
              className="active:opacity-50"
            >
              <Plus size={24} color={tintColor} />
            </Pressable>
          ),
        }}
      />

      <FlatList
        data={readings}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Reading reading={item} onDelete={confirmDelete} onEdit={setEditingReading} />
        )}
        ListHeaderComponent={
          <View className="pb-12">
            <Graph loading={loading} readings={readings} />
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-2" />}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      />

      <ReadingSheet
        isPresented={showAddReading}
        title="New reading"
        submitLabel="Save"
        onSubmit={async (draft) => { await createReading(draft); }}
        onDismiss={() => setShowAddReading(false)}
      />

      <ReadingSheet
        isPresented={editingReading !== null}
        title="Edit reading"
        submitLabel="Save changes"
        initial={editingReading}
        onSubmit={async (draft) => { if (editingReading) await updateReading(editingReading.id, draft); }}
        onDismiss={() => setEditingReading(null)}
      />
    </Screen>
  );
}
