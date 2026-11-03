import ActionTile from "@/components/medication/action-tile";
import Chart from "@/components/medication/chart";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { useMedication } from "@/contexts/medication";
import { deleteMedication } from "@/db/queries/medications";
import { FORM_META, ROUTE_META } from "@/lib/medication";
import { useRouter } from "expo-router";
import { Cookie, Mountain, NotebookPen, Package, Pencil, Trash2 } from "lucide-react-native";
import { useRef, useState } from "react";
import { Alert, View } from "react-native";

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
      // The layout notices the medication is gone and leaves the screen.
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

  const notImplemented = () => Alert.alert("Not implemented", "This feature is not implemented yet.");

  return (
    <Screen>
      <View
        className="mt-2 overflow-hidden rounded-[36px] px-5 pb-6 pt-5"
        style={{ backgroundColor: `${color}1f` }}
      >
        <View
          className="absolute -right-12 -top-12 h-44 w-44 rounded-full"
          style={{ backgroundColor: `${color}1f` }}
        />
        <View
          className="absolute -bottom-16 right-20 h-32 w-32 rounded-full"
          style={{ backgroundColor: `${color}14` }}
        />

        <View
          className="h-20 w-20 -rotate-6 items-center justify-center rounded-[26px]"
          style={{ backgroundColor: `${color}33` }}
        >
          <Icon size={40} color={color} strokeWidth={2.25} />
        </View>
        <Heading size="xl" className="mt-5" numberOfLines={2}>{medication.name}</Heading>
        <View className="mt-2 flex-row gap-2">
          {[route.name, form.name].map((label) => (
            <View key={label} className="rounded-full bg-surface px-3 py-1">
              <Text className="text-sm font-semibold" style={{ color }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Chart color={color} />

      <View className="mt-4 gap-3">
        <ActionTile icon={Cookie} label="Doses" text="Logged 15 times" color={color} onSeeAll={notImplemented} onAdd={notImplemented} />
        <ActionTile icon={Package} label="Packs" text="3 days ago" color={color} onSeeAll={notImplemented} onAdd={notImplemented} />
        <ActionTile icon={Mountain} label="Strengths" text="3 strengths" color={color} onSeeAll={notImplemented} onAdd={notImplemented} />
      </View>

      {medication.notes ? (
        <Card tone="cream" className="mt-4">
          <View className="flex-row items-center gap-2">
            <NotebookPen size={18} color={color} strokeWidth={2.5} />
            <Heading size="sm">Notes</Heading>
          </View>
          <Text className="mt-2 text-base leading-6">{medication.notes}</Text>
        </Card>
      ) : null}

      <View className="mt-8 gap-3">
        <Button
          label="Edit medication"
          icon={Pencil}
          color={color}
          disabled={deleting}
          onPress={() => router.push({ pathname: "/shelf/medications/[id]/edit", params: { id: medication.id } })}
          accessibilityLabel={`Edit ${medication.name}`}
        />
        <Button
          label="Delete medication"
          icon={Trash2}
          variant="danger"
          loading={deleting}
          onPress={confirmDelete}
          accessibilityLabel={`Delete ${medication.name}`}
        />
      </View>
    </Screen>
  );
}
