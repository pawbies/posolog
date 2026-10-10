import Pressable from "@/components/ui/pressable";
import { MedicationProvider } from "@/contexts/medication";
import { medicationById } from "@/db/queries/medications";
import { usePalette } from "@/hooks/use-palette";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Info } from "lucide-react-native";
import { useEffect } from "react";

export default function MedicationLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { headerTint } = usePalette();

  const { data, updatedAt } = useLiveQuery(medicationById(Number(id)), [id]);
  const medication = data?.[0];

  // The medication was deleted (or never existed): leave its screens.
  useEffect(() => {
    if (updatedAt && !medication) router.dismissTo("/medications");
  }, [medication, updatedAt]);

  if (!medication) return null;

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
                <ChevronLeft size={26} color={headerTint} />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={() => router.push({ pathname: "/medications/[id]/info", params: { id: medication.id } })}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Medication info"
              >
                <Info size={24} color={headerTint} />
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
