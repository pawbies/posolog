import { Stack, useNavigation } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { Alert } from "react-native";

export default function MedicationCreationLayout() {
  const navigation = useNavigation();

  usePreventRemove(true, ({ data }) => {
    Alert.alert("Discard medication?", "Your progress will be lost.", [
      { text: "Keep editing", style: "cancel" },
      {
        text: "Discard",
        style: "destructive",
        onPress: () => navigation.dispatch(data.action),
      },
    ]);
  });

  return (
    <Stack screenOptions={{ animation: "slide_from_right", headerShown: false }}>
      <Stack.Screen name="basic-information" />
      <Stack.Screen name="ingredients" />
      <Stack.Screen name="kinetics" />
    </Stack>
  );
}
