import { ConfigContext, ExpoConfig } from "expo/config";

const variant = process.env.VARIANT ?? "development";

const ids = {
  development: { id: "net.pawbies.posolog.dev", name: "posolog (Dev)" },
  preview: { id: "net.pawbies.posolog.preview", name: "posolog (Preview)" },
  production: { id: "net.pawbies.posolog", name: "posolog" }
}[variant]!;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: ids.name,
  slug: "posolog",
  ios: { ...config.ios, bundleIdentifier: ids.id },
  android: { ...config.android, package: ids.id },
  extra: {
    ...config.extra,
    variant
  }
});
