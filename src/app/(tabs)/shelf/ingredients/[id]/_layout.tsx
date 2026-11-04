import Pressable from "@/components/ui/pressable";
import { stackHeaderOptions } from "@/constants/navigation";
import { IngredientProvider } from "@/contexts/ingredient";
import { ingredientById } from "@/db/queries/ingredients";
import { usePalette } from "@/hooks/use-palette";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft, Pencil } from "lucide-react-native";
import { useEffect } from "react";

export default function IngredientLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { headerTint } = usePalette();

  const { data, updatedAt } = useLiveQuery(ingredientById(Number(id)), [id]);
  const ingredient = data?.[0];

  useEffect(() => {
    if (updatedAt && !ingredient) router.dismissTo("/shelf");
  }, [ingredient, updatedAt]);

  if (!ingredient) return null;

  return (
    <IngredientProvider value={ingredient}>
      <Stack screenOptions={stackHeaderOptions}>
        <Stack.Screen
          name="index"
          options={{
            title: ingredient.name,
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
                onPress={() => router.push({ pathname: "/shelf/ingredients/[id]/edit", params: { id: ingredient.id } })}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={`Edit ${ingredient.name}`}
              >
                <Pencil size={22} color={headerTint} strokeWidth={2.25} />
              </Pressable>
            ),
          }}
        />
        <Stack.Screen
          name="edit"
          options={{ title: "Edit ingredient" }}
        />
      </Stack>
    </IngredientProvider>
  );
}
