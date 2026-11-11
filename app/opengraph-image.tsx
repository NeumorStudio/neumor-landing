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
const logo = readFileSync(join(process.cwd(), 'public/marca/icono-192.png'))
const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

// La n en relieve, a la derecha. Es JPEG porque este generador no lee WebP.
const n = readFileSync(join(process.cwd(), 'public/marca/n-social.jpg'))
const nSrc = `data:image/jpeg;base64,${n.toString('base64')}`

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
          backgroundColor: '#17181f',
          padding: '72px 80px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={nSrc}
          alt=""
          width={640}
          height={640}
          style={{ position: 'absolute', top: -5, right: -40 }}
        />

        {/* Símbolo + nombre: la misma firma que la barra y el pie de la web */}
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
              fontWeight: 600,
              color: '#f3f2ef',
              letterSpacing: '-0.035em',
            }}
          >
            NeumorStudio
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 60,
              fontWeight: 700,
              color: '#f3f2ef',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              maxWidth: 680,
            }}
          >
            Montamos el software que tu negocio todavía hace a mano
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 25,
              color: '#afaeb9',
              marginTop: 28,
              maxWidth: 640,
              lineHeight: 1.4,
            }}
          >
            Reservas, gestión, captación de clientes y atención automática.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', width: 56, height: 4, backgroundColor: '#e8e6e1' }} />
          <span style={{ fontSize: 22, color: '#afaeb9', marginLeft: 20 }}>
            neumorstudio.com
          </span>
        </div>
      </div>
    ),
    size
  )
}
