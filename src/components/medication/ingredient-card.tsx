import IconBadge from "@/components/ui/icon-badge";
import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import type { Ingredient } from "@/db/schema";
import { usePalette } from "@/hooks/use-palette";
import { Atom, ChevronRight } from "lucide-react-native";
import { View } from "react-native";

type IngredientCardProps = {
  ingredient: Ingredient;
  onPress?: (ingredient: Ingredient) => void;
};

export default function IngredientCard({ ingredient, onPress }: IngredientCardProps) {
  const { chevron } = usePalette();

  return (
    <Pressable
      onPress={onPress ? () => onPress(ingredient) : undefined}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={ingredient.name}
      className="flex-row items-center rounded-[24px] border-2 border-border bg-surface p-3.5 active:scale-[0.98]"
    >
      <IconBadge icon={Atom} tone="lilac" className="h-14 w-14 rounded-[18px]" />

      <View className="ml-3.5 flex-1">
        <Text className="font-display-bold text-lg leading-6" numberOfLines={1}>
          {ingredient.name}
        </Text>
        {ingredient.notes ? (
          <Text muted className="mt-0.5 text-xs" numberOfLines={1}>
            {ingredient.notes}
          </Text>
        ) : null}
      </View>

      {onPress ? <ChevronRight size={20} color={chevron} strokeWidth={2.5} /> : null}
    </Pressable>
  );
}
