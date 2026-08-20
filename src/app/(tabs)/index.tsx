import { useTranslation } from "react-i18next";
import { ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-black relative"
      contentContainerStyle={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Text>Hello</Text>
    </ScrollView>
  );
}
