/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,vue,svelte}"],
  theme: {
    extend: {
      colors: {
        // preliminary colors
        primary: {
          100: "#030213",
          900: "#363638ff",
        },
        secondary: {
          100: "#fefefeff",
          900: "#cfcfd0ff",
        },
      },
      fontFamily: {},
      spacing: {},
      screens: {},
    },
  },
  plugins: [],
};