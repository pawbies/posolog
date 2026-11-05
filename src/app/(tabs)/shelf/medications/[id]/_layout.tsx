import Pressable from "@/components/ui/pressable";
import { stackHeaderOptions } from "@/constants/navigation";
import { MedicationProvider } from "@/contexts/medication";
import { medicationById } from "@/db/queries/medications";
import { allStrengthsByMedicationId } from "@/db/queries/strengths";
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
  const { data: strengths } = useLiveQuery(allStrengthsByMedicationId(Number(id)), [id]);

  useEffect(() => {
    if (updatedAt && !medication) router.dismissTo("/shelf");
  }, [medication, updatedAt]);

  if (!medication) return null;

  return (
    <MedicationProvider medication={medication} strengths={strengths}>
      <Stack screenOptions={stackHeaderOptions}>
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
                <ChevronLeft size={28} color={headerTint} strokeWidth={2.5} />
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={() => router.push({ pathname: "/shelf/medications/[id]/info", params: { id: medication.id } })}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Medication info"
              >
                <Info size={24} color={headerTint} strokeWidth={2.25} />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="info"
          options={{ title: "Reference sheet" }}
        />
        <Stack.Screen
          name="edit"
          options={{ title: "Edit medication" }}
        />
      </Stack>
    </MedicationProvider>
  );
}
