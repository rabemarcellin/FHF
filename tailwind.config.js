/** @type {import('tailwindcss').Config} */
import daisyUI from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        text: ["Poppins", "Signika", "Montserrat", "'Open Sans'", "sans-serif"],
        title: ["Gochi Hand"],
      },
    },
  },
  plugins: [daisyUI],
};
