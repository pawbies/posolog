import Text from "@/components/ui/text";

/** Large title for tab root screens, which hide the native header. */
export default function ScreenTitle({ children }: { children: string }) {
  return <Text className="text-3xl font-semibold mb-6 ml-1">{children}</Text>;
}
