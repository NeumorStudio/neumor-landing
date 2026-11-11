'use client'

import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

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
 * Están dibujadas con HTML y CSS, no son capturas. Todo se mide en `em` sobre
 * un tamaño de letra atado al ancho del marco (cqw), así que la ilustración es
 * la misma a cualquier tamaño. Van siempre en oscuro, como la cara de la marca.
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

const clase = (base: string, activa: boolean) => `pe-p ${base}${activa ? ' activa' : ''}`

function Marca() {
  return <span className="pe-marca"><b />olmo</span>
}

/** 1. La web: la portada del restaurante y su reserva. Un cursor elige hora y entra el aviso. */
function PantallaWeb({ activa }: { activa: boolean }) {
  return (
    <div className={clase('pw', activa)}>
      <nav className="pw-nav">
        <Marca />
        <span className="pw-enlaces"><i>Carta</i><i>Reservas</i><i>Dónde estamos</i></span>
        <span className="pe-boton pe-boton-chico">Reservar mesa</span>
      </nav>
      <div className="pw-hero">
        <div className="pw-texto">
          <span className="pw-antetitulo">Cocina de mercado</span>
          <strong className="pw-titular">Cocina de temporada, a dos calles de casa.</strong>
          <span className="pw-entrada">Producto del mercado, una carta que cambia cada mes y tu mesa en dos clics.</span>
          <span className="pw-botones">
            <span className="pe-boton">Reservar mesa</span>
            <span className="pe-boton pe-fantasma">Ver la carta</span>
          </span>
          <span className="pw-horario"><b />Abierto hoy · 13:00–16:00 y 20:00–23:30</span>
        </div>
        <div className="pw-foto">
          <span className="pw-plato"><i /><i /><i /></span>
          <span className="pw-copa" />
          <div className="pw-reserva">
            <strong>Reserva tu mesa</strong>
            <span className="pw-fila">
              <i>Hoy</i><i>Mañana</i><i className="elegido">Sáb</i>
            </span>
            <span className="pw-fila">
              <i>20:30</i>
              <i className="pw-objetivo">21:00<span className="pe-cursor" /></i>
              <i>21:30</i>
            </span>
            <span className="pw-personas">2 personas <em>▾</em></span>
          </div>
        </div>
      </div>
      <div className="pe-aviso">
        <b />
        <span><strong>Reserva confirmada</strong>Sáb · 21:00 · 2 personas</span>
      </div>
    </div>
  )
}

