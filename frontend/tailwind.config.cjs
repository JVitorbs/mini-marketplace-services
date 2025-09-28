/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb", // azul
          dark: "#1e40af",
          light: "#3b82f6"
        },
        secondary: {
          DEFAULT: "#10b981", // verde
          dark: "#047857",
          light: "#34d399"
        }
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"]
      }
    },
  },
  plugins: [],
}
