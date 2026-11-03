import { cn } from "@/lib/cn";
import { Text as RNText, type TextProps } from "react-native";

const SIZES = {
  xl: "font-display text-[38px] leading-[42px]",
  lg: "font-display text-[30px] leading-[34px]",
  md: "font-display-bold text-[22px] leading-[27px]",
  sm: "font-display-bold text-lg leading-6",
  xs: "font-display-medium text-base leading-5",
} as const;

type HeadingProps = TextProps & {
  size?: keyof typeof SIZES;
};

/** Chunky display-font heading. Uses the font's own weight, so don't add font-bold. */
export default function Heading({ size = "md", className, ...props }: HeadingProps) {
  return (
    <RNText
      accessibilityRole="header"
      className={cn("text-text tracking-tight", SIZES[size], className)}
      {...props}
    />
  );
}
