/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  // 定位index.html文件
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xxs: ["10px", "14px"],
        xs: ["12px", "16px"],
        sm: ["14px", "20x"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["30px", "36px"],
        "4xl": ["36px", "40px"],
        "5xl": ["48px", "1"],
        "6xl": ["60px", "1"],
        "7xl": ["72px", "1"],
        "8xl": ["96px", "1"],
      },
    },
  },
  plugins: [],
};
