import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import IconBadge from "@/components/ui/icon-badge";
import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { usePalette } from "@/hooks/use-palette";
import { Clock, Plus, Tablets } from "lucide-react-native";
import { Alert, View } from "react-native";

type Strength = {
  name: string;
  form: string;
  color: string;
  route: string;
  amount: string;
  times: string[];
};

// Regimens aren't wired up to the database yet.
const STRENGTHS: Strength[] = [];

export default function Regimen() {
  const { muted } = usePalette();

  return (
    <>
      <Heading size="md" className="mb-3 mt-8">Regimen</Heading>
      {STRENGTHS.length > 0 ? (
        <Card className="p-0">
          {STRENGTHS.map((strength, index) => (
            <View key={index} className={`flex-row items-center px-4 py-4 ${index === 0 ? "" : "border-t-2 border-border"}`}>
              <IconBadge icon={Tablets} color={strength.color} />

              <View className="ml-3.5 flex-1 gap-1.5">
                <Text className="text-base font-semibold">{strength.name}</Text>
                <Text muted className="text-sm">{strength.amount} · {strength.route} {strength.form}</Text>
                <View className="flex-row flex-wrap items-center gap-2">
                  <Clock size={14} color={muted} />
                  {strength.times.map((time) => (
                    <View key={time} className="rounded-full px-2.5 py-0.5" style={{ backgroundColor: `${strength.color}26` }}>
                      <Text className="text-xs font-semibold" style={{ color: strength.color }}>{time}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Log dose of ${strength.name}`}
                hitSlop={8}
                className="ml-3 h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: strength.color }}
              >
                <Plus size={22} color="#fff" strokeWidth={2.75} />
              </Pressable>
            </View>
          ))}
        </Card>
      ) : (
        <Card tone="peach" className="items-center px-6 py-7">
          <IconBadge icon={Tablets} tone="peach" size="lg" onTint />
          <Heading size="sm" className="mt-4">No regimen yet</Heading>
          <Text muted className="mt-1 text-center text-sm leading-5">
            Set up a regimen to handle medication schedules and see your medications here.
          </Text>
          <Button
            label="Set up regimen"
            icon={Plus}
            onPress={() => Alert.alert("Not implemented", "This feature is not implemented yet.")}
            className="mt-5 self-stretch"
          />
        </Card>
      )}
    </>
  );
}
