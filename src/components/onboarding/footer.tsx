import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { type ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FooterProps = {
  continueText: string;
  onContinue: () => void;
  bottomElement?: ReactNode | undefined;
  loading: boolean;
};

export default function Footer({ continueText, onContinue, bottomElement, loading }: FooterProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
        className="absolute left-1/2 -translate-x-1/2 flex flex-col gap-1"
        style={{ bottom: insets.bottom }}
      >
        <Pressable
          accessibilityRole="button"
          onPress={onContinue}
          disabled={loading}
          className="min-h-16 min-w-full flex-row items-center justify-center rounded-full bg-primary"
        >
          {loading ?
            <ActivityIndicator size="small" color="#ffffff" /> :
            <Text className="text-xl font-semibold text-white">{continueText}</Text>
          }
        </Pressable>

        {bottomElement}
      </View>
  );
}
