import { usePalette } from "@/hooks/use-palette";
import { LucideFont } from "@/lib/lucide-font";
import { VectorIcon } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

const TABS = [
  { name: "index", label: "tabs.home", icon: "house" },
  { name: "timeline", label: "tabs.timeline", icon: "timeline" },
  { name: "medications", label: "tabs.medications", icon: "pill-bottle" },
  { name: "tracking", label: "tabs.tracking", icon: "heart-plus" },
  { name: "more", label: "tabs.more", icon: "ellipsis" },
] as const;

export default function TabsLayout() {
  const { brand, brandIndicator, brandRipple } = usePalette();
  const { t } = useTranslation();

  return (
    <NativeTabs
      tintColor={brand}
      iconColor={brand}
      indicatorColor={brandIndicator}
      rippleColor={brandRipple}
    >
      {TABS.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name}>
          <NativeTabs.Trigger.Label
            hidden={Platform.OS === "ios"}
          >
            {t(tab.label)}
          </NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon
            src={<VectorIcon family={LucideFont} name={tab.icon} />}
            />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
