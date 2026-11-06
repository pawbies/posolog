import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Pressable from "@/components/ui/pressable";
import Screen from "@/components/ui/screen";
import { deleteIngredient } from "@/db/queries/ingredients";
import { useIngredient } from "@/hooks/use-ingredient";
import { usePalette } from "@/hooks/use-palette";
import { Stack, useRouter } from "expo-router";
import { Pencil, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Alert, View } from "react-native";

export default function IngredientScreen() {
  const ingredient = useIngredient();
  const { tones, headerTint } = usePalette();
  const accent = tones.lilac;
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  if (!ingredient) return null;

  const edit = () => router.push({ pathname: "/shelf/ingredients/[id]/edit", params: { id: ingredient.id } });

  const remove = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteIngredient(ingredient.id);
      router.back();
    } catch {
      Alert.alert("Error", "Could not delete the ingredient.");
      setDeleting(false);
    }
  };

  const confirmDelete = () =>
    Alert.alert(`Delete ${ingredient.name}?`, "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: remove },
    ]);

  return (
    <Screen>
      <Stack.Screen
        options={{
          title: ingredient.name,
          headerRight: () => (
            <Pressable onPress={edit} hitSlop={12} accessibilityRole="button" accessibilityLabel={`Edit ${ingredient.name}`}>
              <Pencil size={22} color={headerTint} strokeWidth={2.25} />
            </Pressable>
          ),
        }}
      />
      <EmptyState
        title={`Ingredient: ${ingredient.name}`}
        body="Ingredient details are still being built. Check back in a future update."
      />

      <View className="mt-8 gap-3">
        <Button
          label="Edit ingredient"
          icon={Pencil}
          color={accent}
          disabled={deleting}
          onPress={edit}
          accessibilityLabel={`Edit ${ingredient.name}`}
        />
        <Button
          label="Delete ingredient"
          icon={Trash2}
          variant="danger"
          loading={deleting}
          onPress={confirmDelete}
          accessibilityLabel={`Delete ${ingredient.name}`}
        />
      </View>
    </Screen>
  );
}
