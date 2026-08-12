import ReadingSheet, { type ReadingDraft } from "@/components/tracking/blood-pressure/reading-sheet";
import { db } from "@/db/client";
import { bloodPressureReadings } from "@/db/schema";

type Props = {
  isPresented: boolean;
  onDismiss: () => void;
};

export default function AddReadingSheet({ isPresented, onDismiss }: Props) {
  const insert = async (draft: ReadingDraft) => {
    await db.insert(bloodPressureReadings).values(draft);
  };

  return (
    <ReadingSheet
      isPresented={isPresented}
      title="New reading"
      submitLabel="Save"
      onSubmit={insert}
      onDismiss={onDismiss}
    />
  );
}
