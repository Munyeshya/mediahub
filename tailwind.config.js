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
        // --- New Spark Movements (15) ---
        // #1: Diagonal (Top-Left to Bottom-Right)
        sparkMovement1: { '0%': { 'background-position': '0% 0%' }, '100%': { 'background-position': '800% 800%' } },
        // #2: Reverse Diagonal (Bottom-Right to Top-Left)
        sparkMovement2: { '0%': { 'background-position': '100% 100%' }, '100%': { 'background-position': '-500% -500%' } },
        // #3: Vertical (Bottom-to-Top)
        sparkMovement3: { '0%': { 'background-position': '50% 100%' }, '100%': { 'background-position': '50% -1000%' } },
        // #4: Horizontal (Left-to-Right)
        sparkMovement4: { '0%': { 'background-position': '0% 40%' }, '100%': { 'background-position': '1000% 40%' } },
        // #5: Opposite Diagonal (Top-Right to Bottom-Left)
        sparkMovement5: { '0%': { 'background-position': '100% 0%' }, '100%': { 'background-position': '-600% 1200%' } },
        // #6: Horizontal (Right-to-Left)
        sparkMovement6: { '0%': { 'background-position': '100% 70%' }, '100%': { 'background-position': '-1200% 70%' } },
        // #7: Vertical (Top-to-Bottom)
        sparkMovement7: { '0%': { 'background-position': '30% 0%' }, '100%': { 'background-position': '30% 1200%' } },
        // #8: Diagonal (Bottom-Left to Top-Right)
        sparkMovement8: { '0%': { 'background-position': '0% 100%' }, '100%': { 'background-position': '1500% -1000%' } },
        // #9: Circular Wobble/Twist (Complex Path)
        sparkMovement9: {
            '0%': { 'background-position': '50% 50%' },
            '25%': { 'background-position': '55% 40%' },
            '50%': { 'background-position': '40% 55%' },
            '75%': { 'background-position': '60% 60%' },
            '100%': { 'background-position': '50% 50%' }
        },
        // #10: Slowest Wander (Diagonal, long duration)
        sparkMovement10: { '0%': { 'background-position': '0% 0%' }, '100%': { 'background-position': '500% 500%' } },
        // #11: Subtle Side-to-Side only (Slow)
        sparkMovement11: { '0%': { 'background-position': '40% 60%' }, '100%': { 'background-position': '800% 60%' } },
        // #12: Subtle Up-Down only (Slow)
        sparkMovement12: { '0%': { 'background-position': '60% 40%' }, '100%': { 'background-position': '60% -800%' } },
        // #13: Super Slow Reverse Diagonal
        sparkMovement13: { '0%': { 'background-position': '70% 30%' }, '100%': { 'background-position': '-200% -800%' } },
        // #14: Fast Horizontal Drift (Small amplitude)
        sparkMovement14: { '0%': { 'background-position': '5% 75%' }, '100%': { 'background-position': '1000% 75%' } },
        // #15: Fast Vertical Drift (Small amplitude)
        sparkMovement15: { '0%': { 'background-position': '75% 5%' }, '100%': { 'background-position': '75% 1000%' } },
        floatSubtle: {
                '0%, 100%': { transform: 'translateY(0px)' },
                '50%': { transform: 'translateY(-6px)' }, /* Adjusts vertical float distance */
            },
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

        // The 15 new spark utilities
        'spark-1': 'sparkMovement1 110s linear infinite alternate',
        'spark-2': 'sparkMovement2 140s ease-in-out infinite alternate',
        'spark-3': 'sparkMovement3 100s ease-out infinite alternate',
        'spark-4': 'sparkMovement4 130s linear infinite alternate',
        'spark-5': 'sparkMovement5 160s linear infinite alternate',
        'spark-6': 'sparkMovement6 170s ease-in-out infinite alternate',
        'spark-7': 'sparkMovement7 150s linear infinite alternate',
        'spark-8': 'sparkMovement8 125s ease-out infinite alternate',
        'spark-9': 'sparkMovement9 80s linear infinite alternate',
        'spark-10': 'sparkMovement10 200s linear infinite alternate',
        'spark-11': 'sparkMovement11 210s ease-out infinite alternate',
        'spark-12': 'sparkMovement12 190s ease-in-out infinite alternate',
        'spark-13': 'sparkMovement13 180s ease-in-out infinite alternate',
        'spark-14': 'sparkMovement14 115s ease-in-out infinite alternate',
        'spark-15': 'sparkMovement15 90s linear infinite alternate',
      },
    },
  },
  plugins: [],
}