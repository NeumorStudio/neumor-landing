import type { MetadataRoute } from 'next'
import { sitio } from '@/lib/content/marca'

// /docs queda deliberadamente fuera. Sigue describiendo una arquitectura que ya
// no existe (Supabase, n8n, Meta), y pedirle a Google que indexe documentación
// falsa es peor que no tenerla indexada. Además va `noindex` desde su layout,
// que es lo que de verdad la saca del índice. Vuelve a entrar aquí en cuanto se
// reescriba o se despublique.

// Fechas a mano, no `new Date()`.
//
// Con la fecha de compilación, cada despliegue le decía a Google que el aviso
// legal había cambiado —aunque no se hubiera tocado en meses—, y una señal que
// siempre dice "reciente" es una señal que no dice nada. Se actualiza la línea
// que toque el día que se edite esa página.
const EDITADO = {
  home: '2026-09-02',
  privacy: '2026-07-30',
  terms: '2026-07-30',
} as const

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: sitio.url,
      lastModified: EDITADO.home,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${sitio.url}/privacy`,
      lastModified: EDITADO.privacy,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${sitio.url}/terms`,
      lastModified: EDITADO.terms,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
