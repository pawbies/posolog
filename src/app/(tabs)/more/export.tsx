import Button from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import InfoCard from "@/components/ui/info-card";
import PageHero from "@/components/ui/page-hero";
import Screen from "@/components/ui/screen";
import Segmented from "@/components/ui/segmented";
import { EXPORT_FORMATS, shareExport, type ExportFormat } from "@/lib/export";
import { Upload } from "lucide-react-native";
import { useState } from "react";
import { Alert } from "react-native";

const FORMAT_OPTIONS = EXPORT_FORMATS.map((f) => ({ key: f.key, label: f.name }));

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
    <Screen footer={<Button label="Export" icon={Upload} size="lg" onPress={handleExport} loading={loading} />}>
      <PageHero icon={Upload} tone="mint" title="Export" />

      <InfoCard tone="mint">
        We encourage you to periodically export your data and store it somewhere safe,
        otherwise all your data could be lost if your device gets stolen or you lose it.
      </InfoCard>

      <Heading size="xs" className="mb-2.5 ml-2 text-text-muted">Format</Heading>
      <Segmented options={FORMAT_OPTIONS} value={format} onChange={setFormat} />
    </Screen>
  );
}
