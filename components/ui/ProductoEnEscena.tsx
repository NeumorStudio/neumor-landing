'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import { PantallaAutomatizacion, PantallaCampanas, PantallaClientes, PantallaPanel, PantallaWeb } from './olmo/pantallas'

gsap.registerPlugin(ScrollTrigger)

export type Pantalla = 'web' | 'panel' | 'clientes' | 'campanas' | 'automatizacion'
export type FuncionProducto = {
  title: string
  copy: string
  /** Lo que se ve en la pantalla del ejemplo cuando esta función está encendida. */
  ejemplo: string
  pantalla: Pantalla
}

/**
 * Lo que construimos, contado con el scroll.
 *
 * A un lado, la lista de lo que incluye el producto; al otro, un navegador
 * fijo. Al bajar, la función que pasa por la altura de lectura se enciende y
 * la pantalla del navegador cambia a la suya.
 *
 * Las cinco pantallas son un mismo ejemplo de principio a fin: Olmo, un
 * restaurante inventado. Su web, su panel, el área de una clienta, una
 * campaña y sus automatizaciones. Va marcado como ejemplo en la barra del
 * navegador y en el pie, para que nadie lo lea como un cliente real.
 *
 * Las pantallas están en `components/ui/olmo/pantallas.tsx` y sus estilos en
 * `app/olmo.css`. Son interfaz dibujada con HTML y CSS, no capturas. Van
 * siempre en oscuro, como la cara de la marca.
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
      // En móviles bajos manda el tope: que el título de la función que se
      // enciende ya esté dentro de la pantalla.
      return Math.min(bajoMarco + alto + 12, innerHeight - 70)
    }
    // La encendida es la última función cuyo borde de arriba ya pasó la
    // línea. Se calcula a partir de la posición, no de ir cruzando bordes: así
    // también acierta si se llega de un salto (el menú, un enlace, volver
    // atrás) o si el scroll cae justo en el borde entre dos funciones.
    const items = Array.from(el.querySelectorAll<HTMLElement>('.pe-funcion'))
    const lista = el.querySelector<HTMLElement>('.pe-lista')
    const calcular = () => {
      const l = linea()
      let i = 0
      items.forEach((item, k) => { if (item.getBoundingClientRect().top <= l) i = k })
      setActiva(i)
    }
    const disparador = ScrollTrigger.create({
      trigger: lista,
      start: () => `top ${linea()}px`,
      end: () => `bottom ${linea()}px`,
      onUpdate: calcular,
      onRefresh: calcular,
    })
    return () => {
      disparador.kill()
      el.classList.remove('vivo')
    }
  }, [])

  const actual = funciones[activa].pantalla

  // El punto de la n (PuntoGuia) baja por la raya de la lista al ritmo de la
  // función encendida. Solo en escritorio: en móvil el navegador va fijo
  // arriba y el punto se cruzaría con él.
  return (
    <div ref={raiz} className="pe">
      <div className="pe-visual" aria-hidden="true">
        <div className="pe-marco">
          <div className="escenario-barra">
            <i /><i /><i />
            <span>tunegocio.com</span>
            <em className="pe-sello">Ejemplo</em>
          </div>
          <div className="pe-pantalla">
            <PantallaWeb activa={actual === 'web'} />
            <PantallaPanel activa={actual === 'panel'} />
            <PantallaClientes activa={actual === 'clientes'} />
            <PantallaCampanas activa={actual === 'campanas'} />
            <PantallaAutomatizacion activa={actual === 'automatizacion'} />
          </div>
        </div>
        <div className="pe-pie">
          <div className="pe-indice">
            {funciones.map((f, i) => (
              <span key={f.title} className={i === activa ? 'activo' : undefined} />
            ))}
          </div>
          <span>Ejemplo: Olmo, un restaurante inventado</span>
        </div>
      </div>

      <ol className="pe-lista">
        <li className="pe-rail" data-punto="via" data-punto-tam="12" data-punto-desde="1024" aria-hidden="true" />
        {funciones.map((f, i) => (
          <li key={f.title} className={`pe-funcion${i === activa ? ' activa' : ''}`}>
            <span className="pe-num">{dosCifras(i + 1)}</span>
            <h4 className="pe-titulo">{f.title}</h4>
            <p className="pe-texto">{f.copy}</p>
            <p className="pe-ejemplo"><span>En el ejemplo</span>{f.ejemplo}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
