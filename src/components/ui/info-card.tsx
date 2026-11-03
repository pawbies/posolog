import Text from "@/components/ui/text";
import { toneBg, type Tone } from "@/constants/colors";
import { cn } from "@/lib/cn";
import { View } from "react-native";

/** Muted paragraph on a pastel card, used for page intros. */
export default function InfoCard({ children, tone = "cream" }: { children: string; tone?: Tone }) {
  return (
    <View className={cn("mb-7 rounded-[24px] p-5", toneBg[tone])}>
      <Text className="text-base leading-6 opacity-80">{children}</Text>
    </View>
  );
}
