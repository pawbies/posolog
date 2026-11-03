import { classifyZone } from "@/components/tracking/blood-pressure/zone-chart";
import Text from "@/components/ui/text";
import type { BloodPressureReading } from "@/db/schema";
import { usePalette } from "@/hooks/use-palette";
import { ChevronDown, HeartPulse, Pencil, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type Props = {
  reading: BloodPressureReading;
  onPress?: (reading: BloodPressureReading) => void;
  onDelete?: (id: number) => void;
  onEdit?: (reading: BloodPressureReading) => void;
};

const DAY_MS = 86_400_000;

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatReadingAt(date: Date) {
  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  const daysAgo = Math.round(
    (startOfDay(new Date()).getTime() - startOfDay(date).getTime()) / DAY_MS,
  );

  if (daysAgo <= 0) return `Today · ${time}`;
  if (daysAgo === 1) return `Yesterday · ${time}`;

  const day = date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
  return `${day} · ${time}`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text muted className="text-xs font-medium">{label}</Text>
      <Text className="mt-0.5 font-display-bold text-base">{value}</Text>
    </View>
  );
}

export default function Reading({ reading, onPress, onDelete, onEdit }: Props) {
  const [expanded, setExpanded] = useState(false);
  const { chevron, tones, danger } = usePalette();

  const zone = classifyZone(reading.systolic, reading.diastolic);
  const zoneLabel = zone.label.replace(/ blood pressure$/i, "");

  const expandable = !onPress;
  const handlePress = () => (onPress ? onPress(reading) : setExpanded((prev) => !prev));

  const pulsePressure = reading.systolic - reading.diastolic;
  const meanArterial = Math.round(reading.diastolic + pulsePressure / 3);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${reading.systolic} over ${reading.diastolic} mmHg, ${zone.label}, ${formatReadingAt(reading.readingAt)}`}
      accessibilityHint={expandable ? "Shows the full reading details" : undefined}
      accessibilityState={expandable ? { expanded } : undefined}

      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.985 : 1 }] })}
      className="rounded-[24px] border-2 border-border bg-surface px-4 py-3.5 active:opacity-80"
    >
      <View className="flex-row items-center">
        <View className="h-11 w-1.5 rounded-full" style={{ backgroundColor: zone.fill }} />

        <View className="flex-1 ml-3">
          <View className="flex-row items-baseline">
            <Text className="font-display text-2xl">
              {reading.systolic}
              <Text muted>/</Text>
              {reading.diastolic}
            </Text>
            <Text muted className="ml-1.5 text-xs font-medium">mmHg</Text>

            {reading.pulse != null && (
              <View className="flex-row items-center ml-3">
                <HeartPulse size={13} color={tones.lilac} />
                <Text muted className="ml-1 text-xs font-medium">
                  {reading.pulse} bpm
                </Text>
              </View>
            )}
          </View>

          <Text muted className="mt-0.5 text-xs">
            {formatReadingAt(reading.readingAt)}
          </Text>
        </View>

        <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: zone.fill }}>
          <Text className="text-[11px] font-bold" style={{ color: zone.lc }}>
            {zoneLabel}
          </Text>
        </View>

        {expandable ? (
          <ChevronDown
            size={16}
            color={chevron}
            style={{
              marginLeft: 8,
              transform: [{ rotate: expanded ? "180deg" : "0deg" }],
            }}
          />
        ) : (
          onDelete && (
            <Pressable
              onPress={() => onDelete(reading.id)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Delete reading"
              className="ml-3 active:opacity-50"
            >
              <Trash2 size={18} color={chevron} />
            </Pressable>
          )
        )}
      </View>

      {expandable && expanded && (
        <Animated.View entering={FadeIn.duration(160)} exiting={FadeOut.duration(120)}>
          <View className="mt-3 border-t-2 border-border pt-3">
            <Text className="text-sm font-semibold">{zone.label}</Text>

            <View className="mt-2 flex-row">
              <Metric label="Pulse pressure" value={`${pulsePressure} mmHg`} />
              <Metric label="Mean arterial" value={`${meanArterial} mmHg`} />
              <Metric
                label="Pulse"
                value={reading.pulse == null ? "Not recorded" : `${reading.pulse} bpm`}
              />
            </View>

            <Text muted className="mt-3 text-xs">
              {reading.readingAt.toLocaleString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>

            <View className="mt-3 flex-row gap-2">
              {onEdit && (
                <Pressable
                  onPress={() => onEdit(reading)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Edit reading"
                  className="flex-row items-center rounded-full bg-tint-sky px-3.5 py-2 active:opacity-60"
                >
                  <Pencil size={14} color={tones.sky} strokeWidth={2.5} />
                  <Text className="ml-1.5 font-display-bold text-sm" style={{ color: tones.sky }}>Edit</Text>
                </Pressable>
              )}

              {onDelete && (
                <Pressable
                  onPress={() => onDelete(reading.id)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Delete reading"
                  className="flex-row items-center rounded-full bg-error/10 px-3.5 py-2 active:opacity-60"
                >
                  <Trash2 size={14} color={danger} strokeWidth={2.5} />
                  <Text className="ml-1.5 font-display-bold text-sm text-error">Delete</Text>
                </Pressable>
              )}
            </View>
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}
