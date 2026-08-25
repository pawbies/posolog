import "@/styles/global.css";
import { Stack } from "expo-router";

export default function ADMELayout() {
  return (
    <Stack>
      <Stack.Screen name="absorption" options={{ title: "Absorption" }} />
      <Stack.Screen name="distribution" options={{ title: "Distribution" }} />
      <Stack.Screen name="metabolism" options={{ title: "Metabolism" }} />
      <Stack.Screen name="excretion" options={{ title: "Excretion" }} />
    </Stack>
  )
}
