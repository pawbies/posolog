import "@/styles/global.css";
import { Stack } from "expo-router";

export default function QuantitativeResponseLayout() {
  return (
    <Stack>
      <Stack.Screen name="emax-hill-models" options={{ title: "Emax and Hill models" }} />
      <Stack.Screen name="potency-vs-efficacy" options={{ title: "Potency vs. efficacy" }} />
      <Stack.Screen name="therapeutic-window" options={{ title: "Therapeutic window" }} />
      <Stack.Screen name="effect-delay" options={{ title: "Effect delay" }} />
      <Stack.Screen name="tolerance" options={{ title: "Tolerance" }} />

    </Stack>
  )
}
