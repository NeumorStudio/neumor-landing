'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * El antes y el después de una web rehecha.
 *
 * El antes es una captura de la web vieja; el después puede ser otra captura o
 * —con `vivo`— la web de verdad dentro de un iframe. Un tirador las va
 * descubriendo. Lo que lo separa de un comparador cualquiera es que al
 * arrastrar no solo cambian los píxeles: las cifras de abajo suben con el
 * tirador. La mejora se mide, no se intuye — y son cifras reales.
 *
 * Con `vivo` hay dos detalles que no son opcionales:
 *
 * 1. El recorte del antes se hace con `clip-path`, que recorta también el
 *    hit-testing. Por eso la mitad izquierda intercepta el ratón (y se puede
 *    arrastrar desde ella) mientras la derecha deja pasar los eventos al
 *    iframe, que queda vivo: se le hace scroll y se navega por dentro.
 * 2. Mientras se arrastra hay que apagarle los punteros al iframe. Un iframe de
 *    otro dominio se traga los `pointermove` y el tirador se quedaría clavado
 *    en cuanto el cursor lo pisara.
 *
 * El iframe se pinta a 1440 px y se escala al ancho del marco en vez de
 * dejarlo fluido: así el después sale con la misma maqueta de escritorio que
 * el antes. A ancho de móvil saldría la versión móvil y la comparación
 * halagaría a la nueva sin merecerlo — que es justo lo que se quiere evitar.
 *
 * Se maneja con el ratón, con el dedo y con el teclado (flechas, Inicio y Fin),
 * porque es un `slider` de verdad y no un adorno.
 */

export type Cifra = { etiqueta: string; antes: number; despues: number; sufijo?: string }

const REDONDEO = (v: number) => Math.round(v)

/** El ancho al que se pinta la web viva antes de escalarla. Con el alto de la
 *  captura (1600×1000) da exactamente la misma proporción, así que el iframe
 *  encaja clavado en el hueco sin recortes ni bandas. */
const ANCHO_VIVO = 1440
const ALTO_VIVO = ANCHO_VIVO * (1000 / 1600)

