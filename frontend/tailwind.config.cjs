/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,svelte,ts}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: "#D7D7D9",
          dark: "#1C3D59",
        },
        primary: {
          DEFAULT: "#F29544",   // --brand-orange
          dark: "#F2884B",      // --brand-orange-2
          light: "#FFD1A6",     // tom mais claro opcional
        },
        accent: "#F26457",       // --brand-red
      },
      fontFamily: {
        sans: ["Inter", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
