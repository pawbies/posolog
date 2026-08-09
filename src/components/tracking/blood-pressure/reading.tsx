import { classifyZone } from "@/components/tracking/blood-pressure/zone-chart";
import { bloodPressureReadings } from "@/db/schema";
import { ChevronDown, HeartPulse, Trash2 } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type Reading = typeof bloodPressureReadings.$inferSelect;

type Props = {
  reading: Reading;
  /** Takes over the tap; without it the row expands its own detail panel. */
  onPress?: (reading: Reading) => void;
  onDelete?: (id: number) => void;
};

const DAY_MS = 86_400_000;

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** "Today · 09:14", "Yesterday · 21:02", or "12 Mar · 08:30" past that. */
function formatReadingAt(date: Date) {
  const time = date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  // Rounded so a DST shift inside the span can't push a day either way.
  const daysAgo = Math.round(
    (startOfDay(new Date()).getTime() - startOfDay(date).getTime()) / DAY_MS,
  );

  if (daysAgo <= 0) return `Today · ${time}`;
  if (daysAgo === 1) return `Yesterday · ${time}`;

  const day = date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    // Only spell out the year once the reading is not from the current one.
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
  return `${day} · ${time}`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1">
      <Text className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {label}
      </Text>
      <Text className="mt-0.5 text-sm text-neutral-700 dark:text-neutral-200">{value}</Text>
    </View>
  );
}

export default function Reading({ reading, onPress, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  const zone = classifyZone(reading.systolic, reading.diastolic);
  // "Pre-high blood pressure" is too wide for a row pill; the detail panel
  // below keeps the full wording.
  const zoneLabel = zone.label.replace(/ blood pressure$/i, "");

  const expandable = !onPress;
  const handlePress = () => (onPress ? onPress(reading) : setExpanded((prev) => !prev));

  const pulsePressure = reading.systolic - reading.diastolic;
  // Standard estimate: diastolic plus a third of the pulse pressure.
  const meanArterial = Math.round(reading.diastolic + pulsePressure / 3);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${reading.systolic} over ${reading.diastolic} mmHg, ${zone.label}, ${formatReadingAt(reading.readingAt)}`}
      accessibilityHint={expandable ? "Shows the full reading details" : undefined}
      accessibilityState={expandable ? { expanded } : undefined}
      // A touch of scale on top of the opacity dip, so the whole row reads as
      // one target rather than the delete button being the only live thing.
      style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.985 : 1 }] })}
      className="rounded-2xl bg-neutral-100 dark:bg-neutral-900 px-4 py-3 active:opacity-70"
    >
      <View className="flex-row items-center">
        {/* Zone swatch — same fills the zone chart uses, so a row reads the
            same colour the reading plots in. */}
        <View className="h-10 w-1.5 rounded-full" style={{ backgroundColor: zone.fill }} />

        <View className="flex-1 ml-3">
          <View className="flex-row items-baseline">
            <Text className="text-xl font-semibold text-black dark:text-white">
              {reading.systolic}
              <Text className="text-neutral-400 dark:text-neutral-500">/</Text>
              {reading.diastolic}
            </Text>
            <Text className="ml-1.5 text-xs text-neutral-500 dark:text-neutral-400">mmHg</Text>

            {reading.pulse != null && (
              <View className="flex-row items-center ml-3">
                <HeartPulse size={13} color="#a855f7" />
                <Text className="ml-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {reading.pulse} bpm
                </Text>
              </View>
            )}
          </View>

          <Text className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {formatReadingAt(reading.readingAt)}
          </Text>
        </View>

        <View className="rounded-full px-2 py-1" style={{ backgroundColor: zone.fill }}>
          <Text className="text-[10px] font-semibold" style={{ color: zone.lc }}>
            {zoneLabel}
          </Text>
        </View>

        {expandable ? (
          <ChevronDown
            size={16}
            color="#a3a3a3"
            style={{
              marginLeft: 8,
              transform: [{ rotate: expanded ? "180deg" : "0deg" }],
            }}
          />
        ) : (
          // Without the detail panel there is nowhere else for delete to live.
          onDelete && (
            <Pressable
              onPress={() => onDelete(reading.id)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Delete reading"
              className="ml-3 active:opacity-50"
            >
              <Trash2 size={18} color="#a3a3a3" />
            </Pressable>
          )
        )}
      </View>

      {expandable && expanded && (
        <Animated.View entering={FadeIn.duration(160)} exiting={FadeOut.duration(120)}>
          <View className="mt-3 border-t border-neutral-200 dark:border-neutral-800 pt-3">
            <Text className="text-xs font-semibold" style={{ color: zone.lc }}>
              {zone.label}
            </Text>

            <View className="mt-2 flex-row">
              <Metric label="Pulse pressure" value={`${pulsePressure} mmHg`} />
              <Metric label="Mean arterial" value={`${meanArterial} mmHg`} />
              <Metric
                label="Pulse"
                value={reading.pulse == null ? "Not recorded" : `${reading.pulse} bpm`}
              />
            </View>

            <Text className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              {reading.readingAt.toLocaleString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </Text>

            {onDelete && (
              <Pressable
                onPress={() => onDelete(reading.id)}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Delete reading"
                className="mt-3 flex-row items-center self-start rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 active:opacity-60"
              >
                <Trash2 size={14} color="#ef4444" />
                <Text className="ml-1.5 text-xs font-semibold text-red-500">Delete</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      )}
    </Pressable>
  );
}
