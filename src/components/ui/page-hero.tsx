import Heading from "@/components/ui/heading";
import Text from "@/components/ui/text";
import { toneBg, type Tone } from "@/constants/colors";
import { usePalette } from "@/hooks/use-palette";
import { cn } from "@/lib/cn";
import { type LucideIcon } from "lucide-react-native";
import { View } from "react-native";

type PageHeroProps = {
  icon: LucideIcon;
  tone: Tone;
  title: string;
  subtitle?: string;
};

export default function PageHero({ icon: Icon, tone, title, subtitle }: PageHeroProps) {
  const { tones } = usePalette();

  return (
    <View className="items-center pb-8 pt-6">
      <View className={cn("h-28 w-28 items-center justify-center rounded-[36px] -rotate-3", toneBg[tone])}>
        <Icon size={52} color={tones[tone]} strokeWidth={2} />
      </View>
      <Heading size="lg" className="mt-5 text-center">{title}</Heading>
      {subtitle ? <Text muted className="mt-1 text-center text-base">{subtitle}</Text> : null}
    </View>
  );
}
