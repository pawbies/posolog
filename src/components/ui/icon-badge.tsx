import { toneBg, type Tone } from "@/constants/colors";
import { usePalette } from "@/hooks/use-palette";
import { cn } from "@/lib/cn";
import { type LucideIcon } from "lucide-react-native";
import { View } from "react-native";

const SIZES = {
  sm: { box: "h-9 w-9 rounded-xl", icon: 18 },
  md: { box: "h-12 w-12 rounded-2xl", icon: 22 },
  lg: { box: "h-16 w-16 rounded-[22px]", icon: 30 },
} as const;

type IconBadgeProps = {
  icon: LucideIcon;
  tone?: Tone;
  /** Custom hex color (e.g. a medication's); overrides the tone. */
  color?: string;
  size?: keyof typeof SIZES;
  /** Use a plain surface fill, for badges sitting on a tinted card. */
  onTint?: boolean;
  className?: string;
};

/** Rounded pastel tile holding an icon. */
export default function IconBadge({ icon: Icon, tone = "mint", color, size = "md", onTint, className }: IconBadgeProps) {
  const { tones } = usePalette();
  const { box, icon } = SIZES[size];

  return (
    <View
      className={cn(
        "items-center justify-center",
        box,
        onTint ? "bg-surface" : !color && toneBg[tone],
        className,
      )}
      style={color && !onTint ? { backgroundColor: `${color}26` } : undefined}
    >
      <Icon size={icon} color={color ?? tones[tone]} strokeWidth={2.25} />
    </View>
  );
}
