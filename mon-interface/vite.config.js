import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ajout du chemin de base pour éviter les problèmes de déploiement
  plugins: [react()],
  build: {
    // On dit à React de construire directement DANS le dossier Node-RED
    outDir: 'C:/Users/amand/.node-red/uibuilder/can-monitor/src',
    emptyOutDir: true, // Nettoie le dossier avant de reconstruire
  }
})