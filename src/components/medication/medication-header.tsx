import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { FORM_META, ROUTE_META, type MedicationDraft } from "@/lib/medication";
import { Stack } from "expo-router";
import { Save } from "lucide-react-native";
import { ActivityIndicator, View } from "react-native";

type MedicationHeaderProps = {
  draft: MedicationDraft;
  fallbackTitle: string;
  onSave: () => void;
  canSave: boolean;
  saving: boolean;
};

export default function MedicationHeader({ draft, fallbackTitle, onSave, canSave, saving }: MedicationHeaderProps) {
  const color = draft.color;
  const FormIcon = FORM_META[draft.form].icon;

  return (
    <Stack.Screen
      options={{
        headerTitle: () => (
          <View className="w-52 flex-row items-center gap-2.5">
            <View
              style={{ backgroundColor: `${color}26` }}
              className="h-9 w-9 items-center justify-center rounded-xl"
            >
              <FormIcon size={18} color={color} />
            </View>
            <View className="shrink">
              <Text numberOfLines={1} className="font-display-bold text-base">
                {draft.name.trim() || fallbackTitle}
              </Text>
              <Text muted numberOfLines={1} className="text-xs">
                {FORM_META[draft.form].name} · {ROUTE_META[draft.route].name}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <Pressable
            onPress={onSave}
            disabled={!canSave}
            accessibilityRole="button"
            accessibilityLabel="Save medication"
            hitSlop={8}
            style={{ opacity: canSave ? 1 : 0.4 }}
            className="h-9 w-9 items-center justify-center"
          >
            {saving ? (
              <ActivityIndicator size="small" color={color} />
            ) : (
              <Save size={22} color={color} strokeWidth={2.25} />
            )}
          </Pressable>
        ),
      }}
    />
  );
}
