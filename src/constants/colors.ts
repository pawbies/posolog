export const GREEN = "#aade87";
export const GREEN_DARK = "#56972b";

// Colors that can't be expressed as Tailwind classes (icon props, native
// navigation options, ...). The brand green is darkened on light backgrounds
// so it stays readable.
export const palette = {
  light: {
    brand: GREEN_DARK,
    onBrand: "#ffffff",
    brandIndicator: GREEN,
    brandRipple: "#56972b40",
    accent: "#a78bfa",
    chevron: "#a1a1aa",
    headerTint: "#171717",
  },
  dark: {
    brand: GREEN,
    onBrand: "#1a2e10",
    brandIndicator: "#2f4a1e",
    brandRipple: "#aade8740",
    accent: "#9333ea",
    chevron: "#71717a",
    headerTint: "#fafafa",
  },
} as const;

export type Palette = (typeof palette)[keyof typeof palette];
