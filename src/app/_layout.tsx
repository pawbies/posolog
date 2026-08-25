import { OnboardingProvider } from "@/contexts/onboarding";
import { db } from "@/db/client";
import migrations from "@/db/migrations/migrations";
import "@/lib/i18n";
import { getCompletedOnboardingSetting, setCompletedOnboardingSetting } from "@/lib/settings/other/completed-onboarding";
import { applyScreenCaptureSetting } from "@/lib/settings/security/prevent-screen-capture";
import "@/styles/global.css";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { DarkTheme, DefaultTheme, SplashScreen, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [settingsReady, setSettingsReady] = useState(false);
  const { success, error: migrationError } = useMigrations(db, migrations);
  const [completedOnboardingState, setCompletedOnboardingState] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await applyScreenCaptureSetting();
      } catch (error) {
        Alert.alert(
          "Screen Capture Setting Error",
          "Failed to apply screen capture setting.",
        );
      }

      try {
        setCompletedOnboardingState(await getCompletedOnboardingSetting());
      } catch {
        setCompletedOnboardingState(false);
      } finally {
        setSettingsReady(true);
      }
    })();
  }, []);

  const setCompletedOnboarding = useCallback(async (completed: boolean) => {
    await setCompletedOnboardingSetting(completed);
    setCompletedOnboardingState(completed);
  }, []);

  const onboarding = useMemo(
    () => ({ completedOnboarding: completedOnboardingState, setCompletedOnboarding }),
    [completedOnboardingState, setCompletedOnboarding]
  );

  const ready = settingsReady && success;

  useEffect(() => {
    if (ready || migrationError) SplashScreen.hideAsync();
  }, [ready, migrationError]);

  if (migrationError) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-black px-6">
        <Text className="text-black dark:text-white text-center">
          Database migration failed: {migrationError.message}
        </Text>
      </View>
    );
  }

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <OnboardingProvider value={onboarding}>
          <Stack>
            <Stack.Protected guard={completedOnboardingState}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={!completedOnboardingState}>
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Screen name="legal" options={{ headerShown: false }} />
          </Stack>
        </OnboardingProvider>
      </ThemeProvider>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  )
}
