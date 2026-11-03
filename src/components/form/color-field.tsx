import FieldLabel from "@/components/form/field-label";
import { View } from "react-native";
import ColorPicker, { ColorPickerProps, HueSlider, Panel1, Preview, Swatches } from "reanimated-color-picker";

type FieldProps = ColorPickerProps & {
  label: string;
};

// Friendly presets that read well on both light and dark backgrounds.
const SWATCHES = ["#47b35a", "#3c8af3", "#f0663f", "#e5487a", "#7c5ce6", "#e09b12", "#14a3a3", "#8a6a4f"];

export default function ColorField({ label, ...props }: FieldProps) {
  return (
    <View className="mb-5">
      <FieldLabel>{label}</FieldLabel>
      <View className="rounded-[24px] border-2 border-border bg-surface p-3">
        <ColorPicker
          sliderThickness={22}
          thumbSize={24}
          thumbShape="circle"
          style={{ gap: 14 }}
          boundedThumb
          {...props}
        >
          <Swatches
            colors={SWATCHES}
            style={{ justifyContent: "space-between" }}
            swatchStyle={{ width: 30, height: 30, borderRadius: 15, marginHorizontal: 0, marginVertical: 0 }}
          />
          <Panel1 style={{ height: 120, borderRadius: 16 }} />
          <HueSlider style={{ borderRadius: 11 }} />
          <Preview hideInitialColor textStyle={{ fontSize: 13, fontWeight: "600" }} style={{ height: 36, borderRadius: 12 }} />
        </ColorPicker>
      </View>
    </View>
  );
}
