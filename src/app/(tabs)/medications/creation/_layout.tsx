import { Stack } from "expo-router";

export default function MedicationCreationLayout() {
  return (
    <Stack screenOptions={{ animation: "slide_from_right", headerShown: false }}>
      <Stack.Screen name="basic-information" />
      <Stack.Screen name="ingredients" />
      <Stack.Screen name="kinetics" />
    </Stack>
  );
}
