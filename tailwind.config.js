/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        handwriting: ["'Nanum Pen Script'", "cursive"],
        pretty: ["'Cafe24Oneprettynight'", "cursive"],
        cute: ["'Jua'", "sans-serif"], // 귀여운 폰트 추가
      },
    },
  },
  plugins: [],
};
