import ColorField from "@/components/color-field";
import Footer from "@/components/medication/creation/footer";
import Header from "@/components/medication/creation/header";
import RadioField, { RadioOption } from "@/components/radio-field";
import TextField from "@/components/text-field";
import { useRouter } from "expo-router";
import { ArrowDownToLine, Bandage, Cigarette, CircleSmall, Droplets, Layers2, MoreHorizontal, Pill, Smile, SoapDispenserDroplet, SprayCan, Syringe, Tablets, Wind } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { ScrollView, View } from "react-native";

const FORMS: RadioOption[] = [
  { icon: Pill, name: "Capsule", value: "capsule" },
  { icon: Tablets, name: "Tablet", value: "tablet" },
  { icon: Syringe, name: "Injection", value: "injection" },
  { icon: Bandage, name: "Patch", value: "patch" },
  { icon: Droplets, name: "Gel", value: "gel" },
  { icon: SoapDispenserDroplet, name: "Creme", value: "creme" },
  { icon: SprayCan, name: "Spray", value: "spray" },
  { icon: Cigarette, name: "Inhaler", value: "inhaler" },
  { icon: CircleSmall, name: "Suppository", value: "suppository" },
  { icon: MoreHorizontal, name: "Other", value: "other" },
];

const ROUTES: RadioOption[] = [
  { icon: Pill, name: "Oral", value: "oral" },
  { icon: ArrowDownToLine, name: "Sublingual", value: "sublingual" },
  { icon: Smile, name: "Buccal", value: "buccal" },
  { icon: CircleSmall, name: "Rectal", value: "rectal" },
  { icon: Droplets, name: "IV", value: "iv" },
  { icon: Syringe, name: "IM", value: "im" },
  { icon: Layers2, name: "SC/SQ", value: "scsq" },
  { icon: Bandage, name: "Transdermal", value: "transdermal" },
  { icon: Wind, name: "Inhaled", value: "inhaled" },
  { icon: SprayCan, name: "Nasal", value: "nasal" },
  { icon: MoreHorizontal, name: "Other", value: "other" },
];

export default function BasicInformationScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const defaultColor = colorScheme === "dark" ? "#49a6b2" : "#1682ad";

  const [name, setName] = useState<string | undefined>(undefined);
  const [color, setColor] = useState(defaultColor);
  const [form, setForm] = useState<RadioOption>(FORMS[0]);
  const [route, setRoute] = useState<RadioOption>(ROUTES[0]);
  const [viewportHeight, setViewportHeight] = useState(0);

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
            icon={form.icon}
            iconColor={color}
            label="Name"
            placeholder="Your medication's name"
            value={name}
            onChangeText={setName}
          />

          <ColorField
            label="Color"
            value={color}
            onCompleteJS={({ hex }) => setColor(hex)}
          />

          <RadioField
            label="Form"
            onChange={setForm}
            options={FORMS}
            selected={form}
            colorActive={color}
          />

          <RadioField
            label="Route"
            onChange={setRoute}
            options={ROUTES}
            selected={route}
            colorActive={color}
          />

          <TextField
            label="Notes"
            placeholder="Your notes"
            multiline
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
