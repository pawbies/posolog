import AddReadingSheet from "@/components/tracking/blood-pressure/add-reading-sheet";
import Graph from "@/components/tracking/blood-pressure/graph";
import { db } from "@/db/client";
import { bloodPressureReadings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { FlatList, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BloodPressureScreen() {
  const insets = useSafeAreaInsets();
  const [showAddReading, setShowAddReading] = useState(false);
  const { data: readings } = useLiveQuery(
    db.select().from(bloodPressureReadings).orderBy(desc(bloodPressureReadings.readingAt))
  );

  const handleDeleteReading = async (id: number) => {
    await db.delete(bloodPressureReadings).where(eq(bloodPressureReadings.id, id));
  };

  const handleDeleteAllReadings = async () => {
    await db.delete(bloodPressureReadings).where(eq(bloodPressureReadings.id, bloodPressureReadings.id));
  }

  return (
    <View style={{ paddingBottom: insets.bottom + 24 }} className="px-4 pt-4 flex-1 bg-white dark:bg-black">
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

      <Graph readings={readings || []} />

      <TouchableOpacity
        className="mt-3 mb-12 bg-red-500 text-white py-2 px-4 rounded"
        onPress={handleDeleteAllReadings}
      >
        <Text className="text-white text-center">Delete All</Text>
      </TouchableOpacity>
      
      {readings?.length > 0 && (
        <FlatList
          data={readings}
          renderItem={({item}) => 
            <>
            <Text className="mt-4 text-black dark:text-white">
              {Math.round(item.systolic)}/{Math.round(item.diastolic)} - {Math.round(item.pulse || 0)} ({item.readingAt.toString()})
            </Text>
            <TouchableOpacity
              className="bg-red-500 text-white py-1 px-2 rounded mt-1"
              onPress={() => handleDeleteReading(item.id)}
            >
              <Text className="text-white text-center">Delete</Text>
            </TouchableOpacity>
            </>
        }
        />
      )}

      <AddReadingSheet
        isPresented={showAddReading}
        onDismiss={() => setShowAddReading(false)}
      />
    </View>
  );
}
