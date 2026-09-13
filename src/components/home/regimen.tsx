import Pressable from "@/components/pressable";
import Text from "@/components/text";
import { Clock, Plus, Tablets } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Alert, View } from "react-native";

/*
const STRENGTHS = [
  { name: "Tadalafil 5mg", form: "Tablet", color: "#e36c64", route: "Oral", amount: "5 mg", times: ["06:00"] },
  { name: "Minostad 50mg", form: "Capsule", color: "#649de3", route: "Oral", amount: "50 mg", times: ["09:00", "21:00"] },
  ];
*/
const STRENGTHS: any[] = [];

export default function Regimen() {
  const colorScheme = useColorScheme().colorScheme;
  const muted = colorScheme === "dark" ? "#9696a0" : "#71717a";
  const onPrimary = colorScheme === "dark" ? "#0c0c0e" : "#ffffff";

  return (
    <>
      <Text className="mt-6 mb-2 text-lg font-medium">Regimen</Text>
      <View className="bg-surface w-full rounded-md overflow-hidden">
        {STRENGTHS.length > 0 ? STRENGTHS.map((strength, index) => (
          <View key={index} className={`flex-row items-center px-4 py-3.5 ${index === 0 ? "" : "border-t border-border"}`}>
            <View className="w-1 self-stretch rounded-full mr-3.5" style={{ backgroundColor: strength.color }} />

            <View className="flex-1 gap-1.5">
              <Text className="text-base font-semibold">{strength.name}</Text>

              <View className="flex-row items-center gap-2">
                <Tablets size={14} color={muted} />
                <Text muted className="text-sm">{strength.amount} · {strength.route} {strength.form}</Text>
              </View>

              <View className="flex-row items-center gap-2 flex-wrap">
                <Clock size={14} color={muted} />
                {strength.times.map((time: string) => (
                  <View key={time} className="rounded-full px-2 py-0.5" style={{ backgroundColor: `${strength.color}26` }}>
                    <Text className="text-xs font-medium" style={{ color: strength.color }}>{time}</Text>
                  </View>
                ))}
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Log dose of ${strength.name}`}
              hitSlop={8}
              className="ml-3 rounded-full p-2.5"
              style={{ backgroundColor: `${strength.color}26` }}
            >
              <Plus size={20} color={strength.color} />
            </Pressable>
          </View>
        )) : (
          <View className="items-center px-6 py-8">
            <View className="bg-background rounded-full p-3.5">
              <Tablets size={24} color={muted} />
            </View>

            <Text className="mt-3 text-base font-semibold">No regimen yet</Text>
            <Text muted className="mt-1 text-sm text-center">
              Set up a regimen to handle medication schedules and see your medications here.
            </Text>

            <Pressable
              onPress={() => Alert.alert("Not implemented", "This feature is not implemented yet.")}
              accessibilityRole="button"
              accessibilityLabel="Set up regimen"
              hitSlop={8}
              className="mt-4 flex-row items-center gap-2 bg-primary rounded-full px-4 py-2.5"
            >
              <Plus size={18} color={onPrimary} />
              <Text className="text-sm font-semibold" style={{ color: onPrimary }}>Set up regimen</Text>
            </Pressable>
          </View>
        )}
      </View>
    </>
  )
}
