/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F1F4FA",
          100: "#E3EAF6",
          500: "#5274B6",
          600: "#2F5AAE",
          700: "#244989",
        },
        tubs: {
          red: "#A6192E",
          redDark: "#861526",
        },
        slateHero: "#96959F",
        ink: "#272626",
        canvas: "#F6F5F3",
        sand: "#F0EEE9",
        line: "#DDDAD5",
        muted: "#77777D",
        paleBlue: "#EDF1F8",
        paleRed: "#F8ECEE",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        editorial: ["Georgia", "Times New Roman", "serif"],
      },
      boxShadow: {
        card: "0 14px 40px rgba(39, 38, 38, 0.07)",
        soft: "0 8px 24px rgba(39, 38, 38, 0.06)",
      },
      borderRadius: {
        panel: "1.25rem",
      },
    },
  },
  plugins: [],
};
