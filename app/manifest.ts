import type { MetadataRoute } from 'next'
import { marca } from '@/lib/content/marca'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${marca.nombre} | Software a medida para negocios`,
    short_name: 'NeumorStudio',
    // El mismo texto que la portada: sale de lib/content/marca.ts.
    description: marca.subtitular,
    start_url: '/',
    display: 'standalone',
    background_color: '#17181f',
    theme_color: '#17181f',
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
