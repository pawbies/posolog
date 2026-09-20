import ColorField from "@/components/color-field";
import Footer from "@/components/medication/creation/footer";
import Header from "@/components/medication/creation/header";
import RadioField from "@/components/radio-field";
import TextField from "@/components/text-field";
import { FORM_META, FORMS, ROUTES, useMedicationDraft } from "@/contexts/medication-draft";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function BasicInformationScreen() {
  const router = useRouter();
  const [viewportHeight, setViewportHeight] = useState(0);
  const { draft, update } = useMedicationDraft();

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        onLayout={(e) => setViewportHeight(e.nativeEvent.layout.height)}
      >
        <View style={{ minHeight: viewportHeight }}>
          <Header currentStep={1} />

          <TextField
            icon={FORM_META[draft.form].icon}
            iconColor={draft.color}
            label="Name"
            placeholder="Your medication's name"
            value={draft.name}
            onChangeText={(name) => update({ name })}
          />

          <ColorField
            label="Color"
            value={draft.color}
            onCompleteJS={({ hex }) => update({ color: hex })}
          />

          <RadioField
            label="Form"
            onChange={(form) => update({ form })}
            options={FORMS}
            selected={draft.form}
            colorActive={draft.color}
          />

          <RadioField
            label="Route"
            onChange={(route) => update({ route })}
            options={ROUTES}
            selected={draft.route}
            colorActive={draft.color}
          />

          <TextField
            label="Notes"
            placeholder="Your notes"
            multiline
            value={draft.notes}
            onChangeText={(notes) => update({ notes })}
          />
        </View>

        <Footer
          showBack={false}
          onNext={() => router.push("/medications/creation/ingredients")}
        />
      </ScrollView>
    </View>
  );
}
