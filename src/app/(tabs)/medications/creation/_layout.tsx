import { Stack } from "expo-router";

export default function MedicationCreationLayout() {
  return (
    <Stack screenOptions={{ animation: "slide_from_right", title: "New medication" }}>
      <Stack.Screen name="basic-information" />
      <Stack.Screen name="ingredients" />
      <Stack.Screen name="kinetics" />
    </Stack>
  );
}
