import "@/styles/global.css";
import { Stack } from "expo-router";

export default function MSLayout() {
  return (
    <Stack>
      <Stack.Screen name="compartment-modeling" options={{ title: "Wiki / PK / M&S / Compartment modeling" }} />
      <Stack.Screen name="non-compartment-analysis" options={{ title: "Wiki / PK / M&S / Non-compartment analysis" }} />
      <Stack.Screen name="pbpk" options={{ title: "Wiki / PK / M&S / PBPK" }} />
      <Stack.Screen name="pop-pk" options={{ title: "Wiki / PK / M&S / popPK" }} />
      <Stack.Screen name="linear-nonlinear-kinetics" options={{ title: "Wiki / PK / M&S / Linear vs. nonlinear kinetics" }} />
      <Stack.Screen name="multiple-dose-kinetics" options={{ title: "Wiki / PK / M&S / Multiple-dose kinetics" }} />

    </Stack>
  )
}
