/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981', // Emerald 500
          dark: '#047857', // Emerald 700
        },
        background: '#0f172a', // Slate 900 for dark mode
        surface: '#1e293b', // Slate 800
      }
    },
  },
  plugins: [],
}
