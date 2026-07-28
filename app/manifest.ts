import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NeumorStudio - Diseño que conecta',
    short_name: 'NeumorStudio',
    description: 'Webs con panel propio, leads centralizados y automatizaciones. Diseño neumórfico profesional.',
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
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'NeumorStudio Desktop',
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '750x1334',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'NeumorStudio Mobile',
      },
    ],
  }
}
