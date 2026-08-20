import AddReadingSheet from "@/components/tracking/blood-pressure/add-reading-sheet";
import EditReadingSheet from "@/components/tracking/blood-pressure/edit-reading-sheet";
import Graph from "@/components/tracking/blood-pressure/graph";
import Reading from "@/components/tracking/blood-pressure/reading";
import { db } from "@/db/client";
import { bloodPressureReadings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, FlatList, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Reading = typeof bloodPressureReadings.$inferSelect;

export default function BloodPressureScreen() {
  const insets = useSafeAreaInsets();
  const [showAddReading, setShowAddReading] = useState(false);
  const [editingReading, setEditingReading] = useState<Reading | null>(null);
  const { data: readings, error, updatedAt } = useLiveQuery(
    db.select().from(bloodPressureReadings).orderBy(desc(bloodPressureReadings.readingAt))
  );

  const loading = !updatedAt && !error;

  const handleDeleteReading = (id: number) => {
    Alert.alert("Delete reading", "This reading will be removed permanently.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await db.delete(bloodPressureReadings).where(eq(bloodPressureReadings.id, id));
        },
      },
    ]);
  };

  const handleEdit = (reading: Reading) => {
    setEditingReading(reading);
  };

  useEffect(() => {
    if (error) {
      Alert.alert("Error", "Failed to load blood pressure readings.");
    }
  }, [error]);

  return (
    <View className="flex-1 bg-white dark:bg-black">
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
        data={readings ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Reading reading={item} onDelete={handleDeleteReading} onEdit={handleEdit} />
        )}
        ListHeaderComponent={
          <View className="pb-12">
            <Graph loading={loading} readings={readings ?? []} />
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-2" />}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: insets.bottom + 24,
        }}
        showsVerticalScrollIndicator={false}
      />

      <AddReadingSheet
        isPresented={showAddReading}
        onDismiss={() => setShowAddReading(false)}
      />

      <EditReadingSheet
        isPresented={editingReading !== null}
        reading={editingReading}
        onDismiss={() => setEditingReading(null)}
      />
    </View>
  );
}
