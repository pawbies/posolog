import FieldLabel, { fieldBox } from "@/components/form/field-label";
import NumberField from "@/components/form/number-field";
import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import Text from "@/components/ui/text";
import { usePalette } from "@/hooks/use-palette";
import ZoneChart, { classifyZone } from "@/components/tracking/blood-pressure/zone-chart";
import type { ReadingDraft } from "@/db/queries/blood-pressure";
import type { BloodPressureReading } from "@/db/schema";
import { BottomSheet, Host, RNHostView } from "@expo/ui";
import { ArrowDown, ArrowUp, CalendarClock, HeartPulse } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Pressable,
  Platform,
  useWindowDimensions,
  View
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { initialWindowMetrics } from "react-native-safe-area-context";

type Props = {
  isPresented: boolean;
  title: string;
  submitLabel: string;
  initial?: BloodPressureReading | null;
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

export default function ReadingSheet({ isPresented, title, submitLabel, initial, onSubmit, onDismiss }: Props) {
  const { width, height } = useWindowDimensions();
  // Inside the sheet, useSafeAreaInsets() reports the presenting screen's insets (tab bar
  // included), so use the device's own.
  const deviceInsets = initialWindowMetrics?.insets ?? { top: 0, bottom: 0 };
  const { muted, tones } = usePalette();

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

  // BottomSheet pads its content by 16 on the top and sides.
  const sheetWidth = width - 32;
  // On iOS the hosted view reports a height taller than the visible sheet, which leaves the
  // bottom of the form unreachable. A full-height sheet starts at the top safe area, so size
  // the content from that instead.
  const sheetHeight = Platform.OS === "ios" ? { height: height - deviceInsets.top - 16 } : { flex: 1 };
  const chartWidth = Math.min(sheetWidth - 40, 380);

  return (
    <Host>
      <BottomSheet isPresented={isPresented} onDismiss={close} snapPoints={["full"]}>
        <RNHostView>
          <View style={{ ...sheetHeight, width: sheetWidth }}>
            <KeyboardAwareScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              bottomOffset={16}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingTop: 8,
                paddingBottom: deviceInsets.bottom + 20
              }}
            >
              <Heading size="lg" className="mb-5">{title}</Heading>

              <View className="mb-6 rounded-[28px] border-2 border-border bg-surface py-4">
                <View className="mb-1 flex-row items-center justify-between px-5">
                  <Text muted className="font-display-medium text-sm">
                    Systolic / diastolic
                  </Text>
                  {zone && (
                    <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: zone.fill }}>
                      <Text className="text-[11px] font-bold" style={{ color: zone.lc }}>
                        {zone.label}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="items-center">
                  <ZoneChart
                    width={chartWidth}
                    height={Math.round(chartWidth * 0.78)}
                    systolic={systolic}
                    diastolic={diastolic}
                    axisColor={muted}
                  />
                </View>
              </View>

              <NumberField
                icon={ArrowUp}
                iconColor={tones.rose}
                iconSize={18}
                label="Systolic"
                placeholder="120"
                unit="mmHg"
                value={systolic?.toString()}
                onChangeText={(text) => setSystolic(text === "" ? undefined : Number(text))}
              />

              <NumberField
                icon={ArrowDown}
                iconColor={tones.sky}
                iconSize={18}
                label="Diastolic"
                placeholder="80"
                unit="mmHg"
                value={diastolic?.toString()}
                onChangeText={(text) => setDiastolic(text === "" ? undefined : Number(text))}
              />

              <NumberField
                icon={HeartPulse}
                iconColor={tones.lilac}
                iconSize={18}
                label="Pulse (optional)"
                placeholder="70"
                unit="bpm"
                value={pulse?.toString()}
                onChangeText={(text) => setPulse(text === "" ? undefined : Number(text))}
              />

              <View className="mb-5">
                <FieldLabel>Taken at</FieldLabel>
                <Pressable
                  onPress={() => setShowingDateTimeModal(true)}
                  accessibilityRole="button"
                  accessibilityLabel={`Taken at ${formatTakenAt(readingAt)}. Change`}
                  className={`${fieldBox} py-4 active:opacity-60`}
                >
                  <View className="pl-4">
                    <CalendarClock size={20} color={tones.cream} strokeWidth={2.25} />
                  </View>
                  <Text className="flex-1 px-3 text-base font-medium">
                    {formatTakenAt(readingAt)}
                  </Text>
                  <Text className="pr-5 font-display-bold text-sm" style={{ color: tones.rose }}>
                    Change
                  </Text>
                </Pressable>

                <DateTimePickerModal
                  isVisible={showingDateTimeModal}
                  mode="datetime"
                  date={readingAt}
                  onConfirm={(d) => { setReadingAt(d); setShowingDateTimeModal(false); }}
                  accentColor={tones.rose}
                  onCancel={() => setShowingDateTimeModal(false)}
                />
              </View>

              {error && (
                <View className="mb-3 rounded-2xl bg-error/10 px-4 py-3">
                  <Text className="text-sm font-medium text-error">{error}</Text>
                </View>
              )}

              <View className="mt-2 flex-row gap-3">
                <Button label="Cancel" variant="secondary" onPress={close} className="flex-1" />
                <Button
                  label={submitLabel}
                  onPress={save}
                  disabled={!canSave && !saving}
                  loading={saving}
                  className="flex-1"
                />
              </View>
            </KeyboardAwareScrollView>
          </View>
        </RNHostView>
      </BottomSheet>
    </Host>
  );
}
