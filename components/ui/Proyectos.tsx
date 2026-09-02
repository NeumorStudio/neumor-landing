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
 *
 * Todos los paneles están en el marcado; los que no tocan van con `hidden`.
 * Esto no es un detalle: antes se renderizaba solo `proyectos[activo]`, así que
 * el segundo proyecto no existía en el HTML. Ni para un buscador, que no pulsa
 * pestañas y por tanto nunca vio el caso de González-Regalado, ni para quien
 * usa la búsqueda del navegador. Contenido oculto con `hidden` sí se indexa;
 * contenido que no está en el árbol, no.
 *
 * Lo que sigue montándose solo en el panel activo son las piezas caras —la
 * agenda animada y el comparador, que trae un iframe con la web en vivo—.
 * Meterlas todas a la vez cargaría en cada visita webs de proyectos que nadie
 * ha pedido ver.
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

function Panel({ p, activo }: { p: Proyecto; activo: boolean }) {
  return (
    <div
      role="tabpanel"
      id={`panel-${p.id}`}
      aria-labelledby={`placa-${p.id}`}
      hidden={!activo}
      /* El panel no empieza con un elemento focable, así que se le da parada
         propia en el tabulador: al elegir pestaña, el siguiente tabulador entra
         al contenido en vez de saltárselo entero. */
      tabIndex={0}
      className="ng-card p-6 md:p-10 ng-panel-entra"
    >
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* `emerald-600` sobre el fondo hundido de la píldora se quedaba en
            2,95:1. El tono oscuro llega a 6:1; en modo oscuro sigue el claro,
            que allí ya pasaba de sobra. */}
        <span className="ng-badge text-emerald-800 dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
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

      {/* Las piezas interactivas, solo en el panel que se está viendo. */}
      {activo && p.pieza === 'agenda-salonio' && (
        <div className="mb-10"><AgendaQueSeLlena /></div>
      )}

      {activo && p.pieza === 'antes-despues-regalado' && (
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

      {/* NOTA para decidir: este bloque contradice la regla 2 de `marca.ts`
          —"nada de contar con qué herramientas trabajamos"— que ahí está
          declarada como no negociable. Se deja tal cual hasta que se decida:
          quitarlo, o cambiar la regla. */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-sm text-[var(--ink-soft)] mr-1">Construido con:</span>
        {p.stack.map((t) => (
          <span key={t} className="ng-raised px-4 py-2 text-sm cursor-default">{t}</span>
        ))}
      </div>

      <a href={p.enlace.href} target="_blank" rel="noopener noreferrer"
         className="ng-btn-primary inline-flex">
        {p.enlace.texto}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  )
}

export function Proyectos() {
  const [activo, setActivo] = useState(0)

  const porTeclado = (e: React.KeyboardEvent) => {
    const ultimo = proyectos.length - 1
    let siguiente: number
    switch (e.key) {
      case 'ArrowRight': siguiente = (activo + 1) % proyectos.length; break
      case 'ArrowLeft': siguiente = (activo - 1 + proyectos.length) % proyectos.length; break
      case 'Home': siguiente = 0; break
      case 'End': siguiente = ultimo; break
      default: return
    }
    e.preventDefault()
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

      {proyectos.map((p, i) => (
        <Panel key={p.id} p={p} activo={i === activo} />
      ))}
    </>
  )
}
