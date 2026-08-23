import { db } from "@/db/client";
import { bloodPressureReadings, medications } from "@/db/schema";
import { File, Paths } from "expo-file-system";

export function exportJson(name: string): File {
  const allbBloodPressureReadings = db.select().from(bloodPressureReadings).all();
  const allMedications = db.select().from(medications).all();
  const data = {
      bloodPressureReadings: allbBloodPressureReadings,
      medications: allMedications,
  }

  const file = new File(
    Paths.cache,
    name
  )
  file.create({overwrite: true})
  file.write(JSON.stringify(data))

  return file
}

export async function exportDb(name: string): Promise<File> {
  const file = new File(
    Paths.cache,
    name
  );
  if (file.exists) file.delete();
  
  const fsPath = decodeURIComponent(file.uri.replace("file://", "")).replace(/'/g, "''");
  const sqlite = db.$client;
  await sqlite.execAsync(`VACUUM INTO '${fsPath}'`);

  return file;
}
