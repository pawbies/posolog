import ZoneChart, { classifyZone } from "@/components/tracking/blood-pressure/zone-chart";
import { db } from "@/db/client";
import { bloodPressureReadings } from "@/db/schema";
import { BottomSheet, Host, RNHostView } from "@expo/ui";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  isPresented: boolean;
  onDismiss: () => void;
};

type FieldKey = "systolic" | "diastolic" | "pulse";

type Field = {
  key: FieldKey;
  label: string;
  placeholder: string;
  unit: string;
  min: number;
  max: number;
  optional?: boolean;
};

const FIELDS: Field[] = [
  { key: "systolic", label: "Systolic", placeholder: "120", unit: "mmHg", min: 50, max: 260 },
  { key: "diastolic", label: "Diastolic", placeholder: "80", unit: "mmHg", min: 30, max: 200 },
  { key: "pulse", label: "Pulse", placeholder: "70", unit: "bpm", min: 25, max: 250, optional: true },
];

const EMPTY = { systolic: "", diastolic: "", pulse: "" };

function toNumber(value: string) {
  return value === "" ? null : Number.parseInt(value, 10);
}

export default function AddReadingSheet({ isPresented, onDismiss }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";

  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const systolic = toNumber(values.systolic);
  const diastolic = toNumber(values.diastolic);
  const zone = systolic !== null && diastolic !== null ? classifyZone(systolic, diastolic) : null;

  const setField = (key: FieldKey, text: string) => {
    setValues((prev) => ({ ...prev, [key]: text.replace(/[^0-9]/g, "") }));
    setError(null);
  };

  const close = () => {
    setValues(EMPTY);
    setError(null);
    onDismiss();
  };

  const save = async () => {
    for (const { key, label, optional, min, max } of FIELDS) {
      const value = toNumber(values[key]);
      if (value === null) {
        if (optional) continue;
        setError(`${label} is required.`);
        return;
      }
      if (value < min || value > max) {
        setError(`${label} must be between ${min} and ${max}.`);
        return;
      }
    }
    if (systolic === null || diastolic === null) return;
    if (diastolic >= systolic) {
      setError("Diastolic must be lower than systolic.");
      return;
    }

    setSaving(true);
    try {
      await db.insert(bloodPressureReadings).values({
        systolic,
        diastolic,
        pulse: toNumber(values.pulse),
        readingAt: new Date(),
      });
      close();
    } catch {
      setError("Could not save the reading.");
    } finally {
      setSaving(false);
    }
  };

  const canSave = systolic !== null && diastolic !== null && !saving;

  const sheetWidth = width - 32;
  const sheetHeight = height - insets.top - 24;
  const chartWidth = Math.min(sheetWidth - 40, 380);

  return (
    <Host>
      <BottomSheet isPresented={isPresented} onDismiss={close} snapPoints={["half", "full"]}>
        <RNHostView>
          <View style={{ width: sheetWidth, height: sheetHeight }}>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 8,
                paddingBottom: insets.bottom + 20,
              }}
            >
              <Text className="text-2xl font-semibold text-black dark:text-white mb-4">
                New reading
              </Text>

              <View className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 py-3 mb-5">
                <View className="flex-row items-center justify-between px-4 mb-1">
                  <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    SYSTOLIC / DIASTOLIC
                  </Text>
                  {zone && (
                    <Text className="text-xs font-semibold" style={{ color: zone.lc }}>
                      {zone.label}
                    </Text>
                  )}
                </View>
                <View className="items-center">
                  <ZoneChart
                    width={chartWidth}
                    height={Math.round(chartWidth * 0.78)}
                    systolic={systolic}
                    diastolic={diastolic}
                    axisColor={dark ? "#a3a3a3" : "#737373"}
                  />
                </View>
              </View>

              {FIELDS.map(({ key, label, placeholder, unit, optional }) => (
                <View key={key} className="mb-4">
                  <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5">
                    {optional ? `${label} (optional)` : label}
                  </Text>
                  <View className="flex-row items-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
                    <TextInput
                      value={values[key]}
                      onChangeText={(text) => setField(key, text)}
                      placeholder={placeholder}
                      placeholderTextColor="#a3a3a3"
                      keyboardType="number-pad"
                      maxLength={3}
                      className="flex-1 px-4 py-3 text-base text-black dark:text-white"
                    />
                    <Text className="px-4 text-sm text-neutral-500 dark:text-neutral-400">
                      {unit}
                    </Text>
                  </View>
                </View>
              ))}

              {error && (
                <Text className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</Text>
              )}

              <View className="flex-row gap-3 mt-2">
                <Pressable
                  onPress={close}
                  className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 py-3 active:opacity-60"
                >
                  <Text className="text-center font-semibold text-black dark:text-white">
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={save}
                  disabled={!canSave}
                  style={{ opacity: canSave ? 1 : 0.4 }}
                  className="flex-1 rounded-xl bg-rose-500 py-3 active:opacity-60"
                >
                  <Text className="text-center font-semibold text-white">
                    {saving ? "Saving…" : "Save"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </RNHostView>
      </BottomSheet>
    </Host>
  );
}
