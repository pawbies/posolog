import { Image as ExpoImage } from "expo-image";
import { cssInterop } from "nativewind";

cssInterop(ExpoImage, { className: "style" });

export { ExpoImage as Image };
