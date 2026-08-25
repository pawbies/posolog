import "@/styles/global.css";
import { Stack } from "expo-router";

export default function WikiLayout() {
  return (
    <Stack screenOptions={{ animation: "default" }}>
      <Stack.Screen name="index" options={{ title: "Wiki" }} />
      <Stack.Screen name="core-concepts" options={{ title: "Core concepts" }} />
      <Stack.Screen name="common-terminology" options={{ title: "Common terminology" }} />

      <Stack.Screen name="pk/adme" options={{ headerShown: false }} />
      <Stack.Screen name="pk/ms" options={{ headerShown: false }} />

      <Stack.Screen name="pd/mechanism" options={{ headerShown: false }} />
      <Stack.Screen name="pd/quantitative-response" options={{ headerShown: false }} />
    </Stack>
  )
}
