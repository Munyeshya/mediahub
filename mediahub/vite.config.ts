// vite.config.ts (Finalized)
import path from "path"
// REMOVED: import tailwindcss from "@tailwindcss/vite" 👈 REMOVE THIS
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Only keep the React plugin. Vite automatically handles PostCSS/Tailwind.
  plugins: [
    react(),
    tailwindcss(),
  ], 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})