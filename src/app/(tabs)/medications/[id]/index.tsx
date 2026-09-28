import Chart from "@/components/medication/chart";
import Pressable from "@/components/pressable";
import Screen from "@/components/screen";
import Text from "@/components/text";
import { useMedication } from "@/contexts/medication";
import { FORM_META, ROUTE_META } from "@/contexts/medication-draft";
import { db } from "@/db/client";
import { medications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { useRouter } from "expo-router";
import { ChevronRight, Cookie, NotebookPen, Package, Pencil, Plus, Trash2, type LucideIcon } from "lucide-react-native";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

function Tile({ icon: Icon, label, text, color, onSeeAll, onAdd }: {
  icon: LucideIcon; label: string; text: string; color: string;
  onSeeAll: () => void; onAdd: () => void;
}) {
  return (
    <View className="flex-row items-center rounded-3xl bg-surface p-4">
      <View
        className="h-12 w-12 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${color}1f` }}
      >
        <Icon size={22} color={color} />
      </View>

      <View className="ml-3.5 flex-1">
        <Text muted className="text-xs font-semibold uppercase tracking-wider">{label}</Text>
        <Text className="mt-0.5 text-lg font-semibold" numberOfLines={1}>{text}</Text>
      </View>

      <Pressable
        onPress={onSeeAll}
        accessibilityRole="button"
        accessibilityLabel={`See all ${label.toLowerCase()}`}
        hitSlop={6}
        className="h-10 flex-row items-center gap-0.5 rounded-xl px-6"
        style={{ backgroundColor: `${color}14` }}
      >
        <Text className="text-sm font-semibold" style={{ color }}>All</Text>
        <ChevronRight size={14} color={color} />
      </Pressable>
      <Pressable
        onPress={onAdd}
        accessibilityRole="button"
        accessibilityLabel={`Add ${label.toLowerCase()}`}
        hitSlop={6}
        className="ml-2 h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: color }}
      >
        <Plus size={18} color="#fff" strokeWidth={2.5} />
      </Pressable>
    </View>
  );
}

export default function MedicationScreen() {
  const router = useRouter();
  const medication = useMedication();
  const [deleting, setDeleting] = useState(false);
  const deletingRef = useRef(false);

  const form = FORM_META[medication.form];
  const route = ROUTE_META[medication.route];
  const Icon = form.icon;
  const color = medication.color;

  const deleteMedication = async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    try {
      await db.delete(medications).where(eq(medications.id, medication.id));
    } catch {
      Alert.alert("Error", "Could not delete the medication.");
      deletingRef.current = false;
      setDeleting(false);
    }
  };

  const placeholderFunc = () => Alert.alert("Hehe", "Not implemented yet.");

  const confirmDelete = () =>
    Alert.alert(`Delete ${medication.name}?`, "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: deleteMedication },
    ]);

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
        <Tile icon={Cookie} label="Doses" text="Logged 15 times" color={color} onSeeAll={placeholderFunc} onAdd={placeholderFunc} />
        <Tile icon={Package} label="Packs" text="3 days ago" color={color} onSeeAll={placeholderFunc} onAdd={placeholderFunc} />
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
        onPress={() => router.push({pathname: "/(tabs)/medications/[id]/edit", params: { id: medication.id }})}
        disabled={deleting}
        accessibilityRole="button"
        accessibilityLabel={`Delete ${medication.name}`}
        className="mt-8 min-h-14 flex-row items-center justify-center gap-2 rounded-2xl bg-blue-500/10"
      >
        {deleting ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : (
          <>
            <Pencil size={18} color="#3b82f6" />
            <Text className="text-base font-semibold text-blue-500">Edit {medication.name}</Text>
          </>
        )}
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
