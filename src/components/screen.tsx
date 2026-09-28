import { type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenProps = {
  scrollView?: Boolean;
  skipTopInset?: Boolean;
  skipBottomInset?: Boolean;
  children: ReactNode;
}

export default function Screen({ scrollView = true, skipTopInset = false, skipBottomInset = false, children }: ScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      {scrollView ?
        <ScrollView
          contentContainerStyle={{
            paddingTop: skipTopInset ? 0 : insets.top,
            paddingBottom: skipBottomInset ? 0 : insets.bottom + 32
          }}
          className="px-4 flex-1"
        >
          {children}
        </ScrollView>
      :
        <View
          style={{
            paddingTop: skipTopInset ? 0 : insets.top,
            paddingBottom: skipBottomInset ? 0 : insets.bottom + 32
          }}
          className="px-4 flex-1"
        >
          {children}
        </View>}
    </View>
  );
}
