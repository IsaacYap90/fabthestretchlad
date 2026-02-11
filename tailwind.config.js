/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'brand': '#1a8f6e',
        'brand-dark': '#0d1b2a',
        'brand-light': '#e0f5ee',
        'accent': '#f4a261',
        'warm': '#faf5f0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
