import "@/styles/global.css";
import { Stack } from "expo-router";

export default function MedicationsLayout() {
  return (
    <Stack screenOptions={{ animation: "default" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}
