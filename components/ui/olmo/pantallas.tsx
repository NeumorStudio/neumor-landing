import type { CSSProperties } from 'react'
import { Ico, type NombreIcono } from './Icono'

/**
 * Las cinco pantallas del ejemplo: Olmo, un restaurante inventado. Su web, su
 * panel, el área de una clienta, una campaña y sus automatizaciones. Cuentan
 * la misma historia de principio a fin: Lucía reserva mesa para el sábado a
 * las 21:00 y todo lo demás pasa solo.
 *
 * Son interfaz dibujada con HTML y CSS (app/olmo.css), no capturas. Todo se
 * mide en `em` sobre un tamaño de letra atado al ancho del marco, así que se
 * ven igual a cualquier tamaño. En marcos estrechos (el móvil) cada pantalla
 * pasa a una versión compacta con lo esencial, para que se pueda leer.
 *
 * Las fotos son ilustraciones hechas con código: scripts/olmo/mesa.mjs.
 */

type P = { activa: boolean }
const clase = (base: string, activa: boolean) => `pe-p ${base}${activa ? ' activa' : ''}`
const k = (i: number) => ({ '--k': i }) as CSSProperties

function Marca() {
  return <span className="pe-marca"><b />olmo</span>
}

/* ---------- 1. La web: la portada del restaurante y su reserva ---------- */

const PLATOS = [
  { n: 'Alcachofas a la brasa', d: 'Con romesco y sal de escamas', p: '14 €', img: 'plato-alcachofas' },
  { n: 'Arroz meloso de setas', d: 'Boletus, níscalos y tomillo', p: '19 €', img: 'plato-arroz' },
  { n: 'Tarta de queso', d: 'Al horno, con frutos rojos', p: '7 €', img: 'plato-tarta' },
]

export function PantallaWeb({ activa }: P) {
  return (
    <div className={clase('pw', activa)}>
      <nav className="pw-nav">
        <Marca />
        <span className="pw-enlaces"><i>Carta</i><i>Menú del día</i><i>Eventos</i><i>Dónde estamos</i></span>
        <span className="pe-boton pe-boton-chico">Reservar mesa</span>
      </nav>

      <div className="pw-hero">
        <div className="pw-texto">
          <span className="pw-valoracion">
            <span className="pw-estrellas">{[0, 1, 2, 3, 4].map((i) => <Ico key={i} n="estrella" />)}</span>
            4,8<em>· 312 reseñas</em>
          </span>
          <strong className="pw-titular">Cocina de temporada, a dos calles de casa.</strong>
          <span className="pw-entrada">Producto del mercado, una carta que cambia cada mes y tu mesa en dos clics.</span>
          <span className="pw-botones">
            <span className="pe-boton">Reservar mesa</span>
            <span className="pe-boton pe-fantasma">Ver la carta</span>
          </span>
          <span className="pw-datos">
            <span><b className="pw-abierto" />Abierto hoy · 13:00–16:00 y 20:00–23:30</span>
            <span><Ico n="pin" />Terraza y salón privado</span>
          </span>
        </div>

        <div className="pw-foto">
          <span className="pw-pie-foto"><em>Plato de la semana</em>Burrata, higos y miel</span>
          {/* La reserva: un cursor elige la hora, pulsa Reservar y entra el aviso. */}
          <div className="pw-reserva">
            <span className="pw-reserva-cabecera"><strong>Reserva tu mesa</strong><em>Sin llamar</em></span>
            <span className="pw-fila pw-dias">
              <i>Jue<b>16</b></i><i>Vie<b>17</b></i><i className="elegido">Sáb<b>18</b></i>
            </span>
            <span className="pw-fila">
              <i>20:30</i><i className="pw-objetivo">21:00</i><i>21:30</i>
            </span>
            <span className="pw-reserva-pie">
              <span className="pw-personas"><Ico n="usuarios" />2 personas<Ico n="abajo" /></span>
              <span className="pe-boton pe-boton-chico pw-confirmar">Reservar</span>
            </span>
            <span className="pe-cursor" />
          </div>
        </div>
      </div>

      <div className="pw-carta">
        <span className="pw-carta-cabecera">
          <strong>De la carta de otoño</strong>
          <em>Ver la carta completa<Ico n="flecha" /></em>
        </span>
        <div className="pw-platos">
          {PLATOS.map((p) => (
            <div key={p.n} className="pw-plato">
              <span className="pw-plato-foto" style={{ backgroundImage: `url(/olmo/${p.img}.svg)` }} />
              <span className="pw-plato-texto"><strong>{p.n}</strong><em>{p.d}</em></span>
              <b>{p.p}</b>
            </div>
          ))}
        </div>
      </div>

      <div className="pe-aviso">
        <span className="pe-aviso-marca"><Ico n="visto" /></span>
        <span><strong>Reserva confirmada</strong>Sáb 18 · 21:00 · 2 personas</span>
      </div>
    </div>
  )
}

