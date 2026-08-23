import { cn } from "@/lib/cn";
import { Text as RNText, TextProps as RNTextProps } from "react-native";

type TextProps = RNTextProps & {
  muted?: boolean;
}

export default function Text({muted = false, className, ...props}: TextProps) {
  return (
    <RNText
      className={cn(muted ? "text-text-muted" : "text-text", className)}
      {...props}
    />
  )
}
