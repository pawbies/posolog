import { applyScreenCaptureSetting } from "@/lib/screen-capture-setting";
import "@/styles/global.css";
import { DarkTheme, DefaultTheme, SplashScreen, Stack, ThemeProvider } from "expo-router";
import * as ScreenCapture from "expo-screen-capture";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await applyScreenCaptureSetting();
      } catch (error) {
        console.warn("Failed to apply screen capture setting", error);
        try {
          await ScreenCapture.preventScreenCaptureAsync();
        } catch {
          Alert.alert(
            "Screen Capture Setting Error",
            "Failed to apply screen capture setting.",
          );
        }
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    })();
  }, []);

  if (!ready) return null;

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
