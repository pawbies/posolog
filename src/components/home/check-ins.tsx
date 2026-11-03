import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import IconBadge from "@/components/ui/icon-badge";
import Text from "@/components/ui/text";
import { Alert, View } from "react-native";
import { ArrowRight, Moon, Sun } from "lucide-react-native";
import { usePalette } from "@/hooks/use-palette";

const CHECK_INS = [
  { key: "morning", label: "Morning", icon: Sun, tone: "cream" },
  { key: "evening", label: "Evening", icon: Moon, tone: "sky" },
] as const;

export default function CheckIns() {
  const { tones } = usePalette();
  const notImplemented = () => Alert.alert("Not implemented", "Check ins are not implemented yet.");

  return (
    <>
      <Heading size="md" className="mb-3 mt-8">Check ins</Heading>
      <View className="flex-row gap-3">
        {CHECK_INS.map(({ key, label, icon, tone }) => (
          <Card
            key={key}
            tone={tone}
            onPress={notImplemented}
            accessibilityLabel={`Start ${label.toLowerCase()} check in`}
            className="h-40 flex-1 justify-between"
          >
            <IconBadge icon={icon} tone={tone} onTint />
            <View className="flex-row items-end justify-between">
              <View>
                <Heading size="sm">{label}</Heading>
                <Text muted className="text-sm">Check in</Text>
              </View>
              <ArrowRight size={20} color={tones[tone]} strokeWidth={2.5} />
            </View>
          </Card>
        ))}
      </View>
    </>
  );
}
