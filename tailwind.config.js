// tailwind.config.js
module.exports = {
  darkMode: "class", // ← This enables manual dark mode via JS
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};