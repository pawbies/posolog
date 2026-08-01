import "@/styles/global.css";
import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ animation: "default" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="calculator" options={{ title: "Calculator" }} />
      <Stack.Screen name="statistics" options={{ title: "Statistics" }} />
      <Stack.Screen name="import" options={{ title: "Import" }} />
      <Stack.Screen name="export" options={{ title: "Export" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="wiki" options={{ title: "Wiki" }} />
      <Stack.Screen name="donate" options={{ title: "Donate" }} />
      <Stack.Screen name="about" options={{ title: "About" }} />
    </Stack>
  )
}
