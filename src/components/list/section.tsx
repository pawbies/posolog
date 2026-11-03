import Heading from "@/components/ui/heading";
import { Children, Fragment, isValidElement, type ReactNode } from "react";
import { View } from "react-native";

type SectionProps = {
  title?: string;
  children: ReactNode;
};

/** Grouped list card with separators between its rows. */
export default function Section({ title, children }: SectionProps) {
  const rows = Children.toArray(children).filter(isValidElement);

  return (
    <View className="mb-7">
      {title ? <Heading size="xs" className="mb-2.5 ml-2 text-text-muted">{title}</Heading> : null}
      <View className="overflow-hidden rounded-[28px] border-2 border-border bg-surface">
        {rows.map((row, i) => (
          <Fragment key={row.key}>
            {i > 0 && <View className="ml-[72px] h-0.5 bg-border" />}
            {row}
          </Fragment>
        ))}
      </View>
    </View>
  );
}
