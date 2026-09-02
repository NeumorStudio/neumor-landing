import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NeumorStudio — software a medida para negocios',
    short_name: 'NeumorStudio',
    description: 'Montamos el software que tu negocio todavía hace a mano: reservas, gestión, captación y atención automática.',
    start_url: '/',
    display: 'standalone',
    background_color: '#12151c',
    theme_color: '#12151c',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'es',
    categories: ['business', 'productivity', 'design'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
