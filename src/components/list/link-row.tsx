import IconBadge from "@/components/ui/icon-badge";
import Pressable from "@/components/ui/pressable";
import Text from "@/components/ui/text";
import { type Tone } from "@/constants/colors";
import { usePalette } from "@/hooks/use-palette";
import { useRouter, type Href } from "expo-router";
import { ChevronRight, type LucideIcon } from "lucide-react-native";

type LinkRowProps = {
  icon: LucideIcon;
  tone?: Tone;
  title: string;
  href: Href;
};

export default function LinkRow({ icon, tone = "lilac", title, href }: LinkRowProps) {
  const router = useRouter();
  const { chevron } = usePalette();

  return (
    <Pressable
      onPress={() => router.push(href)}
      accessibilityRole="link"
      className="flex-row items-center px-3.5 py-3"
    >
      <IconBadge icon={icon} tone={tone} size="sm" className="h-10 w-10" />
      <Text className="ml-4 flex-1 text-[17px] font-medium">{title}</Text>
      <ChevronRight size={20} color={chevron} strokeWidth={2.5} />
    </Pressable>
  );
}
