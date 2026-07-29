'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

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
 * Rendimiento: la animación solo corre mientras el bloque está en pantalla, y
 * no arranca si el usuario ha pedido menos movimiento.
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

export function AgendaQueSeLlena() {
  const raiz = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const el = raiz.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Estado final: la agenda llena. Se entiende igual, sin movimiento.
      gsap.set(el.querySelectorAll('.hueco-lleno'), { opacity: 1, scale: 1 })
      gsap.set(el.querySelector('.contador'), { textContent: '6' })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true })

      tl.set('.hueco-lleno', { opacity: 0, scale: 0.9, transformOrigin: 'center' })
        .set('.marca-ok', { opacity: 0, scale: 0.4, transformOrigin: 'center' })
        .set('.contador', { textContent: '0' })

      HUECOS.forEach((_, i) => {
        tl.to(`.hueco-lleno-${i}`, { opacity: 1, scale: 1, duration: 0.34, ease: 'back.out(2)' }, i * 0.42)
          .to(`.marca-ok-${i}`, { opacity: 1, scale: 1, duration: 0.26, ease: 'back.out(3)' }, i * 0.42 + 0.14)
          .to('.contador', {
            duration: 0.3,
            snap: { textContent: 1 },
            textContent: String(i + 1),
          }, i * 0.42 + 0.1)
      })

      // Solo se anima mientras se ve: fuera de pantalla no tiene sentido gastar.
      const obs = new IntersectionObserver(
        ([e]) => (e.isIntersecting ? tl.play() : tl.pause()),
        { threshold: 0.25 }
      )
      obs.observe(el)
      return () => obs.disconnect()
    }, el)

    return () => ctx.revert()
  }, [])

  const anchoTotal = ANCHO * 3 + SEP_X * 2
  const altoTotal = ALTO * 2 + SEP_Y + 44

  return (
    <svg
      ref={raiz}
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
        className="contador fill-[var(--accent)]"
        style={{ fontSize: 16, fontWeight: 700, fontFamily: 'var(--font-geist-mono), monospace' }}
      >
        0
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
            <g className={`hueco-lleno hueco-lleno-${i}`}>
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
                className={`marca-ok marca-ok-${i} stroke-[var(--accent)]`}
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
