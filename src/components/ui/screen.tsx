import { useContentTopInset } from "@/hooks/use-content-top-inset";
import { useScrollInsets } from "@/hooks/use-scroll-insets";
import { type ReactNode } from "react";
import { Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-screens/experimental";

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
  const bottomSpacing = skipBottomInset ? 0 : footer ? 24 : 32;
  const scroll = useScrollInsets(skipTopInset ? 0 : 8, bottomSpacing);

  return (
    <View className="flex-1 bg-background">
      {scrollView ? (
        <ScrollView
          contentInsetAdjustmentBehavior={skipTopInset ? "never" : scroll.contentInsetAdjustmentBehavior}
          contentContainerStyle={{
            paddingTop: skipTopInset ? 0 : scroll.paddingTop,
            // With a footer, the footer clears the tab bar, so the content only needs spacing.
            paddingBottom: skipBottomInset || footer ? bottomSpacing : scroll.paddingBottom,
            flexGrow: 1,
          }}
          className="flex-1 px-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={{
            paddingTop: skipTopInset ? 0 : topInset + 8,
            paddingBottom: skipBottomInset ? 0 : insets.bottom + bottomSpacing,
          }}
          className="flex-1 px-5"
        >
          {children}
        </View>
      )}
      {footer ? (
        Platform.OS === "ios" ? (
          // The screen's native safe area includes the tab bar, which JS insets don't.
          <SafeAreaView edges={{ bottom: true }} style={{ flex: 0 }}>
            <View className="px-5 pb-3 pt-2">{footer}</View>
          </SafeAreaView>
        ) : (
          <View className="px-5 pt-2" style={{ paddingBottom: insets.bottom + 12 }}>
            {footer}
          </View>
        )
      ) : null}
    </View>
  );
}
