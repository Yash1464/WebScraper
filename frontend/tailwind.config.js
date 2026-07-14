/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0b0e14",
          900: "#111420",
          800: "#181c2b",
          700: "#232838",
        },
        accent: {
          indigo: "#6366f1",
          cyan: "#22d3ee",
          amber: "#f59e0b",
          pink: "#ec4899",
        },
      },
    },
  },
  plugins: [],
};
