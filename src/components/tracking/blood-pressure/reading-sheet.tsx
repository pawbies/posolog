import NumberField from "@/components/number-field";
import Text from "@/components/text";
import ZoneChart, { classifyZone } from "@/components/tracking/blood-pressure/zone-chart";
import { bloodPressureReadings } from "@/db/schema";
import { BottomSheet, Host, RNHostView } from "@expo/ui";
import { ArrowDown, ArrowUp, CalendarClock, HeartPulse } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Reading = typeof bloodPressureReadings.$inferSelect;

export type ReadingDraft = {
  systolic: number;
  diastolic: number;
  pulse: number | undefined;
  readingAt: Date;
};

type Props = {
  isPresented: boolean;
  title: string;
  submitLabel: string;
  initial?: Reading | null;
  onSubmit: (draft: ReadingDraft) => Promise<void>;
  onDismiss: () => void;
};

function formatTakenAt(date: Date) {
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function validate(systolic: number | undefined, diastolic: number | undefined, pulse: number | undefined) {
  if (systolic === undefined) return "Systolic is required.";
  if (systolic < 50 || systolic > 260) return "Systolic must be between 50 and 260.";
  if (diastolic === undefined) return "Diastolic is required.";
  if (diastolic < 30 || diastolic > 200) return "Diastolic must be between 30 and 200.";
  if (diastolic >= systolic) return "Diastolic must be lower than systolic.";
  if (pulse !== undefined && (pulse < 25 || pulse > 250)) return "Pulse must be between 25 and 250.";
  return null;
}

export default function ReadingSheet({ isPresented, title, submitLabel, initial, onSubmit, onDismiss,}: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { colorScheme } = useColorScheme();

  const [systolic, setSystolic] = useState<number | undefined>();
  const [diastolic, setDiastolic] = useState<number | undefined>();
  const [pulse, setPulse] = useState<number | undefined>();

  const [readingAt, setReadingAt] = useState(() => new Date());
  const [showingDateTimeModal, setShowingDateTimeModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPresented) return;
    setDiastolic(initial ? initial.diastolic : undefined);
    setSystolic(initial ? initial.systolic : undefined);
    setPulse(initial && initial.pulse ? initial.pulse : undefined);
    setReadingAt(initial?.readingAt ?? new Date());
    setShowingDateTimeModal(false);
    setError(null);
  }, [isPresented, initial?.id]);

  const zone = systolic !== undefined && diastolic !== undefined ? classifyZone(systolic ?? 0, diastolic ?? 0) : null;

  const close = () => {
    setDiastolic(undefined);
    setSystolic(undefined);
    setPulse(undefined);
    setReadingAt(new Date());
    setShowingDateTimeModal(false);
    setError(null);
    onDismiss();
  };

  const save = async () => {
    const message = validate(systolic, diastolic, pulse);
    if (message !== null || systolic === undefined || diastolic === undefined) {
      setError(message);
      return;
    }

    setSaving(true);
    try {
      await onSubmit({ systolic, diastolic, pulse, readingAt });
      close();
    } catch {
      setError("Could not save the reading.");
    } finally {
      setSaving(false);
    }
  };

  const canSave = systolic !== undefined && diastolic !== undefined && !saving;

  const sheetWidth = width - 32;
  const chartWidth = Math.min(sheetWidth - 40, 380);

  return (
    <Host>
      <BottomSheet isPresented={isPresented} onDismiss={close} snapPoints={["full"]}>
        <RNHostView>
          <View style={{ width: sheetWidth }}>
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              bottomOffset={16}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 8,
                paddingBottom: insets.bottom + 20
              }}
            >
              <Text className="text-2xl font-semibold mb-4">
                {title}
              </Text>

              <View className="rounded-2xl border border-border bg-surface py-3 mb-5">
                <View className="flex-row items-center justify-between px-4 mb-1">
                  <Text muted className="text-xs font-semibold">
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
                    axisColor={colorScheme === "dark" ? "#a3a3a3" : "#737373"}
                  />
                </View>
              </View>

              <NumberField
                icon={ArrowUp}
                iconColor="#f43f5e"
                iconSize={18}
                label="Systolic"
                placeholder="120"
                unit="mmHg"
                value={systolic?.toString()}
                onChangeText={(text) => setSystolic(text === "" ? undefined : Number(text))}
              />

              <NumberField
                icon={ArrowDown}
                iconColor="#3b82f6"
                iconSize={18}
                label="Diastolic"
                placeholder="80"
                unit="mmHg"
                value={diastolic?.toString()}
                onChangeText={(text) => setDiastolic(text === "" ? undefined : Number(text))}
              />

              <NumberField
                icon={HeartPulse}
                iconColor="#a855f7"
                iconSize={18}
                label="Pulse (optional)"
                placeholder="70"
                unit="bpm"
                value={pulse?.toString()}
                onChangeText={(text) => setPulse(text === "" ? undefined : Number(text))}
              />

              <View className="mb-4">
                <Text muted className="text-xs font-semibold mb-1.5">
                  Taken at
                </Text>
                <Pressable
                  onPress={() => setShowingDateTimeModal(true)}
                  accessibilityRole="button"
                  className="flex-row items-center rounded-xl border border-border bg-surface py-3 active:opacity-60"
                >
                  <View className="pl-4">
                    <CalendarClock size={18} color="#a3a3a3" />
                  </View>
                  <Text className="flex-1 px-3 text-base">
                    {formatTakenAt(readingAt)}
                  </Text>
                  <Text className="pr-4 text-sm text-rose-500">
                    Change
                  </Text>
                </Pressable>

                <DateTimePickerModal
                  isVisible={showingDateTimeModal}
                  mode="datetime"
                  date={readingAt}
                  onConfirm={(d) => { setReadingAt(d); setShowingDateTimeModal(false); }}
                  accentColor="#f43f5e"
                  onCancel={() => setShowingDateTimeModal(false)}
                />
              </View>

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
                  {saving ?
                    <ActivityIndicator size="small" color="#fff" />
                  : <Text className="text-center font-semibold text-white">{submitLabel}</Text>}
                </Pressable>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </RNHostView>
      </BottomSheet>
    </Host>
  );
}
