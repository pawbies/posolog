import ZoneChart, { classifyZone } from "@/components/tracking/blood-pressure/zone-chart";
import { bloodPressureReadings } from "@/db/schema";
import { BottomSheet, Host, RNHostView } from "@expo/ui";
import { DateTimePicker } from "@expo/ui/community/datetime-picker";
import { ArrowDown, ArrowUp, CalendarClock, HeartPulse } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useEffect, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Reading = typeof bloodPressureReadings.$inferSelect;

export type ReadingDraft = {
  systolic: number;
  diastolic: number;
  pulse: number | null;
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

type FieldProps = {
  icon: ReactNode;
  label: string;
  placeholder: string;
  unit: string;
  value: string;
  onChangeText: (text: string) => void;
};

type PickerStep = "date" | "time" | null;

const ANDROID = Platform.OS === "android";
const EMPTY = { systolic: "", diastolic: "", pulse: "" };

function formatTakenAt(date: Date) {
  return date.toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function toNumber(value: string) {
  return value === "" ? null : Number.parseInt(value, 10);
}

function validate(systolic: number | null, diastolic: number | null, pulse: number | null) {
  if (systolic === null) return "Systolic is required.";
  if (systolic < 50 || systolic > 260) return "Systolic must be between 50 and 260.";
  if (diastolic === null) return "Diastolic is required.";
  if (diastolic < 30 || diastolic > 200) return "Diastolic must be between 30 and 200.";
  if (diastolic >= systolic) return "Diastolic must be lower than systolic.";
  if (pulse !== null && (pulse < 25 || pulse > 250)) return "Pulse must be between 25 and 250.";
  return null;
}

function useKeyboardHeight() {
  const { height } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const ios = Platform.OS === "ios";
    const shown = Keyboard.addListener(
      ios ? "keyboardWillChangeFrame" : "keyboardDidShow",
      (event) => setKeyboardHeight(Math.max(0, height - event.endCoordinates.screenY)),
    );
    const hidden = Keyboard.addListener(ios ? "keyboardWillHide" : "keyboardDidHide", () =>
      setKeyboardHeight(0),
    );
    return () => {
      shown.remove();
      hidden.remove();
    };
  }, [height]);

  return keyboardHeight;
}

function NumberField({ icon, label, placeholder, unit, value, onChangeText }: FieldProps) {
  return (
    <View className="mb-4">
      <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5">
        {label}
      </Text>
      <View className="flex-row items-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
        <View className="pl-4">{icon}</View>
        <TextInput
          value={value}
          onChangeText={(text) => onChangeText(text.replace(/[^0-9]/g, ""))}
          placeholder={placeholder}
          placeholderTextColor="#a3a3a3"
          keyboardType="number-pad"
          maxLength={3}
          className="flex-1 px-3 py-3 text-base text-black dark:text-white"
        />
        <Text className="pr-4 text-sm text-neutral-500 dark:text-neutral-400">{unit}</Text>
      </View>
    </View>
  );
}

