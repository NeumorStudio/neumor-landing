'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { N_FORMA } from './n-forma'
import { N_COLOR } from './n-color'

/**
 * La pantalla de carga: la n se dibuja en color, cae el punto ámbar y la web
 * se abre desde él, como un eclipse. El punto se convierte en un anillo que
 * crece y deja ver la portada, que ya está pintada debajo.
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

/** Se emite cuando la portada debe empezar a entrar, por debajo de la capa. */
export const EVENTO_INTRO = 'ns:intro-abre'
/** Se emite cuando la web ya está abierta del todo y la capa se ha ido. */
export const EVENTO_INTRO_FIN = 'ns:intro-fin'

export function introActiva() {
  return document.documentElement.classList.contains('con-intro')
}

// El dibujo de la n y la caída del punto acaban hacia los 1,25 s desde que
// empieza a cargar la página.
const DIBUJO_MS = 1300
// La portada empieza a entrar un poco antes de abrir, bajo la capa: así el
// agujero ya la encuentra pintada y no hay un momento de pantalla vacía.
const ANTICIPO_MS = 380

export function Intro() {
  const capa = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const html = document.documentElement
    const el = capa.current
    if (!el || !html.classList.contains('con-intro')) return
    try { sessionStorage.setItem('ns-intro', '1') } catch {}

    let abierta = false
    let avisada = false
    let tl: gsap.core.Timeline | null = null

    const avisar = () => {
      if (avisada) return
      avisada = true
      window.dispatchEvent(new Event(EVENTO_INTRO))
    }

    const abrir = () => {
      if (abierta) return
      abierta = true
      quitarAtajos()
      avisar()

      // El agujero nace del tamaño del punto y crece hasta la esquina más
      // lejana de la pantalla. El anillo ámbar va en su borde. Se mide sobre
      // la n y no sobre el punto, que puede estar aún cayendo.
      const punto = el.querySelector<SVGCircleElement>('.intro-punto')
      const n = el.querySelector('.intro-n')?.getBoundingClientRect()
      const [vx, vy, vw] = N_FORMA.vista.split(' ').map(Number)
      const escala = n ? n.width / vw : 0
      const x = n ? n.left + (N_FORMA.punto.cx - vx) * escala : innerWidth / 2
      const y = n ? n.top + (N_FORMA.punto.cy - vy) * escala : innerHeight / 2
      const r0 = N_FORMA.punto.r * 1.15 * escala
      const radio = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 120
      el.style.setProperty('--cx', `${x}px`)
      el.style.setProperty('--cy', `${y}px`)

      tl = gsap.timeline({
        onComplete: () => {
          html.classList.remove('con-intro')
          window.dispatchEvent(new Event(EVENTO_INTRO_FIN))
        },
      })
        // El punto se hincha un poco, como si cogiera aire, y se abre.
        .to(punto, { attr: { r: N_FORMA.punto.r * 1.15 }, duration: 0.16, ease: 'power2.out' }, 0)
        .to(['.intro-trazo', '.intro-nombre'], { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.08)
        .set('.intro-anillo', { opacity: 1 }, 0.16)
        .fromTo(el, { '--r': `${r0}px` }, { '--r': `${radio}px`, duration: 1, ease: 'power3.inOut' }, 0.16)
        .to('.intro-anillo', { opacity: 0, duration: 0.35, ease: 'power1.in' }, 0.8)
    }

    const atajos = ['pointerdown', 'wheel', 'touchstart', 'keydown'] as const
    const quitarAtajos = () => atajos.forEach((t) => window.removeEventListener(t, abrir))
    atajos.forEach((t) => window.addEventListener(t, abrir, { passive: true }))

    const falta = Math.max(0, DIBUJO_MS - performance.now())
    const aviso = window.setTimeout(avisar, Math.max(0, falta - ANTICIPO_MS))
    const reloj = window.setTimeout(abrir, falta)

    return () => {
      window.clearTimeout(aviso)
      window.clearTimeout(reloj)
      quitarAtajos()
      tl?.kill()
    }
  }, [])

  return (
    <div ref={capa} className="intro" aria-hidden="true">
      <div className="intro-capa">
        <div className="intro-marca">
          <div className="intro-simbolo">
            <svg viewBox={N_FORMA.vista} className="intro-n">
              <defs>
                <linearGradient
                  id="intro-color"
                  gradientUnits="userSpaceOnUse"
                  x1={N_COLOR.desde.x}
                  y1={N_COLOR.desde.y}
                  x2={N_COLOR.hacia.x}
                  y2={N_COLOR.hacia.y}
                >
                  {N_COLOR.paradas.map(([t, c]) => <stop key={t} offset={t} stopColor={c} />)}
                </linearGradient>
                {/* El trazo del arco hace de máscara: va descubriendo la n
                    rellena de una pata a la otra, y lo que queda es el logo
                    exacto. */}
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
              </defs>
              <path className="intro-trazo" d={N_FORMA.n} fill="url(#intro-color)" mask="url(#intro-mascara)" />
              <circle className="intro-punto" cx={N_FORMA.punto.cx} cy={N_FORMA.punto.cy} r={N_FORMA.punto.r} />
            </svg>
          </div>
          <span className="intro-nombre"><span>NeumorStudio</span></span>
        </div>
      </div>
      <div className="intro-anillo" />
    </div>
  )
}
