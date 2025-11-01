// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Ensure this path correctly targets ALL your JSX/TSX files
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      // 1. KEYFRAMES
      keyframes: {
        // MUST BE 'moveBackground'
        moveBackground: { 
          '0%': { 'background-position': '0% 0%' },
          '100%': { 'background-position': '100% 100%' },
        },
      },
      animation: {
        // MUST BE 'abstract-move'
        'abstract-move': 'moveBackground 60s linear infinite', 
      },
    },
  },
  plugins: [],
}