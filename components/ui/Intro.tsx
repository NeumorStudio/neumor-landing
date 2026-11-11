'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { N_FORMA } from './n-forma'

/**
 * La pantalla de carga: la n se dibuja, cae el punto y la web se abre desde
 * él, como si el punto la destapara.
 *
 * Sale una vez por visita y nunca con movimiento reducido. Lo decide un script
 * en el <body> antes del primer pintado (ver `app/layout.tsx`), que pone
 * `con-intro` en <html>. Sin esa clase la capa no existe a la vista, así que
 * sin JavaScript no hay pantalla de carga que se quede puesta.
 *
 * El dibujo es CSS y arranca con el primer pintado, sin esperar a React. Este
 * componente solo decide cuándo abrir: cuando el dibujo ha terminado y la
 * página ya responde. Un toque, la rueda o una tecla lo adelantan. Si algo
 * falla por el camino, el CSS retira la capa solo a los 4,5 s.
 */

/** Se emite cuando la web empieza a verse, para que la portada entre a la vez. */
export const EVENTO_INTRO = 'ns:intro-abre'

export function introActiva() {
  return document.documentElement.classList.contains('con-intro')
}

// El dibujo de la n acaba hacia los 1,15 s desde que empieza a cargar la página.
const DIBUJO_MS = 1250

export function Intro() {
  const capa = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const html = document.documentElement
    const el = capa.current
    if (!el || !html.classList.contains('con-intro')) return
    try { sessionStorage.setItem('ns-intro', '1') } catch {}

    let abierta = false
    let tl: gsap.core.Timeline | null = null

    const abrir = () => {
      if (abierta) return
      abierta = true
      quitarAtajos()

      // El agujero se abre desde el centro del punto y crece hasta la esquina
      // más lejana de la pantalla.
      const punto = el.querySelector('.intro-punto')?.getBoundingClientRect()
      const x = punto ? punto.left + punto.width / 2 : innerWidth / 2
      const y = punto ? punto.top + punto.height / 2 : innerHeight / 2
      const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 120
      el.style.setProperty('--cx', `${x}px`)
      el.style.setProperty('--cy', `${y}px`)

      tl = gsap.timeline({
        onComplete: () => html.classList.remove('con-intro'),
      })
        .to(['.intro-trazo', '.intro-nombre'], { opacity: 0, duration: 0.35, ease: 'power2.in' }, 0)
        .fromTo(el, { '--r': '0px' }, { '--r': `${radio}px`, duration: 1.05, ease: 'power3.inOut' }, 0.15)
        .call(() => { window.dispatchEvent(new Event(EVENTO_INTRO)) }, [], 0.15)
    }

    const atajos = ['pointerdown', 'wheel', 'touchstart', 'keydown'] as const
    const quitarAtajos = () => atajos.forEach((t) => window.removeEventListener(t, abrir))
    atajos.forEach((t) => window.addEventListener(t, abrir, { passive: true }))

    const reloj = window.setTimeout(abrir, Math.max(0, DIBUJO_MS - performance.now()))

    return () => {
      window.clearTimeout(reloj)
      quitarAtajos()
      tl?.kill()
    }
  }, [])

  return (
    <div ref={capa} className="intro-capa" aria-hidden="true">
      <div className="intro-marca">
        <div className="intro-simbolo">
          <svg viewBox={N_FORMA.vista} className="intro-n">
            {/* El trazo del arco hace de máscara: va descubriendo la n rellena
                de una pata a la otra, y lo que queda es el logo exacto. */}
            <mask id="intro-mascara" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
              <path
                className="intro-arco"
                d={N_FORMA.arco}
                pathLength={1}
                fill="none"
                stroke="#fff"
                strokeWidth={N_FORMA.trazo + 4}
                strokeLinecap="square"
              />
            </mask>
            <path className="intro-trazo" d={N_FORMA.n} fill="currentColor" mask="url(#intro-mascara)" />
            <circle className="intro-punto" cx={N_FORMA.punto.cx} cy={N_FORMA.punto.cy} r={N_FORMA.punto.r} />
          </svg>
        </div>
        <span className="intro-nombre"><span>NeumorStudio</span></span>
      </div>
    </div>
  )
}
