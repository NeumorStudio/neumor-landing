import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { marca } from '@/lib/content/marca'

// La imagen que se ve al compartir el enlace por WhatsApp, Instagram, LinkedIn o X.
// Se genera desde el código a propósito: antes se apuntaba a un PNG que no
// existía en el repositorio, así que cada enlace compartido salía sin
// previsualización. Generándola aquí no hay fichero que se pueda perder, y el
// titular siempre coincide con el de la web porque sale del mismo sitio.

export const alt = `${marca.nombre} — ${marca.titular}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// El mismo símbolo que la barra de navegación y el favicon. Se incrusta en la
// imagen para que quien vea la previsualización y quien entre en la web vean
// exactamente la misma marca.
const logo = readFileSync(join(process.cwd(), 'public/images/logo-mark.png'))
const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#12151c',
          padding: '72px 80px',
        }}
      >
        {/* Símbolo + wordmark: neumor▪ / STUDIO, el mismo del pie de la web */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt=""
            width={64}
            height={64}
            style={{ borderRadius: 16, marginRight: 20 }}
          />
          <span
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: '#f2f4f8',
              letterSpacing: '-0.02em',
            }}
          >
            neumor
          </span>
          <div
            style={{
              width: 10,
              height: 10,
              backgroundColor: '#5c77ff',
              borderRadius: 2,
              marginLeft: 4,
              marginTop: 16,
            }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: 300,
              color: '#8b94a7',
              letterSpacing: '0.42em',
              marginLeft: 16,
              marginTop: 12,
            }}
          >
            STUDIO
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 68,
              fontWeight: 700,
              color: '#f2f4f8',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: 900,
            }}
          >
            Montamos el software que tu negocio todavía hace a mano
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 27,
              color: '#8b94a7',
              marginTop: 28,
              maxWidth: 820,
              lineHeight: 1.4,
            }}
          >
            Reservas, gestión, captación de clientes y atención automática.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', width: 56, height: 4, backgroundColor: '#5c77ff' }} />
          <span style={{ fontSize: 22, color: '#8b94a7', marginLeft: 20 }}>
            neumorstudio.com
          </span>
        </div>
      </div>
    ),
    size
  )
}
