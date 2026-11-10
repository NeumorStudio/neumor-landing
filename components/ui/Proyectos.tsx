'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AntesYDespues } from '@/components/ui/AntesYDespues'
import { EscenarioCaso } from '@/components/ui/EscenarioCaso'
import { proyectos, regaladoCifras } from '@/lib/content/proyectos'

/**
 * Los proyectos, presentados como casos.
 *
 * Un solo panel que pinta el elegido, así la sección mide lo mismo con dos
 * proyectos que con doce. Encima, la barra del caso: el número grande, el
 * selector con su pastilla que se desliza al elegido y las flechas.
 *
 * Al cambiar de caso, el panel sale de lado con un giro corto en 3D, en el
 * sentido en que se avanza, y lo de dentro entra en cascada. Es la misma
 * gramática que el resto de la web: las cosas llegan desde la profundidad,
 * no aparecen de golpe.
 *
 * El selector es una botonera de pestañas de verdad, con sus roles y su
 * navegación por flechas, no un puñado de divs que cambian de color.
 */

const dosCifras = (n: number) => String(n).padStart(2, '0')

export function Proyectos() {
  const [activo, setActivo] = useState(0)
  // Hacia dónde se avanzó por última vez. Vacío en la primera pintada: el
  // panel inicial entra con el scroll, no con la animación de cambio.
  const [sentido, setSentido] = useState<'' | 'sig' | 'ant'>('')
  const selector = useRef<HTMLDivElement>(null)
  const caja = useRef<HTMLDivElement>(null)
  const p = proyectos[activo]

  const ir = (i: number, enfocar = false) => {
    const destino = (i + proyectos.length) % proyectos.length
    if (destino === activo) return
    setSentido(destino > activo ? 'sig' : 'ant')
    setActivo(destino)
    if (enfocar) document.getElementById(`placa-${proyectos[destino].id}`)?.focus()
  }

  const porTeclado = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    ir(activo + (e.key === 'ArrowRight' ? 1 : -1), true)
  }

  // La pastilla del selector se coloca bajo la pestaña elegida. Se mide en vez
  // de suponer anchos: cada pestaña mide lo que mide su nombre.
  useLayoutEffect(() => {
    const fila = selector.current
    const pestana = fila?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!fila || !pestana) return
    const colocar = () => {
      fila.style.setProperty('--x', `${pestana.offsetLeft}px`)
      fila.style.setProperty('--w', `${pestana.offsetWidth}px`)
    }
    colocar()
    const ro = new ResizeObserver(colocar)
    ro.observe(fila)
    return () => ro.disconnect()
  }, [activo])

  // Cada caso mide distinto. Cuando cambia el alto, lo que viene debajo (el
  // recorrido de los pasos) se mueve, y sus disparadores de scroll tienen que
  // volver a medirse o se encenderían a destiempo.
  useEffect(() => {
    const el = caja.current
    if (!el) return
    let alto = el.offsetHeight
    let espera = 0
    const ro = new ResizeObserver(() => {
      if (el.offsetHeight === alto) return
      alto = el.offsetHeight
      window.clearTimeout(espera)
      espera = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    ro.observe(el)
    return () => { ro.disconnect(); window.clearTimeout(espera) }
  }, [])

  const dominio = new URL(p.enlace.href).hostname

  return (
    <div ref={caja} className="casos reveal">
      <div className="casos-barra">
        <p className="casos-contador" aria-hidden="true">
          <span key={activo} className="casos-actual">{dosCifras(activo + 1)}</span>
          <span className="casos-total">/ {dosCifras(proyectos.length)}</span>
        </p>

        {/* En pantallas estrechas el selector se desplaza de lado en vez de
            partirse: con seis o siete proyectos, envolverlo dejaría el panel
            bailando. */}
        <div
          ref={selector}
          role="tablist"
          aria-label="Proyectos"
          onKeyDown={porTeclado}
          className="casos-selector"
        >
          <span className="casos-pastilla" aria-hidden="true" />
          {proyectos.map((proyecto, i) => (
            <button
              key={proyecto.id}
              type="button"
              role="tab"
              id={`placa-${proyecto.id}`}
              aria-selected={i === activo}
              aria-controls={`panel-${proyecto.id}`}
              tabIndex={i === activo ? 0 : -1}
              onClick={() => ir(i)}
              className="casos-pestana"
            >
              <span className="casos-pestana-nombre">{proyecto.nombre}</span>
              <span className="casos-pestana-tipo">{proyecto.naturaleza}</span>
            </button>
          ))}
        </div>

        <div className="casos-flechas">
          <button type="button" className="casos-flecha ng-raised" onClick={() => ir(activo - 1)} aria-label="Proyecto anterior">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button type="button" className="casos-flecha ng-raised" onClick={() => ir(activo + 1)} aria-label="Proyecto siguiente">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${p.id}`}
        aria-labelledby={`placa-${p.id}`}
        /* La `key` monta el panel de nuevo al cambiar de proyecto: así la
           entrada se repite y el iframe de un proyecto no se queda vivo por
           detrás cuando se mira otro. */
        key={p.id}
        data-sentido={sentido || undefined}
        className="caso ng-card"
      >
        <header className="caso-cabecera" style={{ '--i': 0 } as React.CSSProperties}>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* El punto de la n se posa aquí y toma el color del proyecto. */}
            <span className="ng-badge">
              <span
                className="caso-punto punto-hueco"
                data-punto=""
                data-punto-color={p.color}
                style={{ '--punto-color': p.color } as React.CSSProperties}
                aria-hidden="true"
              />
              En producción
            </span>
            <span className="ng-badge text-[var(--ink-soft)]">{p.naturaleza}</span>
            {p.insignias.map((i) => (
              <span key={i} className="ng-badge text-[var(--ink-soft)]">{i}</span>
            ))}
          </div>
          <h3 className="font-display text-2xl md:text-4xl font-semibold mb-3 text-balance">
            {p.titulo}
          </h3>
          <p className="text-[var(--ink-soft)] md:text-lg max-w-2xl">{p.entradilla}</p>
        </header>

        {p.pieza === 'antes-despues-regalado' && (
          <div className="caso-bloque" style={{ '--i': 1 } as React.CSSProperties}>
            {/* El después no es una captura: es la web de verdad dentro del
                comparador. Se le hace scroll y se navega por dentro; el antes,
                a la izquierda de la línea, sigue siendo la web vieja. */}
            <AntesYDespues
              antes="/images/regalado-antes.webp"
              despues="/images/regalado-despues.webp"
              altAntes="La web anterior: una sola pantalla con un retrato y un párrafo"
              altDespues="La web actual de González-Regalado Gourmet"
              cifras={regaladoCifras}
              vivo="https://regaladogourmet.com/es/"
              barra={{ dominio: 'regaladogourmet.com', href: 'https://regaladogourmet.com' }}
            />
            <p className="font-mono text-xs text-[var(--ink-soft)] mt-4 text-center">
              Arrastra para comparar — a la derecha, la web en vivo
            </p>
          </div>
        )}

        {p.capturas && p.capturas.length > 0 && (
          <div className="caso-bloque" style={{ '--i': 2 } as React.CSSProperties}>
            <EscenarioCaso capturas={p.capturas} dominio={dominio} />
          </div>
        )}

        <ol className="caso-funciones" style={{ '--i': 3 } as React.CSSProperties}>
          {p.funciones.map((f, i) => (
            <li key={f.title} style={{ '--j': i } as React.CSSProperties}>
              <span className="caso-num" aria-hidden="true">{dosCifras(i + 1)}</span>
              <h4 className="font-semibold mb-1">{f.title}</h4>
              <p className="text-sm text-[var(--ink-soft)]">{f.copy}</p>
            </li>
          ))}
        </ol>

        <footer className="caso-pie" style={{ '--i': 4 } as React.CSSProperties}>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-sm text-[var(--ink-soft)] mr-1">Construido con:</span>
            {p.stack.map((t) => (
              <span key={t} className="ng-raised px-3.5 py-1.5 text-sm cursor-default">{t}</span>
            ))}
          </div>
          <a href={p.enlace.href} target="_blank" rel="noopener noreferrer" className="ng-btn-primary inline-flex shrink-0">
            {p.enlace.texto}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  )
}
