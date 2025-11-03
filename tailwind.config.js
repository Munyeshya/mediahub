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
      // 1. KEYFRAMES (15 unique, multi-directional spark movements)
      keyframes: {

        // Existing keyframes for card slide-in (PRESERVED)
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

      // 2. ANIMATION UTILITIES (15 unique durations and timing functions)
      animation: {
        // Existing animation utility for card slide-in (PRESERVED)
        "slide-in": "slide-in 0.6s ease-out forwards",
        'float-subtle': 'floatSubtle 3.5s ease-in-out infinite', /* Slow, smooth looping */

      },
    },
  },
  plugins: [],
}