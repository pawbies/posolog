import Footer from "@/components/medication/creation/footer";
import Header from "@/components/medication/creation/header";
import { useMedicationDraft } from "@/contexts/medication-draft";
import { db } from "@/db/client";
import { medications } from "@/db/schema";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, View } from "react-native";


export default function KineticsScreen() {
  const router = useRouter();
  const { draft, reset } = useMedicationDraft();
  const savingRef = useRef(false);
  const [saving, setSaving] = useState(false);

  const save = async() => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaving(true);

    try {
      await db.insert(medications).values({
        name: draft.name.trim(),
        color: draft.color,
        form: draft.form,
        route: draft.route,
        notes: draft.notes || null,
      });
      reset();
      router.dismissTo("/medications");
    } catch {
      Alert.alert("Error", "Could not save the medication.");
      savingRef.current = false;
      setSaving(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <View className="px-4 flex-1">
        <Header currentStep={3} />

        <View className="flex-1">
        </View>
      </View>

      <Footer
        onBack={() => router.back()}
        onNext={save}
        nextDisabled={saving}
        nextLabel="Finish" />
    </View>
  );
}
