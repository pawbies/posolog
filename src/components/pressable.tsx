import { cn } from "@/lib/cn";
import { Pressable as RNPressable, PressableProps as RNPressableProps } from "react-native";

export default function Pressable({className, ...props}: RNPressableProps) {
  return (
    <RNPressable
      className={cn("active:opacity-60", className)}
      android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: false }}
      {...props}
    />
  )
}