export default function ReadingSheet({
  isPresented,
  title,
  submitLabel,
  initial,
  onSubmit,
  onDismiss,
}: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === "dark";
  const keyboardHeight = useKeyboardHeight();

  const [values, setValues] = useState(EMPTY);
  const [readingAt, setReadingAt] = useState(() => new Date());
  const [step, setStep] = useState<PickerStep>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPresented) return;
    setValues(
      initial ?
        {
          systolic: String(initial.systolic),
          diastolic: String(initial.diastolic),
          pulse: initial.pulse == null ? "" : String(initial.pulse),
        }
      : EMPTY,
    );
    setReadingAt(initial?.readingAt ?? new Date());
    setStep(null);
    setError(null);
  }, [isPresented, initial?.id]);

  const systolic = toNumber(values.systolic);
  const diastolic = toNumber(values.diastolic);
  const pulse = toNumber(values.pulse);
  const zone = systolic !== null && diastolic !== null ? classifyZone(systolic, diastolic) : null;

  const setField = (field: keyof typeof EMPTY) => (text: string) => {
    setValues((prev) => ({ ...prev, [field]: text }));
    setError(null);
  };

  const close = () => {
    setValues(EMPTY);
    setReadingAt(new Date());
    setStep(null);
    setError(null);
    onDismiss();
  };

  const save = async () => {
    const message = validate(systolic, diastolic, pulse);
    if (message !== null || systolic === null || diastolic === null) {
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

  const canSave = systolic !== null && diastolic !== null && !saving;

  const sheetWidth = width - 32;
  const sheetHeight = height - insets.top - 24 - keyboardHeight;
  const chartWidth = Math.min(sheetWidth - 40, 380);

  return (
    <Host>
      <BottomSheet isPresented={isPresented} onDismiss={close} snapPoints={["full"]}>
        <RNHostView>
          <View style={{ width: sheetWidth, height: sheetHeight }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 8,
                paddingBottom: insets.bottom + 20,
              }}
            >
              <Text className="text-2xl font-semibold text-black dark:text-white mb-4">
                {title}
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

              <NumberField
                icon={<ArrowUp size={18} color="#f43f5e" />}
                label="Systolic"
                placeholder="120"
                unit="mmHg"
                value={values.systolic}
                onChangeText={setField("systolic")}
              />

              <NumberField
                icon={<ArrowDown size={18} color="#3b82f6" />}
                label="Diastolic"
                placeholder="80"
                unit="mmHg"
                value={values.diastolic}
                onChangeText={setField("diastolic")}
              />

              <NumberField
                icon={<HeartPulse size={18} color="#a855f7" />}
                label="Pulse (optional)"
                placeholder="70"
                unit="bpm"
                value={values.pulse}
                onChangeText={setField("pulse")}
              />

              <View className="mb-4">
                <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1.5">
                  Taken at
                </Text>
                <Pressable
                  onPress={() => setStep((prev) => (prev ? null : "date"))}
                  accessibilityRole="button"
                  accessibilityState={ANDROID ? undefined : { expanded: step !== null }}
                  className="flex-row items-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 py-3 active:opacity-60"
                >
                  <View className="pl-4">
                    <CalendarClock size={18} color="#a3a3a3" />
                  </View>
                  <Text className="flex-1 px-3 text-base text-black dark:text-white">
                    {formatTakenAt(readingAt)}
                  </Text>
                  <Text className="pr-4 text-sm text-rose-500">
                    {step && !ANDROID ? "Done" : "Change"}
                  </Text>
                </Pressable>

                {step !== null && !ANDROID && (
                  <DateTimePicker
                    value={readingAt}
                    mode="datetime"
                    display="spinner"
                    presentation="inline"
                    maximumDate={new Date()}
                    accentColor="#f43f5e"
                    onValueChange={(_, date) => setReadingAt(date)}
                  />
                )}

                {ANDROID && step === "date" && (
                  <DateTimePicker
                    value={readingAt}
                    mode="date"
                    maximumDate={new Date()}
                    accentColor="#f43f5e"
                    onValueChange={(_, date) => {
                      setReadingAt((prev) => {
                        const next = new Date(prev);
                        next.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                        return next;
                      });
                      setStep("time");
                    }}
                    onDismiss={() => setStep(null)}
                  />
                )}

                {ANDROID && step === "time" && (
                  <DateTimePicker
                    value={readingAt}
                    mode="time"
                    accentColor="#f43f5e"
                    onValueChange={(_, time) => {
                      setReadingAt((prev) => {
                        const next = new Date(prev);
                        next.setHours(time.getHours(), time.getMinutes(), 0, 0);
                        return next;
                      });
                      setStep(null);
                    }}
                    onDismiss={() => setStep(null)}
                  />
                )}
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
            </ScrollView>
          </View>
        </RNHostView>
      </BottomSheet>
    </Host>
  );
}
