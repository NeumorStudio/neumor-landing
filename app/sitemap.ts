import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/content/marca'

// /docs queda deliberadamente fuera. Sigue describiendo una arquitectura que ya
// no existe (Supabase, n8n, Meta), y pedirle a Google que indexe documentación
// falsa es peor que no tenerla indexada. Vuelve a entrar aquí en cuanto se
// reescriba o se despublique.

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: sitio.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${sitio.url}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${sitio.url}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
