import type { NativeStackNavigationOptions } from "expo-router";
import { Platform } from "react-native";

const isIOS = Platform.OS === "ios";
const isLiquidGlass = isIOS && parseInt(String(Platform.Version), 10) >= 26;

export const stackHeaderOptions = {
  headerShadowVisible: false,
  headerBackButtonDisplayMode: "minimal",
  headerTransparent: isIOS,
  headerBlurEffect: isIOS && !isLiquidGlass ? "systemChromeMaterial" : undefined,
  headerTitleStyle: { fontFamily: "BricolageGrotesque_700Bold", fontSize: 18 },
} satisfies NativeStackNavigationOptions;
