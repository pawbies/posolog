import { Stack } from "expo-router";

export default function LegalLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal" }}>
      <Stack.Screen name="privacy-policy" options={{ title: "Privacy Policy" }} />
      <Stack.Screen name="terms-of-service" options={{ title: "Terms of Service" }} />
    </Stack>
  );
}
