import Pressable from "@/components/ui/pressable";
import { stackHeaderOptions } from "@/constants/navigation";
import { useMedication } from "@/contexts/medication";
import { usePalette } from "@/hooks/use-palette";
import { Stack, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

export default function StrengthsLayout() {
  const router = useRouter();
  const medication = useMedication();
  const { headerTint } = usePalette();

  return (
    <Stack screenOptions={stackHeaderOptions}>
      <Stack.Screen
        name="index"
        options={{
          title: "Strengths",
          headerLeft: () => (
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={`Back to ${medication.name}`}
            >
              <ChevronLeft size={28} color={headerTint} strokeWidth={2.5} />
            </Pressable>
          )
        }}
      />
      <Stack.Screen name="new" options={{ title: "Add strength" }} />
    </Stack>
  );
}
