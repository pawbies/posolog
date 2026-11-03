import { stackHeaderOptions } from "@/constants/navigation";
import { Stack } from "expo-router";

export default function TrackingLayout() {
  return (
    <Stack screenOptions={{ ...stackHeaderOptions, animation: "default" }}>
      <Stack.Screen name="index" options={{ title: "Tracking", headerShown: false }} />
      <Stack.Screen name="blood-pressure" options={{ title: "Blood Pressure" }} />
    </Stack>
  )
}
