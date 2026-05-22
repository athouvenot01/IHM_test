import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ajout du chemin de base pour éviter les problèmes de déploiement
  plugins: [react()]
})
