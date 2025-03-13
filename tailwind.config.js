/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 🔥 src 폴더 내 모든 JSX/TSX 파일에서 Tailwind 적용
    "./public/index.html", // HTML도 포함 가능
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
