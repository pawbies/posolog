import "@/styles/global.css";
import { Stack } from "expo-router";

export default function MechanismLayout() {
  return (
    <Stack>
      <Stack.Screen name="receptor-theory" options={{ title: "Receptor theory" }} />
      <Stack.Screen name="agonism-antagonism" options={{ title: "Agonism and antagonism" }} />
      <Stack.Screen name="affinity-efficacy" options={{ title: "Affinity and efficacy" }} />

    </Stack>
  )
}
