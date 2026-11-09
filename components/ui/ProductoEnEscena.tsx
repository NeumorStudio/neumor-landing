'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

gsap.registerPlugin(ScrollTrigger)

export type Pantalla = 'web' | 'panel' | 'clientes' | 'campanas' | 'automatizacion'
export type FuncionProducto = { title: string; copy: string; pantalla: Pantalla }

/**
 * Lo que construimos, contado con el scroll.
 *
 * A un lado, la lista de lo que incluye el producto; al otro, un navegador
 * fijo. Al bajar, la función que pasa por la altura de lectura se enciende y
 * la pantalla del navegador cambia a la suya. Es el mismo gesto que el
 * recorrido de los pasos: la luz llega, la cosa se enciende.
 *
 * Las pantallas son ilustraciones dibujadas con CSS, no capturas: enseñan qué
 * hace cada pieza sin hacer pasar por real un panel inventado. Van siempre en
 * oscuro, como la cara de la marca, y se escalan con el ancho del marco
 * (unidades cqw), así que se ven igual en móvil que en escritorio.
 *
 * Sin JavaScript se ve la lista completa y la primera pantalla.
 */

const dosCifras = (n: number) => String(n).padStart(2, '0')

export function ProductoEnEscena({ funciones }: { funciones: FuncionProducto[] }) {
  const [activa, setActiva] = useState(0)
  const raiz = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = raiz.current
    if (!el) return
    el.classList.add('vivo')
    // La línea de lectura. En escritorio, el centro de la pantalla, donde
    // está el navegador. En móvil el navegador va fijo arriba, así que la
    // línea se pone justo debajo de él más el alto de una función: la que
    // está encendida nunca queda tapada por el marco, sea cual sea la
    // altura de la pantalla. Se recalcula en cada refresh de ScrollTrigger.
    const visual = el.querySelector<HTMLElement>('.pe-visual')
    const linea = () => {
      if (!visual || window.matchMedia('(min-width: 1024px)').matches) return innerHeight / 2
      const bajoMarco = (parseFloat(getComputedStyle(visual).top) || 0) + visual.offsetHeight
      const alto = el.querySelector<HTMLElement>('.pe-funcion')?.offsetHeight ?? 0
      return Math.min(bajoMarco + alto + 12, innerHeight - 40)
    }
    const disparadores = Array.from(el.querySelectorAll<HTMLElement>('.pe-funcion')).map((item, i) =>
      ScrollTrigger.create({
        trigger: item,
        start: () => `top ${linea()}px`,
        end: () => `bottom ${linea()}px`,
        onToggle: (self) => { if (self.isActive) setActiva(i) },
      }))
    return () => {
      disparadores.forEach((d) => d.kill())
      el.classList.remove('vivo')
    }
  }, [])

  const actual = funciones[activa].pantalla

  return (
    <div ref={raiz} className="pe">
      <div className="pe-visual" aria-hidden="true">
        <div className="pe-marco">
          <div className="escenario-barra">
            <i /><i /><i />
            <span>tunegocio.com</span>
          </div>
          <div className="pe-pantalla">
            <PantallaWeb activa={actual === 'web'} />
            <PantallaPanel activa={actual === 'panel'} />
            <PantallaClientes activa={actual === 'clientes'} />
            <PantallaCampanas activa={actual === 'campanas'} />
            <PantallaAutomatizacion activa={actual === 'automatizacion'} />
          </div>
        </div>
        <div className="pe-indice">
          {funciones.map((f, i) => (
            <span key={f.title} className={i === activa ? 'activo' : undefined} />
          ))}
        </div>
      </div>

      <ol className="pe-lista">
        {funciones.map((f, i) => (
          <li key={f.title} className={`pe-funcion${i === activa ? ' activa' : ''}`}>
            <span className="pe-num">{dosCifras(i + 1)}</span>
            <h4 className="pe-titulo">{f.title}</h4>
            <p className="pe-texto">{f.copy}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

const clase = (base: string, activa: boolean) => `pe-p ${base}${activa ? ' activa' : ''}`

/** La web pública: un cursor pulsa «Reservar» y entra el aviso de la reserva. */
function PantallaWeb({ activa }: { activa: boolean }) {
  return (
    <div className={clase('pe-web', activa)}>
      <div className="pew-nav">
        <b className="pe-logo" />
        <i /><i /><i />
        <span className="pew-mini" />
      </div>
      <div className="pew-hero">
        <div className="pew-texto">
          <i className="pe-barra pe-grande" style={{ width: '82%' }} />
          <i className="pe-barra pe-grande" style={{ width: '64%' }} />
          <i className="pe-barra" style={{ width: '90%' }} />
          <i className="pe-barra" style={{ width: '70%' }} />
          <div className="pew-botones">
            <span className="pew-boton">Reservar</span>
            <span className="pew-boton pew-fantasma" />
          </div>
        </div>
        <div className="pew-imagen" />
      </div>
      <span className="pe-cursor" />
      <div className="pe-aviso"><b />Nueva reserva · 17:30</div>
    </div>
  )
}

/** El panel: menú lateral, tres tarjetas, una gráfica que crece y la tabla. */
function PantallaPanel({ activa }: { activa: boolean }) {
  const alturas = [38, 52, 44, 66, 58, 74, 62, 80, 70, 88, 76, 94]
  return (
    <div className={clase('pe-panel', activa)}>
      <aside className="pep-lado">
        <b className="pe-logo" />
        <i className="activo" /><i /><i /><i /><i />
      </aside>
      <div className="pep-main">
        <div className="pep-kpis">
          {[0, 1, 2].map((k) => (
            <div key={k} className="pep-kpi">
              <i className="pe-barra pe-tenue" style={{ width: '45%' }} />
              <i className="pep-cifra" style={{ width: `${[38, 56, 30][k]}%` }} />
            </div>
          ))}
        </div>
        <div className="pep-grafico">
          {alturas.map((h, i) => (
            <span key={i} style={{ '--h': `${h}%`, '--k': i } as React.CSSProperties} />
          ))}
        </div>
        <div className="pep-tabla">
          {[0, 1, 2].map((f) => (
            <div key={f} className="pep-fila">
              <b />
              <i className="pe-barra" style={{ width: `${[34, 28, 40][f]}%` }} />
              <i className="pe-barra pe-tenue" style={{ width: '22%' }} />
              <span className={`pep-estado${f === 1 ? ' pendiente' : ''}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** El área de clientes: su próxima cita y su tarjeta de sellos. */
function PantallaClientes({ activa }: { activa: boolean }) {
  return (
    <div className={clase('pe-clientes', activa)}>
      <div className="pec-tarjeta">
        <div className="pec-cabeza">
          <b className="pec-avatar" />
          <div className="pec-nombre">
            <i className="pe-barra" style={{ width: '70%' }} />
            <i className="pe-barra pe-tenue" style={{ width: '45%' }} />
          </div>
        </div>
        <div className="pec-cita">
          <span>Próxima cita</span>
          <b>Jue · 17:30</b>
        </div>
        <div className="pec-sellos">
          <span>Sellos</span>
          <div>
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <i key={s} className={s < 4 ? 'lleno' : undefined} style={{ '--k': s } as React.CSSProperties} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Las campañas: a quién va, el mensaje en el móvil y el botón de enviar. */
function PantallaCampanas({ activa }: { activa: boolean }) {
  return (
    <div className={clase('pe-campanas', activa)}>
      <div className="pecm-segmentos">
        <span className="pecm-titulo">Para quién</span>
        {[true, true, false].map((marcado, i) => (
          <div key={i} className="pecm-fila">
            <b className={marcado ? 'marcado' : undefined} />
            <i className="pe-barra" style={{ width: `${[62, 48, 56][i]}%` }} />
          </div>
        ))}
        <span className="pecm-enviar">Enviar</span>
      </div>
      <div className="pecm-movil">
        <div className="pecm-burbuja">
          <i className="pe-barra" style={{ width: '88%' }} />
          <i className="pe-barra" style={{ width: '70%' }} />
          <i className="pe-barra pe-tenue" style={{ width: '50%' }} />
        </div>
        <div className="pecm-burbuja pecm-corta">
          <i className="pe-barra" style={{ width: '60%' }} />
        </div>
      </div>
    </div>
  )
}

/** La automatización: tres pasos encadenados y el punto de la marca recorriéndolos. */
function PantallaAutomatizacion({ activa }: { activa: boolean }) {
  return (
    <div className={clase('pe-auto', activa)}>
      <div className="pea-flujo">
        <div className="pea-nodo"><b />Nueva reserva</div>
        <div className="pea-linea"><span /></div>
        <div className="pea-nodo"><b />Recordatorio 24 h</div>
        <div className="pea-linea"><span /></div>
        <div className="pea-nodo"><b />Pide la reseña</div>
      </div>
    </div>
  )
}
