import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function TabsLayout() {
    return (
        <NativeTabs>
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon 
                    sf={{ default: "house", selected: "house.fill" }}
                    md="home"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="timeline">
                <NativeTabs.Trigger.Label>Timeline</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "clock", selected: "clock.fill" }}
                    md="timeline"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="medications">
                <NativeTabs.Trigger.Label>Medications</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "pills", selected: "pills.fill" }}
                    md="medication"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="tracking">
                <NativeTabs.Trigger.Label>Tracking</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "heart", selected: "heart.fill" }}
                    md="heart_plus"
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="more">
                <NativeTabs.Trigger.Label>More</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    sf={{ default: "ellipsis", selected: "ellipsis.circle" }}
                    md="more_horiz"
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}