import Card from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import IconBadge from "@/components/ui/icon-badge";
import Text from "@/components/ui/text";
import { type Tone } from "@/constants/colors";
import { usePalette } from "@/hooks/use-palette";
import { ArrowUpRight, LucideIcon } from "lucide-react-native";
import { View } from "react-native";

type MetricCardProps = {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

export default function MetricCard({ icon, tone, title, subtitle, onPress }: MetricCardProps) {
  const { tones } = usePalette();

  return (
    <View className="mb-3 w-1/2 px-1.5">
      <Card tone={tone} onPress={onPress} accessibilityLabel={`${title}, ${subtitle}`} className="h-44 justify-between">
        <View className="flex-row items-start justify-between">
          <IconBadge icon={icon} tone={tone} onTint />
          <ArrowUpRight size={20} color={tones[tone]} strokeWidth={2.5} />
        </View>
        <View>
          <Heading size="sm">{title}</Heading>
          <Text muted className="mt-0.5 text-sm">{subtitle}</Text>
        </View>
      </Card>
    </View>
  );
}
