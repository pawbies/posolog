import Text from "@/components/ui/text";
import { SettingsProvider, useSettings } from "@/contexts/settings";
import { db } from "@/db/client";
import migrations from "@/db/migrations/migrations";
import "@/lib/i18n";
import "@/styles/global.css";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { DarkTheme, DefaultTheme, SplashScreen, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (error) SplashScreen.hideAsync();
  }, [error]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="text-center">Database migration failed: {error.message}</Text>
      </View>
    );
  }

  if (!success) return null;

  return (
    <KeyboardProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <SettingsProvider>
            <RootStack />
          </SettingsProvider>
        </ThemeProvider>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}

// Only mounts once migrations ran and settings are loaded, so the app is ready to show.
function RootStack() {
  const { completedOnboarding } = useSettings();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={completedOnboarding}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!completedOnboarding}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Screen name="legal" />
    </Stack>
  );
}
