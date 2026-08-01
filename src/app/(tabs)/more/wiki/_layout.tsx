import "@/styles/global.css";
import { Stack } from "expo-router";

export default function WikiLayout() {
  return (
    <Stack screenOptions={{ animation: "default" }}>
      <Stack.Screen name="index" options={{ title: "Wiki" }} />
      <Stack.Screen name="core-concepts" options={{ title: "Wiki / Core concepts" }} />
      <Stack.Screen name="common-terminology" options={{ title: "Wiki / Common terminology" }} />

      <Stack.Screen name="pk/adme" options={{ headerShown: false }} />
    </Stack>
  )
}
