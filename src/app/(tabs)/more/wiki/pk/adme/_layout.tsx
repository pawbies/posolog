import "@/styles/global.css";
import { Stack } from "expo-router";

export default function ADMELayout() {
  return (
    <Stack>
      <Stack.Screen name="absorption" options={{ title: "Wiki / PK / ADME / Absorption" }} />
      <Stack.Screen name="distribution" options={{ title: "Wiki / PK / ADME / Distribution" }} />
      <Stack.Screen name="metabolism" options={{ title: "Wiki / PK / ADME / Metabolism" }} />
      <Stack.Screen name="excretion" options={{ title: "Wiki / PK / ADME / Excretion" }} />
    </Stack>
  )
}
