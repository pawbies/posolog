import Graph from "@/components/tracking/blood-pressure/graph";
import { db } from "@/db/client";
import { bloodPressureReadings } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function BloodPressureScreen() {
  const insets = useSafeAreaInsets();
  const { data: readings } = useLiveQuery(
    db.select().from(bloodPressureReadings).orderBy(desc(bloodPressureReadings.readingAt))
  );

  const handleAddReading = async () => {
    await db.insert(bloodPressureReadings).values({
      systolic: Math.random() * (140 - 90) + 90,
      diastolic: Math.random() * (90 - 60) + 60,
      pulse: Math.random() * (100 - 60) + 60,
      readingAt: new Date(),
    });
  };

  const handleDeleteReading = async (id: number) => {
    await db.delete(bloodPressureReadings).where(eq(bloodPressureReadings.id, id));
  };

  const handleDeleteAllReadings = async () => {
    await db.delete(bloodPressureReadings).where(eq(bloodPressureReadings.id, bloodPressureReadings.id));
  }

  return (
    <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 24 }} className="px-4 flex-1 bg-white dark:bg-black">
      <Text className="text-3xl font-semibold text-black dark:text-white mb-6 ml-1">
        Blood pressure
      </Text>

      <Graph readings={readings || []} />

      <TouchableOpacity
        className="mt-12 bg-blue-500 text-white py-2 px-4 rounded"
        onPress={handleAddReading}
      >
        <Text className="text-white text-center">Add Reading</Text>
      </TouchableOpacity>

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
    </View>
  );
}
