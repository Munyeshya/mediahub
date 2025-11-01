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
        // Existing animation for background
        moveBackground: { 
          '0%': { 'background-position': '0% 0%' },
          '100%': { 'background-position': '100% 100%' },
        },
        // NEW keyframes for card slide-in
        "slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        // Existing animation utility
        'abstract-move': 'moveBackground 60s linear infinite', 
        // NEW animation utility for card slide-in
        "slide-in": "slide-in 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
}