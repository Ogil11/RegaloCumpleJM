import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import imagenesOptimizadas from './plugins/imagenes.js'
import datosPareja from './plugins/pareja.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    datosPareja(),
    react(),
    tailwindcss(),
    imagenesOptimizadas(),
  ],
  build: {
    rolldownOptions: {
      // El aviso de "plugins lentos" no es un error: el que tarda es Tailwind.
      checks: { pluginTimings: false },
      output: {
        // Las librerias van en archivos aparte: al cambiar fotos o textos
        // y volver a publicar, el navegador las sigue teniendo guardadas.
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'router', test: /node_modules[\\/](react-router|react-router-dom)[\\/]/ },
            { name: 'animaciones', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/ },
          ],
        },
      },
    },
  },
})