/* ---------- 2. El panel: el sábado del restaurante de un vistazo ---------- */

const MENU: { t: string; i: NombreIcono; n?: string }[] = [
  { t: 'Hoy', i: 'inicio' },
  { t: 'Reservas', i: 'calendario', n: '34' },
  { t: 'Sala', i: 'sala' },
  { t: 'Clientes', i: 'usuarios' },
  { t: 'Carta', i: 'carta' },
  { t: 'Campañas', i: 'megafono' },
  { t: 'Automatizaciones', i: 'rayo' },
]

const LLEGADAS = [
  { h: '20:30', n: 'García', i: 'AG', m: 'Mesa 4 · Salón', p: 4, e: 'Sentados', c: '#6f8fb8' },
  { h: '21:00', n: 'Lucía R.', i: 'LR', m: 'Mesa 12 · Terraza', p: 2, e: 'Confirmada', c: '#c98a72', nota: 'Sin gluten', ni: 'aviso' as NombreIcono },
  { h: '21:15', n: 'Ortega', i: 'JO', m: 'Mesa 3 · Salón', p: 6, e: 'Pendiente', c: '#8f7fc0', nota: 'Cumpleaños', ni: 'tarta' as NombreIcono },
  { h: '21:45', n: 'Méndez', i: 'PM', m: 'Mesa 11 · Terraza', p: 3, e: 'Confirmada', c: '#5fa392' },
  { h: '22:00', n: 'Ruiz', i: 'CR', m: 'Mesa 5 · Salón', p: 2, e: 'Confirmada', c: '#b9a15e' },
  { h: '22:15', n: 'Pastor', i: 'SP', m: 'Mesa 13 · Terraza', p: 5, e: 'Pendiente', c: '#a8749a' },
]

// El plano de la sala, en tantos por ciento de su caja. o: ocupada, r: reservada, l: libre.
const MESAS = [
  { n: '1', x: 3, y: 8, w: 12, h: 26, e: 'o' }, { n: '2', x: 19, y: 8, w: 12, h: 26, e: 'o' }, { n: '3', x: 35, y: 8, w: 22, h: 26, e: 'r' },
  { n: '4', x: 3, y: 44, w: 12, h: 26, e: 'o' }, { n: '5', x: 19, y: 44, w: 12, h: 26, e: 'r' }, { n: '6', x: 38, y: 42, w: 16, h: 30, e: 'o', c: true },
  { n: '10', x: 69, y: 8, w: 12, h: 26, e: 'o', c: true }, { n: '11', x: 85, y: 8, w: 12, h: 26, e: 'r', c: true },
  { n: '12', x: 69, y: 44, w: 12, h: 26, e: 'r', c: true, yo: true }, { n: '13', x: 85, y: 44, w: 12, h: 26, e: 'l', c: true },
]

const SEMANA = [
  { d: 'L', v: 18 }, { d: 'M', v: 22 }, { d: 'X', v: 26 }, { d: 'J', v: 31 },
  { d: 'V', v: 44 }, { d: 'S', v: 52 }, { d: 'D', v: 38 },
]

