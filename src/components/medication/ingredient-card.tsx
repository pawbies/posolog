import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import type { Ingredient } from "@/db/schema";
import { Atom, ChevronRight } from "lucide-react-native";
import { View } from "react-native";

type IngredientCardProps = {
  ingredient: Ingredient;
  onPress?: (medication: Ingredient) => void;
};

export default function IngredientCard({ ingredient, onPress }: IngredientCardProps) {

  return (
    <Pressable
      onPress={onPress ? () => onPress(ingredient) : undefined}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={ingredient.name}
      className="flex-row items-center rounded-2xl bg-surface px-4 py-3.5"
    >
      <View className="w-1 self-stretch rounded-full" style={{ backgroundColor: "#3b82f6" }} />

      <View
        className="ml-3.5 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: "#3b82f626" }}
      >
        <Atom size={20} color="#3b82f6" />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold" numberOfLines={1}>
          {ingredient.name}
        </Text>
        {ingredient.notes ? (
          <Text muted className="mt-1 text-xs" numberOfLines={1}>
            {ingredient.notes}
          </Text>
        ) : null}
      </View>

      {onPress ? <ChevronRight size={18} color="#a3a3a3" className="ml-2" /> : null}
    </Pressable>
  );
}
