import Text from "@/components/ui/text";
import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { View } from "react-native";

type SectionProps = {
  title?: string;
  children: ReactNode;
};

/** Grouped list card (iOS settings style) with separators between its rows. */
export default function Section({ title, children }: SectionProps) {
  const rows = Children.toArray(children).filter(isValidElement);

  return (
    <View className="mb-7">
      {title ? (
        <Text muted className="text-base ml-5 mb-2">
          {title}
        </Text>
      ) : null}
      <View className="bg-surface rounded-2xl overflow-hidden">
        {rows.map((row, i) => (
          <Fragment key={row.key}>
            {i > 0 && <View className="ml-4 h-px bg-border" />}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}
