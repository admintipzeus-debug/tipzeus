/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#FFFCF5",
        ink: "#2E2416",
        muted: "#8A7A64",
        line: "#F1E7D4",
        coral: "#FF4E3A",
        coralSoft: "#FFE2DC",
        teal: "#00BFA6",
        tealSoft: "#D8F7F1",
        sun: "#FFC233",
        sunSoft: "#FFF2CF",
        sky: "#2DA9FF",
        skySoft: "#DCF0FF",
      },
      fontFamily: {
        head: ["'Baloo 2'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
