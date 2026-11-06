import { useNavigation, useRouter } from "expo-router";
import { usePreventRemove } from "expo-router/react-navigation";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

type Prompt = { title: string; message: string };


export function useUnsavedChanges(dirty: boolean, { title, message }: Prompt) {
  const router = useRouter();
  const navigation = useNavigation();
  const [leaving, setLeaving] = useState(false);

  usePreventRemove(dirty && !leaving, ({ data }) => {
    if (leaving) {
      navigation.dispatch(data.action);
      return;
    }
    Alert.alert(title, message, [
      { text: "Keep editing", style: "cancel" },
      { text: "Discard", style: "destructive", onPress: () => navigation.dispatch(data.action) },
    ]);
  });

  useEffect(() => {
    if (leaving) router.back();
  }, [leaving, router]);

  return () => setLeaving(true);
}
