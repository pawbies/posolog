export const TONES = ["cream", "sky", "peach", "rose", "mint", "lilac"] as const;
export type Tone = (typeof TONES)[number];

// Pastel fill per tone. Spelled out so NativeWind picks the classes up.
export const toneBg: Record<Tone, string> = {
  cream: "bg-tint-cream",
  sky: "bg-tint-sky",
  peach: "bg-tint-peach",
  rose: "bg-tint-rose",
  mint: "bg-tint-mint",
  lilac: "bg-tint-lilac",
};

// Colors that can't be expressed as Tailwind classes (icon props, native
// navigation options, chart strokes, ...). Keep in sync with global.css.
export const palette = {
  light: {
    brand: "#47b35a",
    onBrand: "#ffffff",
    brandIndicator: "#e1f4e4",
    brandRipple: "#47b35a40",
    text: "#262626",
    muted: "#78746e",
    chevron: "#b5b1aa",
    placeholder: "#aaa59d",
    headerTint: "#262626",
    background: "#fffcf6",
    surface: "#ffffff",
    grid: "#edebe6",
    danger: "#e54848",
    tones: {
      cream: "#e09b12",
      sky: "#3c8af3",
      peach: "#f0663f",
      rose: "#e5487a",
      mint: "#2f9c48",
      lilac: "#7c5ce6",
    } satisfies Record<Tone, string>,
  },
  dark: {
    brand: "#6bcb7a",
    onBrand: "#0e2212",
    brandIndicator: "#1f3a24",
    brandRipple: "#6bcb7a40",
    text: "#f5f3ef",
    muted: "#a09c96",
    chevron: "#5f5b56",
    placeholder: "#6f6b65",
    headerTint: "#f5f3ef",
    background: "#121110",
    surface: "#1e1d1b",
    grid: "#32302d",
    danger: "#f27878",
    tones: {
      cream: "#ffc34d",
      sky: "#7db0ff",
      peach: "#ff9677",
      rose: "#ff85aa",
      mint: "#6bcb7a",
      lilac: "#a992ff",
    } satisfies Record<Tone, string>,
  },
} as const;

export type Palette = (typeof palette)[keyof typeof palette];
