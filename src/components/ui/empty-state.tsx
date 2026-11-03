import Heading from "@/components/ui/heading";
import Mascot from "@/components/ui/mascot";
import Text from "@/components/ui/text";
import { type ReactNode } from "react";
import { View } from "react-native";

type EmptyStateProps = {
  title: string;
  body?: string;
  /** Usually a Button. */
  action?: ReactNode;
};

/** Friendly placeholder with the mascot, for empty lists and unfinished screens. */
export default function EmptyState({ title, body, action }: EmptyStateProps) {
  return (
    <View className="items-center px-6 py-10">
      <View className="h-40 w-40 items-center justify-center rounded-full bg-tint-mint">
        <Mascot className="h-32 w-24" />
      </View>
      <Heading size="md" className="mt-5 text-center">{title}</Heading>
      {body ? <Text muted className="mt-2 text-center text-base leading-6">{body}</Text> : null}
      {action ? <View className="mt-6 self-stretch">{action}</View> : null}
    </View>
  );
}
