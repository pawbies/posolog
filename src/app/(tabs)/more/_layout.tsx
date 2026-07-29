import "@/styles/global.css";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { useColorScheme } from "nativewind";

export default function MoreLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ animation: "default" }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="calculator" options={{ title: "Calculator" }} />
        <Stack.Screen name="statistics" options={{ title: "Statistics" }} />
        <Stack.Screen name="import" options={{ title: "Import" }} />
        <Stack.Screen name="export" options={{ title: "Export" }} />
        <Stack.Screen name="settings" options={{ title: "Settings" }} />
        <Stack.Screen name="wiki" options={{ title: "Wiki" }} />
        <Stack.Screen name="donate" options={{ title: "Donate" }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
      </Stack>
    </ThemeProvider>
  )
}