export function AntesYDespues({
  antes,
  despues,
  altAntes,
  altDespues,
  cifras = [],
  inicial = 50,
  vivo,
  barra,
}: {
  antes: string
  despues: string
  altAntes: string
  altDespues: string
  cifras?: Cifra[]
  inicial?: number
  /** URL de la web real. Si se pasa, el lado del después es la web en vivo y
   *  `despues` se queda de fondo mientras carga. */
  vivo?: string
  /** Barra tipo navegador sobre el marco. Es el asidero: dentro del iframe los
   *  enlaces navegan por la web del cliente y sin esto no hay salida visible. */
  barra?: { dominio: string; href: string }
}) {
  const [pos, setPos] = useState(inicial)
  const [arrastrando, setArrastrando] = useState(false)
  const [escala, setEscala] = useState(0)
  const marco = useRef<HTMLDivElement>(null)

  const mover = useCallback((clienteX: number) => {
    const caja = marco.current?.getBoundingClientRect()
    if (!caja) return
    const p = ((clienteX - caja.left) / caja.width) * 100
    setPos(Math.min(100, Math.max(0, p)))
  }, [])

  // El puntero se sigue a nivel de documento: si se sale del marco mientras
  // arrastra, el tirador no se queda clavado a mitad de camino.
  useEffect(() => {
    if (!arrastrando) return
    const alMover = (e: PointerEvent) => mover(e.clientX)
    const alSoltar = () => setArrastrando(false)
    document.addEventListener('pointermove', alMover)
    document.addEventListener('pointerup', alSoltar)
    document.addEventListener('pointercancel', alSoltar)
    return () => {
      document.removeEventListener('pointermove', alMover)
      document.removeEventListener('pointerup', alSoltar)
      document.removeEventListener('pointercancel', alSoltar)
    }
  }, [arrastrando, mover])

  // El iframe se pinta a tamaño fijo y se encoge hasta el ancho real del marco.
  useLayoutEffect(() => {
    if (!vivo) return
    const caja = marco.current
    if (!caja) return
    const medir = () => setEscala(caja.getBoundingClientRect().width / ANCHO_VIVO)
    medir()
    const ojo = new ResizeObserver(medir)
    ojo.observe(caja)
    return () => ojo.disconnect()
  }, [vivo])

  const teclado = (e: React.KeyboardEvent) => {
    const salto = e.shiftKey ? 10 : 2
    if (e.key === 'ArrowLeft') { setPos((p) => Math.max(0, p - salto)); e.preventDefault() }
    if (e.key === 'ArrowRight') { setPos((p) => Math.min(100, p + salto)); e.preventDefault() }
    if (e.key === 'Home') { setPos(0); e.preventDefault() }
    if (e.key === 'End') { setPos(100); e.preventDefault() }
  }

  // `pos` es dónde está la línea, y a su IZQUIERDA queda el antes. Así que con
  // el tirador al 0 % no se ve nada de la web vieja y todo es la nueva: las
  // cifras tienen que ir al revés que la posición, o marcan lo contrario de lo
  // que se está viendo.
  const t = 1 - pos / 100

  // Sin `vivo` no hay nada que respetar debajo y se puede arrastrar desde
  // cualquier punto del marco, como toda la vida.
  const arrastreEnTodoElMarco = vivo
    ? undefined
    : (e: React.PointerEvent) => { setArrastrando(true); mover(e.clientX) }

  return (
    <div>
      <div className="ng-video-card overflow-hidden">
        {barra && (
          <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--edge-border)] bg-[var(--bg-deep)]">
            <span className="flex gap-1.5" aria-hidden>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink-soft)] opacity-30" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink-soft)] opacity-30" />
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink-soft)] opacity-30" />
            </span>
            <span className="flex-1 truncate font-mono text-xs text-[var(--ink-soft)]">
              {barra.dominio}
            </span>
            <a href={barra.href} target="_blank" rel="noopener noreferrer"
               className="shrink-0 font-mono text-xs text-[var(--accent)] hover:underline underline-offset-4">
              Abrir ↗
            </a>
          </div>
        )}

        <div
          ref={marco}
          className={`relative overflow-hidden select-none ${vivo ? '' : 'cursor-ew-resize'}`}
          onPointerDown={arrastreEnTodoElMarco}
        >
          {/* El después va debajo y entero; el antes se recorta por encima. Así
              la imagen que se descubre no se deforma al mover el tirador.
              Con `vivo` esta captura solo se ve el instante que tarda la web en
              pintar dentro del iframe: evita el fogonazo en blanco. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={despues} alt={altDespues} width={1600} height={1000}
               loading="lazy" className="block w-full h-auto" draggable={false} />

          {vivo && escala > 0 && (
            <div
              className="absolute inset-0 overflow-hidden"
              // Un iframe de otro dominio se come los `pointermove`: si no se
              // apaga mientras se arrastra, el tirador se queda clavado en
              // cuanto el cursor lo pisa.
              style={{ pointerEvents: arrastrando ? 'none' : 'auto' }}
            >
              <iframe
                src={vivo}
                title={altDespues}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-popups"
                className="block border-0 bg-white"
                style={{
                  width: ANCHO_VIVO,
                  height: ALTO_VIVO,
                  transform: `scale(${escala})`,
                  transformOrigin: 'top left',
                }}
              />
            </div>
          )}

          {/* Encima del iframe, y por eso mismo el que recibe el ratón en su
              mitad: `clip-path` recorta también el hit-testing, así que a la
              derecha de la línea los eventos caen en la web viva. */}
          <div
            className={`absolute inset-0 overflow-hidden ${vivo ? 'cursor-ew-resize' : ''}`}
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            onPointerDown={vivo ? (e) => { setArrastrando(true); mover(e.clientX) } : undefined}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={antes} alt={altAntes} width={1600} height={1000}
                 loading="lazy" className="block w-full h-auto" draggable={false} />
          </div>

          {/* Las etiquetas se apagan cuando su lado casi no se ve, para que no
              queden flotando sobre la mitad contraria. */}
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 ng-badge text-[0.6rem] sm:text-xs pointer-events-none transition-opacity duration-200"
                style={{ opacity: pos < 14 ? 0 : 1 }}>Antes</span>
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 ng-badge text-[0.6rem] sm:text-xs pointer-events-none transition-opacity duration-200"
                style={{ opacity: pos > 86 ? 0 : 1 }}>
            {vivo ? 'Ahora, en vivo' : 'Después'}
          </span>

          <div className="absolute inset-y-0 pointer-events-none"
               style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
            <div className="w-px h-full bg-white/70 mx-auto" />
          </div>

          <button
            type="button"
            role="slider"
            aria-label="Comparar la web antes y después"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={REDONDEO(pos)}
            aria-valuetext={`${REDONDEO(pos)} % de la web anterior a la vista`}
            onKeyDown={teclado}
            onPointerDown={(e) => { e.stopPropagation(); setArrastrando(true) }}
            className="ng-raised absolute top-1/2 grid place-items-center w-9 h-9 sm:w-11 sm:h-11 rounded-full cursor-ew-resize"
            style={{ left: `${pos}%`, transform: 'translate(-50%,-50%)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l-6 7 6 7M15 5l6 7-6 7" />
            </svg>
          </button>
        </div>
      </div>

      {cifras.length > 0 && (
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          {cifras.map((c) => {
            const valor = REDONDEO(c.antes + (c.despues - c.antes) * t)
            return (
              <div key={c.etiqueta} className="ng-card px-4 py-3 text-center">
                <dd className="font-display text-2xl font-bold tabular-nums">
                  {valor}{c.sufijo ?? ''}
                </dd>
                <dt className="font-mono text-[0.7rem] text-[var(--ink-soft)] mt-0.5">
                  {c.etiqueta}
                </dt>
              </div>
            )
          })}
        </dl>
      )}
    </div>
  )
}
