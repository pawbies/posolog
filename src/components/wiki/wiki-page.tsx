import Heading from "@/components/ui/heading";
import IconBadge from "@/components/ui/icon-badge";
import Screen from "@/components/ui/screen";
import Text from "@/components/ui/text";
import { type LucideIcon } from "lucide-react-native";
import { type ReactNode } from "react";
import { View } from "react-native";

type WikiPageProps = {
  icon: LucideIcon;
  heading: string;
  path: string;
  children?: ReactNode;
};

export default function WikiPage({ icon, heading, path, children }: WikiPageProps) {
  return (
    <Screen>
      <View className="pb-2 pt-4">
        <IconBadge icon={icon} tone="lilac" size="lg" className="-rotate-3" />
        <Text muted className="mt-4 text-sm font-semibold">{path}</Text>
        <Heading size="lg" className="mt-0.5">{heading}</Heading>
      </View>

      <View className="my-6 h-0.5 bg-border" />

      {children}
    </Screen>
  );
}
