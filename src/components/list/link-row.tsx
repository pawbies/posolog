import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { usePalette } from "@/hooks/use-palette";
import { useRouter, type Href } from "expo-router";
import { ChevronRight, type LucideIcon } from "lucide-react-native";

type LinkRowProps = {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  href: Href;
};

export default function LinkRow({ icon: Icon, iconColor, title, href }: LinkRowProps) {
  const router = useRouter();
  const { accent, chevron } = usePalette();

  return (
    <Pressable onPress={() => router.push(href)} className="flex-row items-center px-4 py-4">
      <Icon size={24} color={iconColor ?? accent} />
      <Text className="flex-1 ml-4 text-lg">{title}</Text>
      <ChevronRight size={20} color={chevron} />
    </Pressable>
  );
}
