import ActionTile from "@/components/medication/action-tile";
import Chart from "@/components/medication/chart";
import Pressable from "@/components/ui/pressable";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { useMedication } from "@/contexts/medication";
import { deleteMedication } from "@/db/queries/medications";
import { FORM_META, ROUTE_META } from "@/lib/medication";
import { useRouter } from "expo-router";
import { Cookie, Mountain, NotebookPen, Package, Pencil, Trash2 } from "lucide-react-native";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

export default function MedicationScreen() {
  const router = useRouter();
  const medication = useMedication();
  const [deleting, setDeleting] = useState(false);
  const deletingRef = useRef(false);

  const form = FORM_META[medication.form];
  const route = ROUTE_META[medication.route];
  const Icon = form.icon;
  const color = medication.color;

  const remove = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    try {
      await deleteMedication(medication.id);
    } catch {
      Alert.alert("Error", "Could not delete the medication.");
      deletingRef.current = false;
      setDeleting(false);
    }
  };

  const confirmDelete = () =>
    Alert.alert(`Delete ${medication.name}?`, "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: remove },
    ]);

  const notImplemented = () => Alert.alert("Hehe", "Not implemented yet.");

  return (
    <Screen skipTopInset>
      <View
        className="mt-6 overflow-hidden rounded-[32px] p-5"
        style={{ backgroundColor: `${color}14` }}
      >
        <View
          className="absolute -right-10 -top-10 h-40 w-40 rounded-full"
          style={{ backgroundColor: `${color}1f` }}
        />
        <View
          className="absolute -bottom-16 right-16 h-28 w-28 rounded-full"
          style={{ backgroundColor: `${color}14` }}
        />

        <View className="flex-row items-center gap-3.5">
          <View
            className="h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: `${color}26` }}
          >
            <Icon size={32} color={color} />
          </View>
          <View className="flex-1">
            <Text className="text-3xl font-bold" numberOfLines={2}>{medication.name}</Text>
            <Text className="mt-0.5 text-sm font-medium" style={{ color }}>
              {route.name} · {form.name}
            </Text>
          </View>
        </View>
      </View>

      <Chart color={color} />

      <View className="mt-4 gap-3">
        <ActionTile icon={Cookie} label="Doses" text="Logged 15 times" color={color} onSeeAll={notImplemented} onAdd={notImplemented} />
        <ActionTile icon={Package} label="Packs" text="3 days ago" color={color} onSeeAll={notImplemented} onAdd={notImplemented} />
        <ActionTile icon={Mountain} label="Strengths" text="3 strengths" color={color} onSeeAll={notImplemented} onAdd={notImplemented} />
      </View>

      {medication.notes ? (
        <View className="mt-4 rounded-3xl bg-surface p-4">
          <View className="flex-row items-center gap-2">
            <NotebookPen size={16} color={color} />
            <Text muted className="text-xs font-semibold uppercase tracking-wider">Notes</Text>
          </View>
          <View className="mt-3 border-l-2 pl-3" style={{ borderColor: `${color}66` }}>
            <Text className="text-base leading-6">{medication.notes}</Text>
          </View>
        </View>
      ) : null}

      <Pressable
        onPress={() => router.push({ pathname: "/medications/[id]/edit", params: { id: medication.id } })}
        disabled={deleting}
        accessibilityRole="button"
        accessibilityLabel={`Edit ${medication.name}`}
        className="mt-8 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-blue-500/10"
      >
        <Pencil size={18} color="#3b82f6" />
        <Text className="text-base font-semibold text-blue-500">Edit {medication.name}</Text>
      </Pressable>

      <Pressable
        onPress={confirmDelete}
        disabled={deleting}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${medication.name}`}
        className="mt-3 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-red-500/10"
      >
        {deleting ? (
          <ActivityIndicator size="small" color="#ef4444" />
        ) : (
          <>
            <Trash2 size={18} color="#ef4444" />
            <Text className="text-base font-semibold text-red-500">Delete {medication.name}</Text>
          </>
        )}
      </Pressable>
    </Screen>
  );
}
