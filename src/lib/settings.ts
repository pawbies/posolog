import AsyncStorage from "@react-native-async-storage/async-storage";

export type Settings = {
  completedOnboarding: boolean;
  preventScreenCapture: boolean;
};

const STORAGE_KEYS: Record<keyof Settings, string> = {
  completedOnboarding: "other.completedOnboarding",
  preventScreenCapture: "security.preventScreenCapture",
};

export const DEFAULT_SETTINGS: Settings = {
  completedOnboarding: false,
  preventScreenCapture: false,
};

export async function loadSettings(): Promise<Settings> {
  const entries = await AsyncStorage.multiGet(Object.values(STORAGE_KEYS));
  const stored = new Map(entries);
  const settings = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(STORAGE_KEYS) as (keyof Settings)[]) {
    const value = stored.get(STORAGE_KEYS[key]);
    if (value != null) settings[key] = value === "true";
  }
  return settings;
}

export async function saveSetting<K extends keyof Settings>(key: K, value: Settings[K]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS[key], String(value));
}
