import "@/styles/global.css";
import { Stack } from "expo-router";

export default function MechanismLayout() {
  return (
    <Stack>
      <Stack.Screen name="receptor-theory" options={{ title: "Wiki / PD / Mechanism / Receptor theory" }} />
      <Stack.Screen name="agonism-antagonism" options={{ title: "Wiki / PD / Mechanism / Agonism and antagonism" }} />
      <Stack.Screen name="affinity-efficacy" options={{ title: "Wiki / PD / Mechanism / Affinity and efficacy" }} />

    </Stack>
  )
}
