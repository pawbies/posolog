import { LucideFont } from "@/lib/lucide-font";
import { VectorIcon } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";

const GREEN = "#aade87";
const GREEN_DARK = "#56972b";

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { t } = useTranslation();

  return (
    <NativeTabs
      tintColor={isDark ? GREEN : GREEN_DARK}
      indicatorColor={isDark ? "#2f4a1e" : GREEN}
      rippleColor={isDark ? "#aade8740" : "#56972b40"}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>{t("tabs.home")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={<VectorIcon family={LucideFont} name="house" />} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="timeline">
        <NativeTabs.Trigger.Label>{t("tabs.timeline")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={<VectorIcon family={LucideFont} name="timeline" />} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="medications">
        <NativeTabs.Trigger.Label>{t("tabs.medications")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={<VectorIcon family={LucideFont} name="pill-bottle" />} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="tracking">
        <NativeTabs.Trigger.Label>{t("tabs.tracking")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={<VectorIcon family={LucideFont} name="heart-plus" />} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="more">
        <NativeTabs.Trigger.Label>{t("tabs.more")}</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon src={<VectorIcon family={LucideFont} name="ellipsis" />} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
