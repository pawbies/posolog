import Footer from "@/components/medication/creation/footer";
import Header from "@/components/medication/creation/header";
import MedicationFields from "@/components/medication/medication-fields";
import { useMedicationDraft } from "@/contexts/medication-draft";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";

export default function BasicInformationScreen() {
  const router = useRouter();
  const { draft, update } = useMedicationDraft();

  return (
    <View className="flex-1 bg-background">
      {/* flexGrow + flex-1 fields: the footer sits at the bottom when the form is short and follows it when it's long */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-4 grow"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1">
          <Header currentStep={1} />
          <MedicationFields value={draft} onChange={update} />
        </View>

        <Footer
          showBack={false}
          nextDisabled={!draft.name.trim()}
          onNext={() => router.push("/medications/creation/ingredients")}
        />
      </ScrollView>
    </View>
  );
}
