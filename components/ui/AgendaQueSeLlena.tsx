'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

/**
 * La agenda que se llena sola.
 *
 * Sustituye a un párrafo explicando que las reservas entran sin llamadas: se ve
 * en cinco segundos y no hay que leer nada.
 *
 * Por qué SVG animado y no un vídeo:
 *  - Pesa unos pocos kilobytes en vez de megas.
 *  - Es nítido en cualquier pantalla y a cualquier tamaño.
 *  - Toma los colores del tema con `currentColor` y variables CSS, así que
 *    funciona en claro y en oscuro con una sola pieza. Un vídeo habría que
 *    generarlo dos veces.
 *  - Se puede parar. Un vídeo en bucle no se para nunca.
 *
 * Por qué ya no usa GSAP: lo único que hacía aquí era encender seis rectángulos
 * en fila y contar de cero a seis. Eso es un contador y seis transiciones CSS.
 * Era la última importación de GSAP que quedaba en el proyecto, y quitarla saca
 * la librería entera —unos 28 KB comprimidos— del paquete que descarga todo el
 * mundo al abrir la portada.
 *
 * Rendimiento: la cuenta solo avanza mientras el bloque está en pantalla, y no
 * arranca si el usuario ha pedido menos movimiento.
 */

const HUECOS = [
  { hora: '09:00', x: 0, y: 0 },
  { hora: '10:30', x: 1, y: 0 },
  { hora: '12:00', x: 2, y: 0 },
  { hora: '16:00', x: 0, y: 1 },
  { hora: '17:30', x: 1, y: 1 },
  { hora: '19:00', x: 2, y: 1 },
]

const ANCHO = 112
const ALTO = 46
const SEP_X = 12
const SEP_Y = 12

/** Lo que tardaba cada reserva en aparecer con la línea de tiempo anterior. */
const PASO_MS = 420
/** La pausa con la agenda llena antes de volver a empezar. */
const ESPERA_MS = 1600

export function AgendaQueSeLlena() {
  // Cuántos huecos están reservados ahora mismo. Es el único estado que hay.
  const [llenos, setLlenos] = useState(0)
  const [visible, setVisible] = useState(false)
  const [raiz, setRaiz] = useState<SVGSVGElement | null>(null)

  const quieto = useMenosMovimiento()
  // Sin movimiento se pinta el estado final —la agenda llena— y no se anima
  // nada. Se entiende igual, y no hace falta tocar el estado para conseguirlo.
  const mostrados = quieto ? HUECOS.length : llenos

  // Fuera de pantalla no tiene sentido gastar.
  useEffect(() => {
    if (!raiz || quieto) return
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.25 }
    )
    obs.observe(raiz)
    return () => obs.disconnect()
  }, [raiz, quieto])

  useEffect(() => {
    if (!visible || quieto) return
    // Al llegar arriba se espera con la agenda llena y se vuelve a cero.
    const espera = llenos >= HUECOS.length
    const id = setTimeout(
      () => setLlenos((n) => (n >= HUECOS.length ? 0 : n + 1)),
      espera ? ESPERA_MS : PASO_MS
    )
    return () => clearTimeout(id)
  }, [visible, quieto, llenos])

  const anchoTotal = ANCHO * 3 + SEP_X * 2
  const altoTotal = ALTO * 2 + SEP_Y + 44

  return (
    <svg
      ref={setRaiz}
      viewBox={`0 0 ${anchoTotal} ${altoTotal}`}
      className="w-full max-w-md mx-auto"
      role="img"
      aria-label="Una agenda que se va llenando sola de reservas, hasta seis citas."
    >
      {/* Cabecera: el contador de reservas */}
      <text
        x="0"
        y="18"
        className="fill-[var(--ink-soft)]"
        style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        Reservas de hoy
      </text>
      <text
        x={anchoTotal}
        y="18"
        textAnchor="end"
        className="fill-[var(--accent)]"
        style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        {mostrados}
      </text>

      {HUECOS.map((h, i) => {
        const x = h.x * (ANCHO + SEP_X)
        const y = 32 + h.y * (ALTO + SEP_Y)
        return (
          <g key={h.hora}>
            {/* Hueco vacío: el relieve hundido del neumorfismo */}
            <rect
              x={x} y={y} width={ANCHO} height={ALTO} rx="12"
              className="fill-[var(--bg-deep)] stroke-[var(--edge)]"
              strokeWidth="1"
            />
            <text
              x={x + 12} y={y + 28}
              className="fill-[var(--ink-soft)]"
              style={{ fontSize: 12, fontFamily: 'var(--font-geist-mono), monospace' }}
            >
              {h.hora}
            </text>

            {/* Hueco ocupado: aparece al reservarse */}
            <g className="hueco-lleno" data-lleno={i < mostrados || undefined}>
              <rect
                x={x} y={y} width={ANCHO} height={ALTO} rx="12"
                className="fill-[var(--accent)]"
                opacity="0.14"
              />
              <rect
                x={x} y={y} width={ANCHO} height={ALTO} rx="12"
                className="stroke-[var(--accent)]"
                fill="none"
                strokeWidth="1.5"
                opacity="0.5"
              />
              <text
                x={x + 12} y={y + 28}
                className="fill-[var(--accent)]"
                style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-geist-mono), monospace' }}
              >
                {h.hora}
              </text>
              <path
                className="marca-ok stroke-[var(--accent)]"
                d={`M ${x + ANCHO - 30} ${y + 23} l 6 6 l 12 -13`}
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        )
      })}
    </svg>
  )
}

/**
 * ¿El sistema pide menos movimiento?
 *
 * Con `useSyncExternalStore` en vez de un `useState` dentro de un `useEffect`:
 * el valor se lee en el primer render en lugar de provocar un segundo render
 * en cascada, en el servidor devuelve `false` sin tocar `window`, y si alguien
 * cambia la preferencia con la página abierta, se entera.
 *
 * Las tres funciones viven aquí fuera, no dentro del hook, y esto importa: React
 * usa la identidad de `suscribir` como dependencia de su efecto interno. Creadas
 * en cada llamada, cada render daba de baja y volvía a dar de alta el listener
 * —y este componente re-renderiza cada 420 ms mientras la agenda se llena—.
 *
 * El nombre del hook empieza por `use` porque React exige esa convención para
 * poder comprobar sus reglas; de ahí que rompa el castellano del resto.
 */
const consulta =
  typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : null

const suscribir = (avisar: () => void) => {
  consulta?.addEventListener('change', avisar)
  return () => consulta?.removeEventListener('change', avisar)
}

const leer = () => consulta?.matches ?? false
const leerEnServidor = () => false

function useMenosMovimiento() {
  return useSyncExternalStore(suscribir, leer, leerEnServidor)
}
