import Pressable from "@/components/pressable";
import { MedicationProvider } from "@/contexts/medication";
import { db } from "@/db/client";
import { medications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Info } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";

export default function MedicationLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colorScheme } = useColorScheme();

  const { data, updatedAt } = useLiveQuery(
    db.select().from(medications).where(eq(medications.id, Number(id))).limit(1),
    [id]
  );
  const medication = data?.[0];

  useEffect(() => {
    if (updatedAt && !medication) router.dismissTo("/medications");
  }, [medication, updatedAt]);

  if (!medication) return null;

  const tint = colorScheme === "dark" ? "#fafafa" : "#171717";

  return (
    <MedicationProvider value={medication}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: medication.name,
            headerLeft: () => (
              <Pressable
                onPress={() => router.back()}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Back to medications"
              >
                <ChevronLeft size={26} color={tint} />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={() => router.push({ pathname: "/(tabs)/medications/[id]/info", params: { id: medication.id } })}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Medication info"
              >
                <Info size={24} color={tint} />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="info"
          options={{ title: `${medication.name} info`, headerBackTitle: "Overview" }}
        />
        <Stack.Screen
          name="edit"
          options={{ title: `Edit ${medication.name}`, headerBackTitle: "Overview" }}
        />
      </Stack>
    </MedicationProvider>
  );
}
