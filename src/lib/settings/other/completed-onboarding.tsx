import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "other.completedOnboarding";

export async function getCompletedOnboardingSetting(): Promise<boolean> {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value === "true";
}

export async function setCompletedOnboardingSetting(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
}
