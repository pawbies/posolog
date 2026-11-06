import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import Fab from "@/components/ui/fab";
import IconBadge from "@/components/ui/icon-badge";
import Pressable from "@/components/ui/pressable";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { deleteStrength } from "@/db/queries/strengths";
import type { Medication } from "@/db/schema";
import { useMedication } from "@/hooks/use-medication";
import { usePalette } from "@/hooks/use-palette";
import { formatMg, strengthLabel, unitIcon, unitName, type StrengthWithIngredients } from "@/lib/strength";
import { useRouter } from "expo-router";
import { Plus, Trash2 } from "lucide-react-native";
import { Alert, View } from "react-native";

export default function StrengthsScreen() {
  const router = useRouter();
  const { medication, strengths } = useMedication();
  if (!medication) return null;
  const color = medication.color;

  const add = () =>
    router.push({ pathname: "/shelf/medications/[id]/strengths/new", params: { id: medication.id } });

  return (
    <View className="flex-1 bg-background">
      <Screen>
        {strengths.length === 0 ? (
          <EmptyState
            title="No strengths yet"
            body={`Add the strengths ${medication.name} comes in, like a 500 mg tablet, to log doses with it.`}
            action={<Button label="Add strength" icon={Plus} color={color} onPress={add} />}
          />
        ) : (
          <View className="mt-2 gap-3 pb-20">
            {strengths.map((strength) => (
              <StrengthCard key={strength.id} strength={strength} medication={medication} />
            ))}
          </View>
        )}
      </Screen>
      {strengths.length > 0 ? <Fab onPress={add} icon={Plus} label="Add strength" /> : null}
    </View>
  );
}

function StrengthCard({ strength, medication }: { strength: StrengthWithIngredients; medication: Medication }) {
  const router = useRouter();
  const { danger } = usePalette();
  const color = medication.color;
  const UnitIcon = unitIcon(strength.unitInUse, medication.form);
  const label = strengthLabel(strength);

  const remove = async () => {
    try {
      await deleteStrength(strength.id);
    } catch {
      Alert.alert("Can't delete strength", "It's still used by doses, packs or a regimen.");
    }
  };

  const confirmDelete = () =>
    Alert.alert(`Delete ${label}?`, "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: remove },
    ]);

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/shelf/medications/[id]/strengths/edit",
          params: { id: medication.id, strengthId: strength.id },
        })
      }
      accessibilityRole="button"
      accessibilityLabel={`Edit ${label}`}
      className="flex-row items-center rounded-[24px] border-2 border-border bg-surface p-3.5"
    >
      <IconBadge icon={UnitIcon} color={color} className="h-14 w-14 rounded-[18px]" />

      <View className="ml-3.5 flex-1">
        <Text className="font-display-bold text-lg leading-6" numberOfLines={2}>
          {label}
        </Text>
        <Text muted className="mt-0.5 text-xs" numberOfLines={2}>
          per {unitName(strength.unitInUse, medication.form)}
          {strength.ingredients.some((si) => si.saltFactor !== 1)
            ? ` · ${strength.ingredients.map((si) => `${formatMg(si.amountBase)} base`).join(" + ")}`
            : ""}
        </Text>
      </View>

      <Pressable
        onPress={confirmDelete}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${label}`}
        className="ml-2 h-10 w-10 items-center justify-center rounded-full"
      >
        <Trash2 size={18} color={danger} strokeWidth={2.25} />
      </Pressable>
    </Pressable>
  );
}
