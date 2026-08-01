import "@/styles/global.css";
import { applyStoredScreenCaptureSetting } from "@/lib/screen-capture-setting";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    applyStoredScreenCaptureSetting();
  }, []);

  return (
    <>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
      <StatusBar style="auto" />
    </>
  )
}
