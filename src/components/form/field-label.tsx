import Text from "@/components/ui/text";

export default function FieldLabel({ children }: { children: string }) {
  return <Text muted className="mb-2 ml-2 font-display-medium text-sm">{children}</Text>;
}

export const fieldBox = "flex-row items-center rounded-[20px] border-2 border-border bg-surface";
