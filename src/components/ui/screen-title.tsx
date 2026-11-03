import Heading from "@/components/ui/heading";
import Text from "@/components/ui/text";
import { type ReactNode } from "react";
import { View } from "react-native";

type ScreenTitleProps = {
  children: string;
  subtitle?: string;
  /** Rendered to the right of the title, e.g. the mascot or a button. */
  right?: ReactNode;
};

/** Large title for tab root screens, which hide the native header. */
export default function ScreenTitle({ children, subtitle, right }: ScreenTitleProps) {
  return (
    <View className="mb-6 mt-2 flex-row items-end">
      <View className="flex-1">
        {subtitle ? <Text muted className="mb-0.5 text-base font-medium">{subtitle}</Text> : null}
        <Heading size="xl">{children}</Heading>
      </View>
      {right}
    </View>
  );
}
