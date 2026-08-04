import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenCapture from "expo-screen-capture";

const STORAGE_KEY = "security.preventScreenCapture";

export async function getPreventScreenCaptureSetting(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value === "true";
}

export async function setPreventScreenCaptureSetting(enabled: boolean): Promise<void> {
  if (enabled) {
    await ScreenCapture.preventScreenCaptureAsync();
    // await ScreenCapture.enableAppSwitcherProtectionAsync(0.75);
  } else {
    await ScreenCapture.allowScreenCaptureAsync();
    // await ScreenCapture.disableAppSwitcherProtectionAsync();
  }

  await AsyncStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
}

export async function applyScreenCaptureSetting(): Promise<void> {
  const enabled = await getPreventScreenCaptureSetting();
  if (enabled) {
    await ScreenCapture.preventScreenCaptureAsync();
    await ScreenCapture.enableAppSwitcherProtectionAsync(0.75);
  } else {
    await ScreenCapture.allowScreenCaptureAsync();
    await ScreenCapture.enableAppSwitcherProtectionAsync(0.75);
  }
}
