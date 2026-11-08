/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-alt": "rgb(var(--color-surface-alt) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        tint: {
          cream: "rgb(var(--tint-cream) / <alpha-value>)",
          sky: "rgb(var(--tint-sky) / <alpha-value>)",
          peach: "rgb(var(--tint-peach) / <alpha-value>)",
          rose: "rgb(var(--tint-rose) / <alpha-value>)",
          mint: "rgb(var(--tint-mint) / <alpha-value>)",
          lilac: "rgb(var(--tint-lilac) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["BricolageGrotesque_800ExtraBold"],
        "display-bold": ["BricolageGrotesque_700Bold"],
        "display-medium": ["BricolageGrotesque_600SemiBold"],
      },
    },
  },
  plugins: [],
}
