import { db } from "@/db/client";
import { bloodPressureReadings, medications } from "@/db/schema";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

export const EXPORT_FORMATS = [
  { name: "JSON", key: "json" },
  { name: "Database", key: "db" },
] as const;

export type ExportFormat = (typeof EXPORT_FORMATS)[number]["key"];

function writeJson(name: string): File {
  const data = {
    bloodPressureReadings: db.select().from(bloodPressureReadings).all(),
    medications: db.select().from(medications).all(),
  };

  const file = new File(Paths.cache, name);
  file.create({ overwrite: true });
  file.write(JSON.stringify(data));
  return file;
}

async function writeDb(name: string): Promise<File> {
  const file = new File(Paths.cache, name);
  if (file.exists) file.delete();

  const fsPath = decodeURIComponent(file.uri.replace("file://", "")).replace(/'/g, "''");
  await db.$client.execAsync(`VACUUM INTO '${fsPath}'`);
  return file;
}

const SHARE_OPTIONS: Record<ExportFormat, Sharing.SharingOptions> = {
  json: { mimeType: "application/json", UTI: "public.json" },
  db: { mimeType: "application/vnd.sqlite3", UTI: "public.database" },
};

/** Writes all user data to a temporary file, opens the share sheet, then removes the file. */
export async function shareExport(format: ExportFormat): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) throw new Error("Sharing is not available");

  const name = `posolog-export-${new Date().toISOString().slice(0, 10)}.${format}`;
  const file = format === "json" ? writeJson(name) : await writeDb(name);

  try {
    await Sharing.shareAsync(file.uri, { ...SHARE_OPTIONS[format], dialogTitle: "Export data" });
  } finally {
    if (file.exists) file.delete();
  }
}
