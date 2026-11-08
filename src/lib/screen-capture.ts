// Setting up the screen capture prevention

import * as ScreenCapture from "expo-screen-capture";
import { Platform } from "react-native";

export async function applyScreenCapturePrevention(enabled: boolean): Promise<void> {
  // iOS is silly and requires an extra setting
  if (enabled) {
    await ScreenCapture.preventScreenCaptureAsync();
    if (Platform.OS === "ios") await ScreenCapture.enableAppSwitcherProtectionAsync(0.75);
  } else {
    await ScreenCapture.allowScreenCaptureAsync();
    if (Platform.OS === "ios") await ScreenCapture.disableAppSwitcherProtectionAsync();
  }
}
