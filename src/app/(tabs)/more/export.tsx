import InfoCard from "@/components/ui/info-card";
import PageHero from "@/components/ui/page-hero";
import Pressable from "@/components/ui/pressable";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { cn } from "@/lib/cn";
import { EXPORT_FORMATS, shareExport, type ExportFormat } from "@/lib/export";
import { Upload } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";

export default function ExportScreen() {
  const [format, setFormat] = useState<ExportFormat>("json");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await shareExport(format);
    } catch {
      Alert.alert("Something went wrong", "Could not export your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen skipTopInset>
      <PageHero icon={Upload} iconColor="#22c55e" tileClassName="bg-green-100 dark:bg-green-950" title="Export" />

      <InfoCard>
        We encourage you to periodically export your data and store it somewhere safe,
        otherwise all your data could be lost if your device gets stolen or you lose it.
      </InfoCard>

      <Text muted className="text-base ml-5 mb-2">
        Format
      </Text>
      <View className="flex-row rounded-full bg-surface p-1">
        {EXPORT_FORMATS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFormat(f.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: format === f.key }}
            className={cn("flex-1 items-center rounded-full py-2", format === f.key && "bg-secondary")}
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
        {loading ? <ActivityIndicator size="small" color="#ffffff" /> : (
          <>
            <Upload size={20} color="#fff" />
            <Text className="text-lg font-semibold text-white">Export</Text>
          </>
        )}
      </Pressable>
    </Screen>
  );
}
