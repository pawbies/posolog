import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Upload } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ExportScreen() {
  const insets = useSafeAreaInsets();
  const [format, setFormat] = useState<"csv" | "db">("csv");
  const [loading, setLoading] = useState<boolean>(false);

  const handleExport = async () => {
    setLoading(true);

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert("Error", "Could not export file");
      setLoading(false);
      return;
    }

    const file = new File(Paths.cache, "posolog-export.csv");
    file.create({overwrite: true});
    file.write("Hello World! Bleh!");
    
    await Sharing.shareAsync(file.uri, {
      mimeType: "text/csv",
      UTI: "public.comma-seperated-values-text",
      dialogTitle: "Export data"
    });

    setLoading(false);
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
            We encourage you to periodically export your data and safe it somewhere safe,
            otherwise all your data could be lost if your device gets stolen or you lose it.
          </Text>
        </View>

        <Text className="text-base text-neutral-500 dark:text-neutral-400 ml-5 mb-2">
          Format
        </Text>
        <View className="flex-row rounded-full bg-neutral-100 dark:bg-neutral-900 p-1">
          <Pressable
            key={"csv"}
            onPress={() => setFormat("csv")}
            accessibilityRole="button"
            accessibilityState={{ selected: format === "csv" }}
            className={`flex-1 items-center rounded-full py-2 ${
              format === "csv" ? "bg-white dark:bg-neutral-700" : ""
            }`}
          >
            <Text className={`text-base
              ${format === "csv" ? "font-semibold text-black dark:text-white": "text-neutral-500 dark:text-neutral-400"}`
            }
            >
              CSV
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
          className="mt-10 flex-row items-center justify-center gap-2 rounded-full bg-green-600 py-4 dark:bg-green-500"
        >
          <Upload size={20} color="#ffffff" />
          <Text className="text-lg font-semibold text-white">Export</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
}
