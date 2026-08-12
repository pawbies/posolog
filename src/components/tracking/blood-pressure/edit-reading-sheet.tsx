import ReadingSheet, { type ReadingDraft } from "@/components/tracking/blood-pressure/reading-sheet";
import { db } from "@/db/client";
import { bloodPressureReadings } from "@/db/schema";
import { eq } from "drizzle-orm";

type Reading = typeof bloodPressureReadings.$inferSelect;

type Props = {
  isPresented: boolean;
  reading: Reading | null;
  onDismiss: () => void;
};

export default function EditReadingSheet({ isPresented, reading, onDismiss }: Props) {
  const update = async (draft: ReadingDraft) => {
    if (!reading) return;
    await db
      .update(bloodPressureReadings)
      .set(draft)
      .where(eq(bloodPressureReadings.id, reading.id));
  };

  return (
    <ReadingSheet
      isPresented={isPresented}
      title="Edit reading"
      submitLabel="Save changes"
      initial={reading}
      onSubmit={update}
      onDismiss={onDismiss}
    />
  );
}
