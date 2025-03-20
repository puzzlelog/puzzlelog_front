/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        cafe24square: ["Cafe24OhSquareAir", "sans-serif"],
        cafe24: ["Cafe24Oneprettynight", "sans-serif"], 
      },
    },
  },
  plugins: [],
};
