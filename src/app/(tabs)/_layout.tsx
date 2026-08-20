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
                <NativeTabs.Trigger.Icon 
                    sf={{ default: "house", selected: "house.fill" }}
                    md="home"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="timeline">
                <NativeTabs.Trigger.Label>{t("tabs.timeline")}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "clock", selected: "clock.fill" }}
                    md="timeline"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="medications">
                <NativeTabs.Trigger.Label>{t("tabs.medications")}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "pills", selected: "pills.fill" }}
                    md="medication"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="tracking">
                <NativeTabs.Trigger.Label>{t("tabs.tracking")}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "heart", selected: "heart.fill" }}
                    md="heart_plus"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="more">
                <NativeTabs.Trigger.Label>{t("tabs.more")}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "ellipsis", selected: "ellipsis.circle" }}
                    md="more_horiz"
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}