import { useContentTopInset } from "@/hooks/use-content-top-inset";
import { type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenProps = {
  scrollView?: boolean;
  skipTopInset?: boolean;
  skipBottomInset?: boolean;
  /** Pinned below the scrolling content, e.g. a call-to-action button. */
  footer?: ReactNode;
  children: ReactNode;
};

export default function Screen({ scrollView = true, skipTopInset = false, skipBottomInset = false, footer, children }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const topInset = useContentTopInset();
  const padding = {
    paddingTop: skipTopInset ? 0 : topInset + 8,
    paddingBottom: skipBottomInset ? 0 : footer ? 24 : insets.bottom + 32,
  };

  return (
    <View className="flex-1 bg-background">
      {scrollView ? (
        <ScrollView
          contentContainerStyle={{ ...padding, flexGrow: 1 }}
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={padding} className="flex-1 px-5">
          {children}
        </View>
      )}
      {footer ? (
        <View className="px-5 pt-2" style={{ paddingBottom: insets.bottom + 12 }}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}
