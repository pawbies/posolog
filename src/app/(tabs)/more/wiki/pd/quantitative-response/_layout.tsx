import "@/styles/global.css";
import { Stack } from "expo-router";

export default function QuantitativeResponseLayout() {
  return (
    <Stack>
      <Stack.Screen name="emax-hill-models" options={{ title: "Wiki / PD / Quantitative response / Emax and Hill models" }} />
      <Stack.Screen name="potency-vs-efficacy" options={{ title: "Wiki / PD / Quantitative response / Potency vs. efficacy" }} />
      <Stack.Screen name="therapeutic-window" options={{ title: "Wiki / PD / Quantitative response / Therapeutic window" }} />
      <Stack.Screen name="effect-delay" options={{ title: "Wiki / PD / Quantitative response / Effect delay" }} />
      <Stack.Screen name="tolerance" options={{ title: "Wiki / PD / Quantitative response / Tolerance" }} />

    </Stack>
  )
}