export function PantallaPanel({ activa }: P) {
  return (
    <div className={clase('pp', activa)}>
      <aside className="pp-lado">
        <Marca />
        <ul className="pp-menu">
          {MENU.map((x, i) => (
            <li key={x.t} className={i === 0 ? 'activo' : undefined}>
              <Ico n={x.i} />{x.t}{x.n && <em>{x.n}</em>}
            </li>
          ))}
        </ul>
        <span className="pp-usuario"><b>M</b><span><strong>Marta</strong>Jefa de sala</span></span>
      </aside>

      <div className="pp-main">
        <header className="pp-cabecera">
          <span className="pp-titulo"><strong>Hoy, sábado 18</strong><em>Turno de noche · 20:00–23:30</em></span>
          <span className="pp-turnos"><i>Comida</i><i className="activo">Cena</i></span>
          <span className="pp-buscar"><Ico n="lupa" />Buscar reserva</span>
          <span className="pe-boton pe-boton-chico"><Ico n="mas" />Nueva reserva</span>
        </header>

        <div className="pp-kpis">
          <div>
            <em>Reservas</em>
            <strong>34</strong>
            <span className="pp-sube"><Ico n="sube" />+6 que el sábado pasado</span>
            <svg className="pp-chispa" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
              <path className="pp-chispa-area" d="M0 34L16 30L33 31L50 22L66 24L83 12L100 6V40H0Z" />
              <path className="pp-chispa-linea" pathLength={1} d="M0 34L16 30L33 31L50 22L66 24L83 12L100 6" />
            </svg>
          </div>
          <div>
            <em>Comensales</em>
            <strong>96</strong>
            <span>De 118 plazas</span>
            <span className="pp-barra"><i /></span>
          </div>
          <div className="pp-ocupacion">
            <span>
              <em>Ocupación</em>
              <strong>82 %</strong>
              <span>Pico a las 21:30</span>
            </span>
            <svg className="pp-anillo" viewBox="0 0 40 40" aria-hidden="true">
              <circle cx="20" cy="20" r="15.9155" />
              <circle className="pp-anillo-valor" cx="20" cy="20" r="15.9155" pathLength={100} />
            </svg>
          </div>
        </div>

        <div className="pp-abajo">
          <div className="pp-tarjeta pp-llegadas">
            <span className="pp-tarjeta-cabecera">
              <em>Próximas llegadas</em>
              <span className="pp-filtros"><i className="activo">Todas</i><i>Pendientes · 2</i></span>
            </span>
            <ul className="pp-lista">
              {LLEGADAS.map((r, i) => (
                <li key={r.h} className={i === 0 ? 'pp-dentro' : undefined} style={k(i)}>
                  <strong>{r.h}</strong>
                  <b style={{ background: r.c }}>{r.i}</b>
                  <span className="pp-quien">
                    <span>{r.n}{r.nota && <u><Ico n={r.ni!} />{r.nota}</u>}</span>
                    <em>{r.m}</em>
                  </span>
                  <span className="pp-pax"><Ico n="usuario" />{r.p}</span>
                  <i className={r.e === 'Pendiente' ? 'pendiente' : r.e === 'Sentados' ? 'sentados' : undefined}>{r.e}</i>
                </li>
              ))}
            </ul>
          </div>

          <div className="pp-derecha">
            <div className="pp-tarjeta pp-sala">
              <span className="pp-tarjeta-cabecera">
                <em>Sala</em>
                <span className="pp-leyenda"><i className="o" />Ocupada<i className="r" />Reservada<i className="l" />Libre</span>
              </span>
              <div className="pp-plano">
                <span className="pp-zona pp-zona-salon">Salón</span>
                <span className="pp-zona pp-zona-terraza">Terraza</span>
                <span className="pp-barra-bar">Barra</span>
                {MESAS.map((m, i) => (
                  <span
                    key={m.n}
                    className={`pp-mesa ${m.e}${m.c ? ' redonda' : ''}${m.yo ? ' pp-mesa-lucia' : ''}`}
                    style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%`, '--k': i } as CSSProperties}
                  >
                    {m.n}
                  </span>
                ))}
              </div>
            </div>

            <div className="pp-tarjeta pp-semana">
              <span className="pp-tarjeta-cabecera"><em>Reservas esta semana</em><span className="pp-total">231</span></span>
              <div className="pp-grafico">
                {SEMANA.map((b, i) => (
                  <span key={b.d} className={b.d === 'S' ? 'hoy' : undefined} style={{ '--h': `${(b.v / 52) * 100}%`, '--k': i } as CSSProperties}>
                    <u>{b.v}</u><i />{b.d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- 3. El área de clientes: lo que ve Lucía al entrar ---------- */

const VISITAS = [
  { f: '4 oct', t: 'Comida · 2 personas', m: 'Terraza', e: 5 },
  { f: '14 sep', t: 'Cena · 4 personas', m: 'Mesa 7 · Salón', e: 5 },
  { f: '2 ago', t: 'Cena · 2 personas', m: 'Terraza', e: 5 },
  { f: '21 jun', t: 'Comida · 3 personas', m: 'Mesa 2 · Salón', e: 4 },
]

export function PantallaClientes({ activa }: P) {
  return (
    <div className={clase('pc', activa)}>
      <nav className="pw-nav">
        <Marca />
        <span className="pc-pestanas"><i className="activo">Mis reservas</i><i>Sellos</i><i>Mis datos</i></span>
        <span className="pc-campana"><Ico n="campana" /><b /></span>
        <span className="pc-avatar">LR</span>
      </nav>

      <div className="pc-cabecera">
        <strong className="pc-saludo">Hola, Lucía</strong>
        <span className="pc-estado"><Ico n="visto" />Tu mesa del sábado está confirmada</span>
      </div>

      <div className="pc-rejilla">
        <div className="pc-tarjeta pc-proxima">
          <span className="pc-fecha"><em>Sáb</em><strong>18</strong><em>Oct</em></span>
          <span className="pc-proxima-texto">
            <em>Próxima reserva</em>
            <strong>Sábado, 21:00</strong>
            <span>2 personas · Terraza · Mesa 12</span>
            <span className="pc-codigo">Código <b>OLM-4821</b></span>
          </span>
          {/* Un plano pequeño con el camino hasta la puerta. */}
          <span className="pc-mapa">
            <svg viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <path className="pc-mapa-manzanas" d="M-4 -4H34V30H-4ZM44 -4H82V30H44ZM92 -4H124V30H92ZM-4 40H34V78H-4ZM44 40H82V78H44ZM92 40H124V78H92ZM-4 88H34V124H-4ZM44 88H82V124H44ZM92 88H124V124H92Z" />
              <path className="pc-mapa-parque" d="M44 40H82V78H44Z" />
              <path className="pc-mapa-ruta" pathLength={1} d="M12 118V83H39V35H87V58" />
              <circle className="pc-mapa-origen" cx="12" cy="118" r="3.4" />
              <path className="pc-mapa-pin" d="M87 62c-6.5-7.4-10.5-12-10.5-17.5a10.5 10.5 0 0 1 21 0C97.5 50 93.500 54.600 87 62z" />
              <circle className="pc-mapa-pin-ojo" cx="87" cy="44.500" r="3.800" />
            </svg>
          </span>
          <span className="pc-acciones">
            <span className="pe-boton pe-fantasma pe-boton-chico"><Ico n="editar" />Cambiar</span>
            <span className="pe-boton pe-fantasma pe-boton-chico"><Ico n="calendario" />Al calendario</span>
            <span className="pe-boton pe-fantasma pe-boton-chico"><Ico n="ruta" />Cómo llegar</span>
          </span>
        </div>

        <div className="pc-tarjeta pc-sellos-tarjeta">
          <span className="pc-tarjeta-cabecera"><em>Tus sellos</em><span>4 de 6</span></span>
          <span className="pc-sellos">
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <i key={s} className={s < 4 ? 'lleno' : s === 5 ? 'premio' : undefined} style={k(s)}>
                {s < 4 ? <Ico n="hoja" /> : s === 5 ? <Ico n="regalo" /> : null}
              </i>
            ))}
          </span>
          <span className="pc-progreso"><i /></span>
          <span className="pc-nota">Te faltan dos. Al sexto, el postre corre de nuestra cuenta.</span>
        </div>

        <div className="pc-tarjeta pc-historial">
          <span className="pc-tarjeta-cabecera"><em>Tus visitas</em><span>4 este año</span></span>
          <ul>
            {VISITAS.map((v) => (
              <li key={v.f}>
                <strong>{v.f}</strong>
                <span>{v.t}<em>{v.m}</em></span>
                <span className="pc-estrellas">{[0, 1, 2, 3, 4].map((i) => <Ico key={i} n="estrella" className={i < v.e ? undefined : 'vacia'} />)}</span>
                <i><Ico n="repetir" />Repetir</i>
              </li>
            ))}
          </ul>
        </div>

        <div className="pc-tarjeta pc-preferencias">
          <span className="pc-tarjeta-cabecera"><em>Tus preferencias</em><span>Editar</span></span>
          <span className="pc-chips">
            <i><Ico n="aviso" />Sin gluten</i>
            <i>Mesa en terraza</i>
            <i>Vino tinto</i>
            <i className="pc-chip-mas"><Ico n="mas" />Añadir</i>
          </span>
          <span className="pc-nota">Las tenemos en cuenta en cada reserva, sin que tengas que repetirlas.</span>
          <span className="pc-fechas">
            <em>Fechas que recordamos</em>
            <span><Ico n="tarta" /><strong>Tu cumpleaños</strong>12 de marzo</span>
            <span><Ico n="regalo" /><strong>Aniversario</strong>3 de junio</span>
          </span>
        </div>
      </div>
    </div>
  )
}

/* ---------- 4. Las campañas: un mensaje a quien hace tiempo que no viene ---------- */

export function PantallaCampanas({ activa }: P) {
  return (
    <div className={clase('pcm', activa)}>
      <div className="pcm-editor">
        <span className="pcm-miga">Campañas<Ico n="abajo" />Carta de otoño</span>
        <span className="pcm-cabecera">
          <strong className="pcm-titulo">Nueva campaña</strong>
          <span className="pcm-pasos"><i className="hecho"><Ico n="visto" />Público</i><i className="activo"><b>2</b>Mensaje</i><i><b>3</b>Envío</i></span>
        </span>

        <div className="pcm-campo">
          <em>Para</em>
          <span className="pcm-chip"><Ico n="filtro" />Llevan más de 60 días sin venir</span>
          <span className="pcm-publico">
            <span className="pcm-caras"><b style={{ background: '#c98a72' }}>LR</b><b style={{ background: '#6f8fb8' }}>AG</b><b style={{ background: '#8f7fc0' }}>JO</b><b>+125</b></span>
            128 clientes
          </span>
        </div>

        <div className="pcm-campo">
          <em>Canal</em>
          <span className="pcm-chip activo"><Ico n="mensaje" />Mensaje</span>
          <span className="pcm-chip"><Ico n="correo" />Email</span>
          <span className="pcm-chip"><Ico n="movil" />SMS</span>
        </div>

        <div className="pcm-campo pcm-mensaje">
          <em>Mensaje</em>
          <span className="pcm-texto">
            <p>
              Hola, <b>{'{nombre}'}</b>. Estrenamos la carta de otoño. ¿Te guardamos mesa este fin de semana?
            </p>
            <span className="pcm-variables"><i>+ nombre</i><i>+ última visita</i><i>+ enlace de reserva</i><u>96 / 160</u></span>
          </span>
        </div>

        <div className="pcm-campo">
          <em>Cuándo</em>
          <span className="pcm-chip"><Ico n="enviar" />Ahora</span>
          <span className="pcm-chip activo"><Ico n="reloj" />Jueves 16, 12:00</span>
          <span className="pe-boton pe-boton-chico pcm-programar">Programar envío</span>
        </div>

        <div className="pcm-resultado">
          <span className="pcm-resultado-titulo"><em>Así fue la anterior</em>Carta de verano</span>
          <span className="pcm-dato" style={{ '--v': '100%' } as CSSProperties}><strong>131</strong><em>Enviados</em><i /></span>
          <span className="pcm-dato" style={{ '--v': '71%' } as CSSProperties}><strong>93</strong><em>Leídos</em><i /></span>
          <span className="pcm-dato" style={{ '--v': '29%' } as CSSProperties}><strong>38</strong><em>Respondieron</em><i /></span>
          <span className="pcm-dato pcm-dato-fuerte" style={{ '--v': '13%' } as CSSProperties}><strong>17</strong><em>Reservas</em><i /></span>
        </div>
      </div>

      <div className="pcm-movil">
        <span className="pcm-isla" />
        <span className="pcm-barra-estado"><strong>12:01</strong><span><i /><i /><i /><u /></span></span>
        <span className="pcm-contacto">
          <b />
          <span><strong>Olmo</strong><em>en línea</em></span>
        </span>
        <span className="pcm-dia">Jueves</span>
        <p className="pcm-burbuja">
          Hola, Lucía. Estrenamos la carta de otoño. ¿Te guardamos mesa este fin de semana?
          <span className="pcm-hora">12:00</span>
        </p>
        <p className="pcm-burbuja pcm-respuesta">
          ¡Sí! El sábado, para dos.
          <span className="pcm-hora">12:01<Ico n="doble" /></span>
        </p>
        <span className="pcm-sistema"><Ico n="visto" />Reserva creada · Sáb 18, 21:00</span>
        <p className="pcm-burbuja pcm-final">
          Hecho. Mesa para dos el sábado a las 21:00. Te esperamos.
          <span className="pcm-hora">12:01</span>
        </p>
        <span className="pcm-escribir">Escribe un mensaje<b><Ico n="enviar" /></b></span>
      </div>
    </div>
  )
}

/* ---------- 5. La automatización: lo que pasa solo con cada reserva ---------- */

const PASOS: { t: string; s: string; i: NombreIcono; cuando?: string; n?: string }[] = [
  { t: 'Cuando entra una reserva', s: 'Desde la web, el panel o un mensaje', i: 'calendario' },
  { t: 'Confirmación al cliente', s: 'Con el día, la hora y cómo llegar', i: 'mensaje', cuando: 'Al momento', n: '34 hoy' },
  { t: 'Recordatorio', s: 'Con enlace para cambiarla o cancelarla', i: 'campana', cuando: '24 h antes', n: '12 hoy' },
  { t: 'Aviso a la lista de espera', s: 'El hueco se ofrece al siguiente', i: 'usuarios', cuando: 'Si alguien cancela', n: '3 hoy' },
  { t: 'Petición de reseña', s: 'Solo a quien ha venido', i: 'estrella', cuando: 'Al día siguiente', n: '9 hoy' },
]

const REGISTRO: { h: string; t: string; n: string; i: NombreIcono }[] = [
  { h: '21:02', t: 'Reseña pedida', n: 'Familia Ortega · visita de ayer', i: 'estrella' },
  { h: '20:47', t: 'Recordatorio enviado', n: 'García · mañana, 14:30', i: 'campana' },
  { h: '20:31', t: 'Hueco ofrecido y ocupado', n: 'Mesa 4 · de Vidal a Soler', i: 'usuarios' },
  { h: '20:15', t: 'Reserva confirmada', n: 'Lucía R. · sábado, 21:00', i: 'mensaje' },
  { h: '19:58', t: 'Recordatorio enviado', n: 'Méndez · hoy, 21:45', i: 'campana' },
]

export function PantallaAutomatizacion({ activa }: P) {
  return (
    <div className={clase('pa', activa)}>
      <div className="pa-flujo">
        <span className="pa-cabecera">
          <strong className="pa-titulo">Cada reserva, sola</strong>
          <span className="pa-activa"><b />Activa</span>
        </span>
        <div className="pa-pasos">
          <span className="pa-via"><i /></span>
          {PASOS.map((p, i) => (
            <div key={p.t} className={`pa-paso${i === 0 ? ' disparo' : ''}`} style={k(i)}>
              {p.cuando && <span className="pa-cuando">{p.cuando}</span>}
              <b><Ico n={p.i} /></b>
              <span className="pa-paso-texto"><strong>{p.t}</strong>{p.s}</span>
              {p.n ? <em>{p.n}</em> : <em className="pa-disparador">Disparador</em>}
              {i > 0 && <i className="pa-interruptor" />}
            </div>
          ))}
        </div>
      </div>

      <div className="pa-lado">
        <div className="pa-cifras">
          <span><strong>58</strong><em>Mensajes hoy</em></span>
          <span><strong>3</strong><em>Huecos recuperados</em></span>
          <span><strong>0</strong><em>Hechos a mano</em></span>
        </div>
        <div className="pa-hoy">
          <span className="pa-hoy-cabecera"><em>Hoy, sin que nadie lo mande</em><span><b />En directo</span></span>
          <ul>
            {REGISTRO.map((x, i) => (
              <li key={x.h} style={k(i)}>
                <time>{x.h}</time>
                <b><Ico n={x.i} /></b>
                <span><strong>{x.t}</strong>{x.n}</span>
                <Ico n="visto" className="pa-hecho" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
