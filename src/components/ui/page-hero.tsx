import Text from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { type LucideIcon } from "lucide-react-native";
import { View } from "react-native";

type PageHeroProps = {
  icon: LucideIcon;
  iconColor: string;
  /** Background classes for the icon tile, e.g. "bg-blue-100 dark:bg-blue-950". */
  tileClassName: string;
  title: string;
  subtitle?: string;
};

export default function PageHero({ icon: Icon, iconColor, tileClassName, title, subtitle }: PageHeroProps) {
  return (
    <View className="items-center pt-10 pb-8">
      <View className={cn("w-28 h-28 rounded-3xl items-center justify-center", tileClassName)}>
        <Icon size={56} color={iconColor} />
      </View>
      <Text className="text-3xl font-semibold mt-4 text-center">{title}</Text>
      {subtitle ? <Text muted className="text-sm mt-1">{subtitle}</Text> : null}
    </View>
  );
}
