import { cn } from "@/lib/cn";
import { Pressable as RNPressable, PressableProps as RNPressableProps } from "react-native";

export default function Pressable({ className, ...props }: RNPressableProps) {
  return (
    <RNPressable
      className={cn("active:opacity-70", className)}
      android_ripple={{ color: "rgba(0,0,0,0.08)", borderless: false }}
      {...props}
    />
  );
}
