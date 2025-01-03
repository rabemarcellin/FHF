/** @type {import('tailwindcss').Config} */
import daisyUI from "daisyui"

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        text: ["Montserrat", "'Open Sans'", "sans-serif"],
      },
    },
  },
  plugins: [daisyUI],
};
