import Pressable from "@/components/ui/pressable";
import { toneBg, type Tone } from "@/constants/colors";
import { cn } from "@/lib/cn";
import { View, type PressableProps, type ViewProps } from "react-native";

type CardProps = ViewProps & {
  /** Pastel fill. Without one the card is a bordered surface. */
  tone?: Tone;
  onPress?: PressableProps["onPress"];
  accessibilityLabel?: string;
};

export const cardClass = (tone?: Tone) =>
  cn("rounded-[28px] p-5 overflow-hidden", tone ? toneBg[tone] : "bg-surface border-2 border-border");

export default function Card({ tone, onPress, className, ...props }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        className={cn(cardClass(tone), "active:scale-[0.98]", className)}
        {...props}
      />
    );
  }
  return <View className={cn(cardClass(tone), className)} {...props} />;
}
