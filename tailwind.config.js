/** @type {import('tailwindcss').Config} */
import daisyUI from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["DejaVu-Sans", "sans-serif"],
      },
    },
  },
  plugins: [daisyUI],
};
