import { Image } from "@/components/ui/image";
import { cn } from "@/lib/cn";

type MascotProps = {
  /** "full" is the perched toucan, "head" the app icon's portrait. */
  variant?: "full" | "head";
  className?: string;
};

const SOURCES = {
  full: require("@/assets/images/tucan.png"),
  head: require("@/assets/images/android-icon-foreground.png"),
};

/** posolog's toucan. Decorative, so it's hidden from screen readers. */
export default function Mascot({ variant = "full", className }: MascotProps) {
  return (
    <Image
      source={SOURCES[variant]}
      contentFit="contain"
      accessible={false}
      className={cn(variant === "full" ? "h-32 w-24" : "h-16 w-16", className)}
    />
  );
}
