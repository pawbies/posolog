import Pressable from "@/components/ui/pressable";
import { usePalette } from "@/hooks/use-palette";
import { cn } from "@/lib/cn";
import { type LucideIcon } from "lucide-react-native";
import { ActivityIndicator, Text } from "react-native";

type Variant = "primary" | "secondary" | "danger";

type ButtonProps = {
  label: string;
  onPress?: () => void;
  icon?: LucideIcon;
  variant?: Variant;
  /** Custom hex color for a tinted button, e.g. a medication's. Overrides the variant. */
  color?: string;
  loading?: boolean;
  disabled?: boolean;
  size?: "md" | "lg";
  className?: string;
  accessibilityLabel?: string;
};

const VARIANTS: Record<Variant, { box: string; text: string }> = {
  primary: { box: "bg-primary", text: "text-on-primary" },
  secondary: { box: "bg-surface border-2 border-border", text: "text-text" },
  danger: { box: "bg-error/10", text: "text-error" },
};

/** Pill button with a chunky label. */
export default function Button({
  label,
  onPress,
  icon: Icon,
  variant = "primary",
  color,
  loading = false,
  disabled = false,
  size = "md",
  className,
  accessibilityLabel,
}: ButtonProps) {
  const { onBrand, text, danger } = usePalette();
  const styles = VARIANTS[variant];
  const fg = color ?? (variant === "primary" ? onBrand : variant === "danger" ? danger : text);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      className={cn(
        "flex-row items-center justify-center gap-2 rounded-full px-6 active:scale-[0.98]",
        size === "lg" ? "min-h-16" : "min-h-14",
        !color && styles.box,
        disabled && "opacity-40",
        className,
      )}
      style={color ? { backgroundColor: `${color}22` } : undefined}
    >
      {loading ? (
        <ActivityIndicator size="small" color={fg} />
      ) : (
        <>
          {Icon ? <Icon size={size === "lg" ? 22 : 19} color={fg} strokeWidth={2.5} /> : null}
          <Text
            numberOfLines={1}
            className={cn("font-display-bold", size === "lg" ? "text-xl" : "text-[17px]", !color && styles.text)}
            style={color ? { color } : undefined}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
