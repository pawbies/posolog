import "@/styles/global.css";
import { Stack } from "expo-router";

export default function MSLayout() {
  return (
    <Stack>
      <Stack.Screen name="compartment-modeling" options={{ title: "Compartment modeling" }} />
      <Stack.Screen name="non-compartment-analysis" options={{ title: "Non-compartment analysis" }} />
      <Stack.Screen name="pbpk" options={{ title: "PBPK" }} />
      <Stack.Screen name="pop-pk" options={{ title: "popPK" }} />
      <Stack.Screen name="linear-nonlinear-kinetics" options={{ title: "Linear vs. nonlinear kinetics" }} />
      <Stack.Screen name="multiple-dose-kinetics" options={{ title: "Multiple-dose kinetics" }} />

    </Stack>
  )
}
