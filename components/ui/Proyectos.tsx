'use client'

import { useState } from 'react'
import { AgendaQueSeLlena } from '@/components/ui/AgendaQueSeLlena'
import { AntesYDespues } from '@/components/ui/AntesYDespues'
import { proyectos, regaladoCifras, type Proyecto } from '@/lib/content/proyectos'

/**
 * Los proyectos, con selector.
 *
 * Antes iban apilados y la sección crecía hacia abajo con cada encargo nuevo.
 * Ahora hay una fila de placas —una por proyecto, con su naturaleza debajo— y
 * un solo panel que pinta el elegido: con dos proyectos ocupa lo mismo que con
 * doce. De paso, la variedad de trabajos deja de ser un problema de longitud y
 * pasa a leerse de un vistazo en la fila.
 *
 * Es una botonera de pestañas de verdad, con sus roles y su navegación por
 * flechas, no un puñado de divs que cambian de color.
 */

function Placa({
  proyecto, activa, onClick, id, controla,
}: {
  proyecto: Proyecto; activa: boolean; onClick: () => void; id: string; controla: string
}) {
  return (
    <button
      type="button"
      role="tab"
      id={id}
      aria-selected={activa}
      aria-controls={controla}
      tabIndex={activa ? 0 : -1}
      onClick={onClick}
      /* `ng-raised` sale en relieve; la activa se hunde con la misma sombra
         interior que usa el sistema al pulsar, para que se lea como una tecla
         que se queda dentro y no como un simple cambio de color. */
      className={`ng-raised ng-placa shrink-0 leading-tight transition-transform ${
        activa ? 'ng-placa-activa' : ''
      }`}
    >
      <span className="block font-display font-bold text-[0.95rem]">{proyecto.nombre}</span>
      <span className="block text-[0.7rem] text-[var(--ink-soft)]">
        {proyecto.naturaleza}
      </span>
    </button>
  )
}

export function Proyectos() {
  const [activo, setActivo] = useState(0)
  const p = proyectos[activo]

  const porTeclado = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const paso = e.key === 'ArrowRight' ? 1 : -1
    const siguiente = (activo + paso + proyectos.length) % proyectos.length
    setActivo(siguiente)
    document.getElementById(`placa-${proyectos[siguiente].id}`)?.focus()
  }

  return (
    <>
      {/* En pantallas estrechas la fila se desplaza de lado en vez de partirse:
          con seis o siete proyectos, envolverla dejaría el panel bailando. */}
      <div
        role="tablist"
        aria-label="Proyectos"
        onKeyDown={porTeclado}
        className="reveal flex gap-3 overflow-x-auto pb-2 mb-8 -mx-2 px-2 scroll-px-2 snap-x"
      >
        {proyectos.map((proyecto, i) => (
          <div key={proyecto.id} className="snap-start">
            <Placa
              proyecto={proyecto}
              activa={i === activo}
              onClick={() => setActivo(i)}
              id={`placa-${proyecto.id}`}
              controla={`panel-${proyecto.id}`}
            />
          </div>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${p.id}`}
        aria-labelledby={`placa-${p.id}`}
        /* La `key` fuerza a React a montar el panel de nuevo al cambiar de
           proyecto: así la animación de entrada se repite y el iframe de un
           proyecto no se queda vivo por detrás cuando se mira otro. */
        key={p.id}
        className="ng-card p-6 md:p-10 ng-panel-entra"
      >
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="ng-badge text-emerald-600 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            En producción
          </span>
          <span className="ng-badge text-[var(--ink-soft)]">{p.naturaleza}</span>
          {p.insignias.map((i) => (
            <span key={i} className="ng-badge text-[var(--ink-soft)]">{i}</span>
          ))}
        </div>

        <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3">
          {p.titulo}
        </h3>
        <p className="text-[var(--ink-soft)] max-w-2xl mb-8">{p.entradilla}</p>

        {p.pieza === 'agenda-salonio' && (
          <div className="mb-10"><AgendaQueSeLlena /></div>
        )}

        {p.pieza === 'antes-despues-regalado' && (
          <div className="mb-10">
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
          <div className="grid gap-6 md:grid-cols-[2fr_1fr] items-center justify-items-center mb-10">
            {p.capturas.map((c) => (
              <figure key={c.src} className={c.estrecha ? 'w-full max-w-[240px]' : undefined}>
                <div className="ng-video-card overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt={c.alt} width={c.ancho} height={c.alto}
                       loading="lazy" className="w-full h-auto" />
                </div>
                <figcaption className="font-mono text-xs text-[var(--ink-soft)] mt-3 text-center">
                  {c.pie}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {p.funciones.map((f) => (
            <div key={f.title}>
              <h4 className="font-semibold text-sm mb-1">{f.title}</h4>
              <p className="text-sm text-[var(--ink-soft)]">{f.copy}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8">
          <span className="text-sm text-[var(--ink-soft)] mr-1">Construido con:</span>
          {p.stack.map((t) => (
            <span key={t} className="ng-raised px-4 py-2 text-sm cursor-default">{t}</span>
          ))}
        </div>

        <a href={p.enlace.href} target="_blank" rel="noopener noreferrer"
           className="ng-btn-primary inline-flex">
          {p.enlace.texto}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </>
  )
}
