import Pressable from "@/components/pressable";
import Text from "@/components/text";
import { exportDb, exportJson } from "@/lib/transfers/export";
import * as Sharing from "expo-sharing";
import { Upload } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

const FORMATS = [
  { name: "JSON", key: "json" },
  { name: "Database", key: "db" }
] as const;

type Format = (typeof FORMATS)[number]["key"];

export default function ExportScreen() {
  const [format, setFormat] = useState<Format>("json");
  const [loading, setLoading] = useState<boolean>(false);

  const handleExport = async () => {
    setLoading(true);

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Error", "Could not export file");
      setLoading(false);
      return;
    }

    const stamp = new Date().toISOString().slice(0, 10);

    try {
      if (format == "json") {
        const file = exportJson(`posolog-export-${stamp}.json`);

        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          UTI: "public.json",
          dialogTitle: "Export data"
        });

        if (file.exists) file.delete
      } else if (format == "db") {
        const file = await exportDb(`posolog-export-${stamp}.db`);
      
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/vnd.sqlite3",
          UTI: "public.database",
          dialogTitle: "Export data"
        });

        if (file.exists) file.delete
      }
    } catch {
      Alert.alert("Something went wrong", "Could not export your data.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView className="px-4 flex-1 bg-background" >
      <View className="items-center pt-10 pb-8">
        <View className="w-28 h-28 rounded-3xl bg-green-100 dark:bg-green-950 items-center justify-center">
          <Upload size={56} color="#22c55e" />
        </View>
        <Text className="text-3xl font-semibold mt-4 text-center">
          Export
        </Text>
      </View>

      <View className="bg-surface rounded-2xl p-4 mb-7">
        <Text muted className="text-base leading-6">
          We encourage you to periodically export your data and store it somewhere safe,
          otherwise all your data could be lost if your device gets stolen or you lose it.
        </Text>
      </View>

      <Text muted className="text-base ml-5 mb-2">
        Format
      </Text>
      <View className="flex-row rounded-full bg-surface p-1">
        {FORMATS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFormat(f.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: format === f.key }}
            className={`flex-1 items-center rounded-full py-2 ${ format === f.key ? "bg-secondary" : "" }`}
          >
            <Text muted={format === f.key} className="text-base">
              {f.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Export"
        onPress={handleExport}
        disabled={loading}
        className="mt-14 min-h-16 flex-row items-center justify-center gap-2 rounded-full bg-primary"
      >
        {loading ? <ActivityIndicator size="small" color="#ffffff" /> :
          <>
            <Upload size={20} color="#fff" />
            <Text className="text-lg font-semibold text-white">Export</Text>
          </>
        }
      </Pressable>
    </ScrollView>
  );
}
