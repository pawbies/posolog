import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ScreenCapture from "expo-screen-capture";

const STORAGE_KEY = "security.preventScreenCapture";

export async function getPreventScreenCapture(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value === "true";
}

export async function setPreventScreenCapture(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
  if (enabled) {
    await ScreenCapture.preventScreenCaptureAsync();
  } else {
    await ScreenCapture.allowScreenCaptureAsync();
  }
}

export async function applyStoredScreenCaptureSetting(): Promise<void> {
  const enabled = await getPreventScreenCapture();
  if (enabled) {
    await ScreenCapture.preventScreenCaptureAsync();
  }
}
