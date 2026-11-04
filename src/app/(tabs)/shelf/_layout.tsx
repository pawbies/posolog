import { stackHeaderOptions } from "@/constants/navigation";
import { Stack } from "expo-router";

export default function ShelfLayout() {
  return (
    <Stack screenOptions={{ ...stackHeaderOptions, animation: "default" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="medications/new" options={{ title: "New medication" }} />
      <Stack.Screen name="ingredients/new" options={{ title: "New ingredient" }} />

      <Stack.Screen name="medications/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="ingredients/[id]/index" options={{ title: "Ingredient" }} />
    </Stack>
  );
}
