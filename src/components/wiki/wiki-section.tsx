import Text from "@/components/text";
import { Children, cloneElement, isValidElement, ReactElement, ReactNode } from "react";
import { View } from "react-native";
import { WikiRowProps } from "./wiki-row";

export type WikiSectionProps = {
  title: string;
  children: ReactNode;
};

export function WikiSection({ title, children }: WikiSectionProps) {
  const rows = Children.toArray(children).filter(isValidElement) as ReactElement<WikiRowProps>[];

  return (
    <View className="mb-7">
      <Text muted className="text-base ml-5 mb-2">
        {title}
      </Text>
      <View className="bg-surface rounded-2xl overflow-hidden">
        {rows.map((child, i) => cloneElement(child, { first: i === 0 }))}
      </View>
    </View>
  );
}
