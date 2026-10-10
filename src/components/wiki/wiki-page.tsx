import Screen from "@/components/ui/screen";
import WikiHeader from "@/components/wiki/wiki-header";
import { type LucideIcon } from "lucide-react-native";
import { type ReactNode } from "react";

type WikiPageProps = {
  icon: LucideIcon;
  heading: string;
  path: string;
  children?: ReactNode;
};

export default function WikiPage({ icon, heading, path, children }: WikiPageProps) {
  return (
    <Screen skipTopInset>
      <WikiHeader icon={icon} heading={heading} path={path} />
      {children}
    </Screen>
  );
}
