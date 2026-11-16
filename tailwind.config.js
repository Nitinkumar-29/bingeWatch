/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 20px rgba(59,130,246,0.4)",
        "glow-sm": "0 0 10px rgba(59,130,246,0.25)",
      },
    },
  },
  plugins: [],
};
