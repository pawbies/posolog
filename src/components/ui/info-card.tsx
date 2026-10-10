import Text from "@/components/ui/text";
import { View } from "react-native";

/** Muted paragraph on a surface card, used for page intros. */
export default function InfoCard({ children }: { children: string }) {
  return (
    <View className="bg-surface rounded-2xl p-4 mb-7">
      <Text muted className="text-base leading-6">{children}</Text>
    </View>
  );
}
