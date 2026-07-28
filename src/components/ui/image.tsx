import { Image as ExpoImage } from "expo-image";
import { cssInterop } from "nativewind";

// expo-image isn't one of NativeWind's built-in components, so `className`
// would be ignored unless we map it onto `style` ourselves.
cssInterop(ExpoImage, { className: "style" });

export { ExpoImage as Image };
