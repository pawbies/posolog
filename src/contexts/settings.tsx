import { applyScreenCapturePrevention } from "@/lib/screen-capture";
import { DEFAULT_SETTINGS, loadSettings, saveSetting, type Settings } from "@/lib/settings";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Alert } from "react-native";

type SettingsValue = Settings & {
  setSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => Promise<void>;
};

const SettingsContext = createContext<SettingsValue | null>(null);

/** Loads persisted settings and applies their side effects. Renders nothing until they're ready. */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    (async () => {
      const loaded = await loadSettings().catch(() => DEFAULT_SETTINGS);
      try {
        await applyScreenCapturePrevention(loaded.preventScreenCapture);
      } catch {
        Alert.alert("Screen Capture Setting Error", "Failed to apply screen capture setting.");
      }
      setSettings(loaded);
    })();
  }, []);

  const setSetting = async <K extends keyof Settings>(key: K, value: Settings[K]) => {
    if (key === "preventScreenCapture") await applyScreenCapturePrevention(value);
    await saveSetting(key, value);
    setSettings((s) => s && { ...s, [key]: value });
  };

  if (!settings) return null;

  return (
    <SettingsContext.Provider value={{ ...settings, setSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
