'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Proyecto } from '@/lib/content/proyectos'

gsap.registerPlugin(ScrollTrigger)

type Captura = NonNullable<Proyecto['capturas']>[number]

/**
 * Las capturas de un caso, montadas en escena: la web en un navegador y, por
 * delante, el móvil. Antes iban planas, una al lado de la otra, y se leían
 * como dos imágenes sueltas; así se leen como un producto.
 *
 * Tres capas de movimiento, cada una en su propio envoltorio para que no se
 * pisen las rotaciones:
 *  - `.escenario-scroll`: la escena llega girada y se endereza al entrar en
 *    pantalla. Nunca del todo: se queda con un punto de perspectiva.
 *  - `.escenario-raton`: con puntero fino, se inclina un poco hacia el ratón.
 *  - El móvil va adelantado en Z, así que al girar se separa del navegador.
 *
 * Sin JavaScript o con movimiento reducido se queda quieta en su postura final.
 */
export function EscenarioCaso({ capturas, dominio }: { capturas: Captura[]; dominio: string }) {
  const raiz = useRef<HTMLElement>(null)
  const ancha = capturas.find((c) => !c.estrecha)
  const movil = capturas.find((c) => c.estrecha)

  useEffect(() => {
    const el = raiz.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const estrecha = window.matchMedia('(max-width: 767px)').matches

    const ctx = gsap.context(() => {
      gsap.fromTo('.escenario-scroll',
        { rotationY: estrecha ? -14 : -24, rotationX: estrecha ? 10 : 16, y: 40 },
        {
          rotationY: estrecha ? -5 : -9, rotationX: estrecha ? 4 : 6, y: 0, ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'center 55%', scrub: 0.6 },
        })
    }, el)

    let quitar = () => {}
    const raton = el.querySelector<HTMLElement>('.escenario-raton')
    if (raton && window.matchMedia('(pointer: fine)').matches) {
      const rx = gsap.quickTo(raton, 'rotationX', { duration: 0.9, ease: 'power3.out' })
      const ry = gsap.quickTo(raton, 'rotationY', { duration: 0.9, ease: 'power3.out' })
      const mover = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        rx(((e.clientY - r.top) / r.height - 0.5) * -7)
        ry(((e.clientX - r.left) / r.width - 0.5) * 9)
      }
      const salir = () => { rx(0); ry(0) }
      el.addEventListener('pointermove', mover)
      el.addEventListener('pointerleave', salir)
      quitar = () => {
        el.removeEventListener('pointermove', mover)
        el.removeEventListener('pointerleave', salir)
      }
    }

    return () => { quitar(); ctx.revert() }
  }, [])

  if (!ancha) return null

  return (
    <figure ref={raiz} className="escenario">
      <div className="escenario-scroll">
        <div className="escenario-raton">
          <div className="escenario-navegador">
            <div className="escenario-barra" aria-hidden="true">
              <i /><i /><i />
              <span>{dominio}</span>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ancha.src} alt={ancha.alt} width={ancha.ancho} height={ancha.alto} loading="lazy" />
          </div>
          {movil && (
            <div className="escenario-movil">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={movil.src} alt={movil.alt} width={movil.ancho} height={movil.alto} loading="lazy" />
            </div>
          )}
        </div>
      </div>
      <figcaption className="escenario-pie">
        {capturas.map((c) => c.pie).join(' · ')}
      </figcaption>
    </figure>
  )
}
