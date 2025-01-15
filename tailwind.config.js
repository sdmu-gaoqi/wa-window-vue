/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");
const tailwindUtilities = require("./src/constants/tailwind.json");

export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: "#6102fd",
        fontPrimary: "#6a6d82",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      const newUtilities = tailwindUtilities;

      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
