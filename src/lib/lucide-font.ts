import { createIconSet } from "@expo/vector-icons";
import codepoints from "lucide-static/font/codepoints.json";

const glyphMap = Object.fromEntries(
  Object.entries(codepoints as Record<string, number | string>).map(([name, codepoint]) => [
    name,
    typeof codepoint === "number" ? codepoint : parseInt(codepoint, 16)
  ])
);

export const LucideFont = createIconSet(
  glyphMap,
  "lucide",
  require("lucide-static/font/lucide.ttf")
);
