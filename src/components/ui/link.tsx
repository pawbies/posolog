import { Link as ExpoLink } from "expo-router";
import { cssInterop } from "nativewind";

cssInterop(ExpoLink, { className: "style" });

export { ExpoLink as Link };
