import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/content/marca'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${sitio.url}/sitemap.xml`,
  }
}
