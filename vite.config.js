import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      // devOptions: {
      //   enabled: true
      // },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'fireflies',  
        short_name: 'Fireflies',  
        description: 'Generador de fondos abstractos',  
        theme_color: '#0f172a',  
        start_url: '/',  
        icons: [{
            src: 'pwa-192x192.png',  
                      sizes: '192x192',  
                      type: 'image/png',  
                    },  
                    {  
            src: 'pwa-512x512.png',  
                      sizes: '512x512',  
                      type: 'image/png',  
                    },  
                    {  
            src: 'pwa-512x512.png',  
                      sizes: '512x512',  
                      type: 'image/png',  
                      purpose: 'any maskable',  
                    },  
                  ]
        },
        workbox: {
          globPatterns: [
            '**/*.{html,js,css,png}'
          ]
        }
    })
  ]
});