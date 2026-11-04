import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Screen from "@/components/ui/screen";
import { useIngredient } from "@/contexts/ingredient";
import { deleteIngredient } from "@/db/queries/ingredients";
import { usePalette } from "@/hooks/use-palette";
import { useRouter } from "expo-router";
import { Pencil, Trash2 } from "lucide-react-native";
import { useRef, useState } from "react";
import { Alert, View } from "react-native";

export default function IngredientScreen() {
  const ingredient = useIngredient();
  const { tones } = usePalette();
  const accent = tones.lilac;
  const [deleting, setDeleting] = useState(false);
  const deletingRef = useRef(false);
  const router = useRouter();

  const remove = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    try {
      await deleteIngredient(ingredient.id);
    } catch {
      Alert.alert("Error", "Could not delete the ingredient.");
      deletingRef.current = false;
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
          onPress={() => router.push({ pathname: "/shelf/ingredients/[id]/edit", params: { id: ingredient.id } })}
          accessibilityLabel={`Edit ${ingredient.name}`}
        />
        <Button
          label="Delete medication"
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
