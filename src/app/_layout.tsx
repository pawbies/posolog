import Text from "@/components/ui/text";
import { palette } from "@/constants/colors";
import { SettingsProvider, useSettings } from "@/contexts/settings";
import { db } from "@/db/client";
import migrations from "@/db/migrations/migrations";
import "@/lib/i18n";
import "@/styles/global.css";
import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useFonts } from "expo-font";
import { DarkTheme, DefaultTheme, SplashScreen, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

SplashScreen.preventAutoHideAsync();

const themes = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: palette.light.brand,
      background: palette.light.background,
      card: palette.light.background,
      text: palette.light.text,
      border: palette.light.grid,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: palette.dark.brand,
      background: palette.dark.background,
      card: palette.dark.background,
      text: palette.dark.text,
      border: palette.dark.grid,
    },
  },
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { success, error } = useMigrations(db, migrations);
  // A font failing to load only costs us the display face, so don't block on it.
  const [fontsLoaded, fontError] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });
  const fontsReady = fontsLoaded || !!fontError;

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

  if (!success || !fontsReady) return null;

  return (
    <KeyboardProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === "dark" ? themes.dark : themes.light}>
          <SettingsProvider>
            <RootStack />
          </SettingsProvider>
        </ThemeProvider>
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </KeyboardProvider>
  );
}

function RootStack() {
  const { completedOnboarding } = useSettings();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={completedOnboarding}>
        <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
      </Stack.Protected>
      <Stack.Protected guard={!completedOnboarding}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
      <Stack.Screen name="legal" />
    </Stack>
  );
}
