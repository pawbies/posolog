import { db } from "@/db/client";
import { bloodPressureReadings, medications } from "@/db/schema";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Upload } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExportScreen() {
  const insets = useSafeAreaInsets();
  const [format, setFormat] = useState<"json" | "db">("json");
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
        const allbBloodPressureReadings = db.select().from(bloodPressureReadings).all();
        const allMedications = db.select().from(medications).all();
        const data = {
            bloodPressureReadings: allbBloodPressureReadings,
            medications: allMedications,
        }

        const file = new File(
          Paths.cache,
          `posolog-export-${stamp}.json`
        );
        file.create({overwrite: true});
        file.write(JSON.stringify(data));

        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          UTI: "public.json",
          dialogTitle: "Export data"
        });

      } else if (format == "db") {
        const file = new File(
          Paths.cache,
          `posolog-export-${stamp}.db`
        );
        if (file.exists) file.delete();
        
        const fsPath = decodeURIComponent(file.uri.replace("file://", "")).replace(/'/g, "''");
        const sqlite = db.$client;
        await sqlite.execAsync(`VACUUM INTO '${fsPath}'`);
      
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/vnd.sqlite3",
          UTI: "public.database",
          dialogTitle: "Export data"
        });
      }
    } catch {
      Alert.alert("Something went wrong", "Could not export your data.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        className="px-4"
      >
        <View className="items-center pt-10 pb-8">
          <View className="w-28 h-28 rounded-3xl bg-green-100 dark:bg-green-950 items-center justify-center">
            <Upload size={56} color="#22c55e" />
          </View>
          <Text className="text-3xl font-semibold text-black dark:text-white mt-4 text-center">
            Export
          </Text>
        </View>

        <View className="bg-neutral-100 dark:bg-neutral-900 rounded-2xl p-4 mb-7">
          <Text className="text-base leading-6 text-neutral-600 dark:text-neutral-300">
            We encourage you to periodically export your data and store it somewhere safe,
            otherwise all your data could be lost if your device gets stolen or you lose it.
          </Text>
        </View>

        <Text className="text-base text-neutral-500 dark:text-neutral-400 ml-5 mb-2">
          Format
        </Text>
        <View className="flex-row rounded-full bg-neutral-100 dark:bg-neutral-900 p-1">
          <Pressable
            key={"json"}
            onPress={() => setFormat("json")}
            accessibilityRole="button"
            accessibilityState={{ selected: format === "json" }}
            className={`flex-1 items-center rounded-full py-2 ${
              format === "json" ? "bg-white dark:bg-neutral-700" : ""
            }`}
          >
            <Text className={`text-base
              ${format === "json" ? "font-semibold text-black dark:text-white": "text-neutral-500 dark:text-neutral-400"}`
            }
            >
              JSON
            </Text>
          </Pressable>

          <Pressable
            key={"db"}
            onPress={() => setFormat("db")}
            accessibilityRole="button"
            accessibilityState={{ selected: format === "db" }}
            className={`flex-1 items-center rounded-full py-2 ${
              format === "db" ? "bg-white dark:bg-neutral-700" : ""
            }`}
          >
            <Text className={`text-base
              ${format === "db" ? "font-semibold text-black dark:text-white": "text-neutral-500 dark:text-neutral-400"}`
            }
            >
              Database
            </Text>
          </Pressable>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Export"
          onPress={handleExport}
          disabled={loading}
          className="mt-10 min-h-16 flex-row items-center justify-center gap-2 rounded-full bg-green-600 py-4 dark:bg-green-500"
        >
          {loading ? <ActivityIndicator size="small" color="#ffffff" /> :
            <>
              <Upload size={20} color="#ffffff" />
              <Text className="text-lg font-semibold text-white">Export</Text>
            </>
          }
          
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
}
