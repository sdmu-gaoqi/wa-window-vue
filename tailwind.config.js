/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");

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
      const newUtilities = {
        ".btn": {
          width: "100%",
          height: "26px",
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
          border: "1px solid var(--vscode-textBlockQuote-border)",
          cursor: "pointer",
          "user-select": "none",
          margin: "2px 0",
          color: "var(--vscode-textLink-foreground)",

          "&:hover": {
            background: "#6fa6f4",
            color: "#fff",
          },
        },
        ".ell": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          wordBreak: "keep-all",
        },
        ".textarea": {
          width: "100%",
          margin: "4px 0",
          resize: "none",
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
