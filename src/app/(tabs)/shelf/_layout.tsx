import { stackHeaderOptions } from "@/constants/navigation";
import { Stack } from "expo-router";

export default function ShelfLayout() {
  return (
    <Stack screenOptions={{ ...stackHeaderOptions, animation: "default" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen name="medications/new" options={{ title: "New medication" }} />
      <Stack.Screen name="medications/[id]/index" options={{ title: "" }} />
      <Stack.Screen name="medications/[id]/info" options={{ title: "Reference sheet" }} />
      <Stack.Screen name="medications/[id]/edit" options={{ title: "Edit medication" }} />
      <Stack.Screen name="medications/[id]/strengths/index" options={{ title: "Strengths" }} />
      <Stack.Screen name="medications/[id]/strengths/new" options={{ title: "Add strength" }} />
      <Stack.Screen name="medications/[id]/strengths/edit" options={{ title: "Edit strength" }} />

      <Stack.Screen name="ingredients/new" options={{ title: "New ingredient" }} />
      <Stack.Screen name="ingredients/[id]/index" options={{ title: "" }} />
      <Stack.Screen name="ingredients/[id]/edit" options={{ title: "Edit ingredient" }} />
    </Stack>
  );
}
