import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sport Quizz',
    short_name: 'Sport Quizz',
    description: 'Quiz sportif style Sporcle — Football, Cyclisme, MMA',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#09090b',
    theme_color: '#0ea5e9',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      // Ajouter icon-192.png et icon-512.png pour une meilleure compatibilité Android
      // (générer depuis icon.svg via squoosh.app ou realfavicongenerator.net)
      // { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      // { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
    ],
  }
}