/** 2. El panel: el sábado del restaurante de un vistazo. */
function PantallaPanel({ activa }: { activa: boolean }) {
  const semana = [
    { d: 'L', v: 18 }, { d: 'M', v: 22 }, { d: 'X', v: 26 }, { d: 'J', v: 31 },
    { d: 'V', v: 44 }, { d: 'S', v: 52 }, { d: 'D', v: 38 },
  ]
  const reservas = [
    { h: '20:30', n: 'García', p: 4, e: 'Confirmada' },
    { h: '21:00', n: 'Lucía R.', p: 2, e: 'Confirmada' },
    { h: '21:15', n: 'Ortega', p: 6, e: 'Pendiente' },
    { h: '21:45', n: 'Méndez', p: 3, e: 'Confirmada' },
    { h: '22:00', n: 'Ruiz', p: 2, e: 'Confirmada' },
    { h: '22:15', n: 'Pastor', p: 5, e: 'Pendiente' },
  ]
  return (
    <div className={clase('pp', activa)}>
      <aside className="pp-lado">
        <Marca />
        <ul>
          {['Hoy', 'Reservas', 'Clientes', 'Carta', 'Campañas', 'Automatizaciones'].map((x, i) => (
            <li key={x} className={i === 0 ? 'activo' : undefined}><b />{x}</li>
          ))}
        </ul>
        <span className="pp-usuario"><b>M</b>Marta · Sala</span>
      </aside>
      <div className="pp-main">
        <header className="pp-cabecera">
          <span><strong>Hoy, sábado</strong><em>Turno de noche</em></span>
          <span className="pe-boton pe-boton-chico">+ Nueva reserva</span>
        </header>
        <div className="pp-kpis">
          <div><em>Reservas</em><strong>34</strong><span className="pp-sube">+6 que el sábado pasado</span></div>
          <div><em>Comensales</em><strong>96</strong><span>De 118 plazas</span></div>
          <div>
            <em>Ocupación</em><strong>82 %</strong>
            <span className="pp-barra"><i /></span>
          </div>
        </div>
        <div className="pp-abajo">
          <div className="pp-tarjeta">
            <em>Reservas esta semana</em>
            <div className="pp-grafico">
              {semana.map((b, i) => (
                <span key={b.d} className={b.d === 'S' ? 'hoy' : undefined}
                  style={{ '--h': `${(b.v / 52) * 100}%`, '--k': i } as React.CSSProperties}>
                  <i />{b.d}
                </span>
              ))}
            </div>
          </div>
          <div className="pp-tarjeta">
            <em>Próximas</em>
            <ul className="pp-lista">
              {reservas.map((r, i) => (
                <li key={r.h} style={{ '--k': i } as React.CSSProperties}>
                  <strong>{r.h}</strong>
                  <span>{r.n}</span>
                  <span className="pp-pax">{r.p} pers.</span>
                  <i className={r.e === 'Pendiente' ? 'pendiente' : undefined}>{r.e}</i>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

/** 3. El área de clientes: lo que ve Lucía al entrar en su cuenta. */
function PantallaClientes({ activa }: { activa: boolean }) {
  return (
    <div className={clase('pc', activa)}>
      <nav className="pw-nav">
        <Marca />
        <span className="pc-pestanas"><i className="activo">Mis reservas</i><i>Sellos</i><i>Mis datos</i></span>
        <span className="pc-avatar">LR</span>
      </nav>
      <strong className="pc-saludo">Hola, Lucía</strong>
      <div className="pc-rejilla">
        <div className="pc-tarjeta pc-proxima">
          <em>Próxima reserva</em>
          <strong>Sábado, 21:00</strong>
          <span>2 personas · Terraza</span>
          <span className="pc-acciones">
            <span className="pe-boton pe-fantasma pe-boton-chico">Cambiar</span>
            <span className="pe-boton pe-fantasma pe-boton-chico">Añadir al calendario</span>
          </span>
        </div>
        <div className="pc-tarjeta">
          <em>Tus sellos · 4 de 6</em>
          <span className="pc-sellos">
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <i key={s} className={s < 4 ? 'lleno' : undefined} style={{ '--k': s } as React.CSSProperties} />
            ))}
          </span>
          <span className="pc-nota">Al sexto, el postre corre de nuestra cuenta.</span>
        </div>
        <div className="pc-tarjeta pc-historial">
          <em>Tus visitas</em>
          <ul>
            <li><strong>14 sep</strong><span>4 personas · Mesa 7</span><i>Repetir</i></li>
            <li><strong>2 ago</strong><span>2 personas · Terraza</span><i>Repetir</i></li>
            <li><strong>21 jun</strong><span>3 personas · Mesa 2</span><i>Repetir</i></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/** 4. Las campañas: un mensaje para quien hace tiempo que no viene, y su respuesta. */
function PantallaCampanas({ activa }: { activa: boolean }) {
  return (
    <div className={clase('pcm', activa)}>
      <div className="pcm-editor">
        <strong className="pcm-titulo">Nueva campaña</strong>
        <div className="pcm-campo">
          <em>Para</em>
          <span className="pcm-chip">Llevan más de 60 días sin venir</span>
          <span className="pcm-cuenta">128 clientes</span>
        </div>
        <div className="pcm-campo">
          <em>Canal</em>
          <span className="pcm-chip activo">Mensaje</span>
          <span className="pcm-chip">Email</span>
        </div>
        <div className="pcm-campo pcm-mensaje">
          <em>Mensaje</em>
          <p>
            Hola, <b>{'{nombre}'}</b>. Estrenamos la carta de otoño. ¿Te guardamos mesa este fin de semana?
          </p>
        </div>
        <div className="pcm-pie">
          <span className="pcm-cuando"><em>Cuándo</em>Jueves, 12:00</span>
          <span className="pe-boton">Programar envío</span>
        </div>
      </div>
      <div className="pcm-movil">
        <span className="pcm-contacto"><b />olmo<em>en línea</em></span>
        <p className="pcm-burbuja">
          Hola, Lucía. Estrenamos la carta de otoño. ¿Te guardamos mesa este fin de semana?
        </p>
        <p className="pcm-burbuja pcm-respuesta">¡Sí! Sábado para dos.</p>
        <span className="pcm-sistema">Reserva creada · Sáb 21:00</span>
      </div>
    </div>
  )
}

/** 5. La automatización: lo que pasa solo con cada reserva, y lo que ha pasado hoy. */
function PantallaAutomatizacion({ activa }: { activa: boolean }) {
  const pasos = [
    { t: 'Entra una reserva', s: 'Desde la web o el panel', disparo: true },
    { t: 'Confirmación al momento', s: 'Mensaje al cliente, al instante' },
    { t: 'Recordatorio', s: '24 h antes, con enlace para cambiarla' },
    { t: 'Pedir reseña', s: 'Al día siguiente de la visita' },
  ]
  const hoy = [
    { h: '21:02', t: 'Reseña pedida', n: 'Ortega' },
    { h: '20:47', t: 'Recordatorio enviado', n: 'García' },
    { h: '20:31', t: 'Hueco liberado y ocupado', n: 'Mesa 4' },
    { h: '20:15', t: 'Reserva confirmada', n: 'Lucía R.' },
  ]
  return (
    <div className={clase('pa', activa)}>
      <div className="pa-flujo">
        <strong className="pa-titulo">Cada reserva, sola</strong>
        <span className="pa-via"><i /></span>
        {pasos.map((p, i) => (
          <div key={p.t} className={`pa-paso${p.disparo ? ' disparo' : ''}`} style={{ '--k': i } as React.CSSProperties}>
            <b />
            <span><strong>{p.t}</strong>{p.s}</span>
            {!p.disparo && <i className="pa-interruptor" />}
          </div>
        ))}
      </div>
      <div className="pa-hoy">
        <em>Hoy, sin que nadie lo mande</em>
        <ul>
          {hoy.map((x, i) => (
            <li key={x.h} style={{ '--k': i } as React.CSSProperties}>
              <time>{x.h}</time>
              <span><strong>{x.t}</strong>{x.n}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
