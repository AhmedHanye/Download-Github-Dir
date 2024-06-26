/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "selector",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        Charcoal: "#212121",
      },
      boxShadow: {
        shadow1: "#f97316 0 0 20px 0",
        shadow2: "#64748b 0 0 20px 0",
      },
      backgroundImage: {
        bgImage1: "linear-gradient(360deg,#AF40FF, #5B42F3 50%,#00DDEB)",
      },
      backgroundColor: {
        background1: "rgb(5, 6, 45);",
      },
    },
  },
  plugins: [],
};
