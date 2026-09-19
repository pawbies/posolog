import Text from "@/components/text";
import { View } from "react-native";
import ColorPicker, { ColorPickerProps, HueSlider, Panel1, Preview } from "reanimated-color-picker";

type FieldProps = ColorPickerProps & {
  label: string;
};

export default function ColorField({ label, ...props }: FieldProps) {
  return (
    <View className="mb-4">
      <Text muted className="text-xs font-semibold mb-1.5">
        {label}
      </Text>
      <View className="rounded-xl bg-surface border border-border p-2">
        <ColorPicker
          sliderThickness={20}
          thumbSize={20}
          thumbShape="circle"
          style={{ gap: 12 }}
          boundedThumb
          {...props}
        >
          <Preview hideInitialColor textStyle={{ fontSize: 13 }} style={{ height: 36 }} />
          <Panel1 style={{ height: 120, borderRadius: 12 }} />
          <HueSlider style={{ borderRadius: 10 }} />
        </ColorPicker>
      </View>
    </View>
  );
}
