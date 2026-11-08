import { useNavigation, useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { useRef } from "react";
import { Alert } from "react-native";

type Prompt = { title: string; message: string };

// This prevents the user from leaving a screen with unfinished changes on accident
export function useUnsavedChanges(dirty: boolean, { title, message }: Prompt) {
  const router = useRouter();
  const navigation = useNavigation();
  const leaving = useRef(false);

  usePreventRemove(dirty, ({ data }) => {
    if (leaving.current) {
      navigation.dispatch(data.action);
      return;
    }
    Alert.alert(title, message, [
      { text: "Keep editing", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: () => navigation.dispatch(data.action) },
    ]);
  });

  return () => {
    leaving.current = true;
    router.back();
  };
}
