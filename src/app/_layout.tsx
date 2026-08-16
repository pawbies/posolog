import { db } from "@/db/client";
import migrations from "@/db/migrations/migrations";
import "@/lib/i18n";
import { applyScreenCaptureSetting } from "@/lib/settings/security/prevent-screen-capture";
import "@/styles/global.css";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { DarkTheme, DefaultTheme, SplashScreen, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const [settingsReady, setSettingsReady] = useState(false);
  const { success, error: migrationError } = useMigrations(db, migrations);

  useEffect(() => {
    (async () => {
      try {
        await applyScreenCaptureSetting();
      } catch (error) {
        Alert.alert(
          "Screen Capture Setting Error",
          "Failed to apply screen capture setting.",
        );
      } finally {
        setSettingsReady(true);
      }
    })();
  }, []);

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
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  )
}
