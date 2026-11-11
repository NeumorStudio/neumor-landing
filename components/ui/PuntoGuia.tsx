'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { lineaLectura, puntoHero } from './punto-estado'

/**
 * El punto de la n acompaña toda la página.
 *
 * Sale de la bola de la portada y va de ancla en ancla al ritmo del scroll:
 * se posa en el número de cada capítulo, baja por la línea de los problemas,
 * salta por las tres palabras de lo que hacemos, recorre la lista del
 * ejemplo, toma el color de cada proyecto, baja por el proceso y acaba
 * dentro de la n del contacto.
 *
 * Dos reglas para que nunca parezca un fallo:
 *
 * 1. Va pegado a la página, no a la pantalla. Su posición se calcula en
 *    coordenadas del documento, así que cuando está posado en un hueco se
 *    mueve con él, píxel a píxel, por rápido que sea el scroll. Y su sitio
 *    depende solo del scroll: no arrastra retraso ni llega tarde.
 *
 * 2. Solo viaja a la vista por donde hay camino: una línea dibujada, una
 *    vía o un salto entre huecos de la misma fila. Entre dos anclas sin
 *    camino no cruza el texto por encima: se hunde en la que deja y brota en
 *    la siguiente cuando está a punto de llegar a la altura de lectura.
 *
 * Las anclas son elementos con `data-punto`:
 * - `data-punto=""`: un hueco donde el punto se posa al pasar por la altura de lectura.
 * - `data-punto="via"`: una vía vertical; el punto baja por ella a la altura de lectura.
 * - `data-punto-tapa` (sin `data-punto`): algo que tapa al punto cuando pasa por
 *   debajo, como las teclas numeradas del proceso. El punto se encoge al
 *   entrar y vuelve a salir por el otro lado.
 * Y opciones:
 * - `data-punto-camino="linea" | "salto"`: cómo llega desde el ancla anterior,
 *   a la vista. `linea` es un viaje recto y `salto`, un brinco con arco. Sin
 *   esto, brota en el sitio. `data-punto-camino-desde` es el ancho de
 *   pantalla a partir del cual vale ese camino.
 * - `data-punto-entra="izquierda"`: al brotar, entra rodando desde la izquierda.
 * - `data-punto-tam` (diámetro en px; si no, el ancho del ancla), `data-punto-color`,
 *   `data-punto-desfase` (px de scroll de retraso) y `data-punto-desde` /
 *   `data-punto-hasta` (anchos de pantalla en los que cuenta).
 *
 * Lo que el punto deja escrito en la página, para que el CSS dibuje con él:
 * - la clase `pasado` en cada ancla por la que ya pasó;
 * - `--punto-via` (de 0 a 1) en cada vía: cuánto lleva recorrido;
 * - `--punto-sale` (de 0 a 1) en el ancla de la que sale una línea, o en su
 *   antepasado con `data-punto-grupo`: cuánto lleva de camino a la siguiente.
 *
 * Sin JavaScript o con movimiento reducido no hay punto y las anclas se ven
 * ya completas (ver `.punto-vivo` en el CSS).
 */

type Clave = {
  s: number
  x: number
  y: number
  d: number
  color: string
  el?: HTMLElement
  via?: boolean
  camino: string
  entra: string
}

const limita = (v: number) => Math.min(1, Math.max(0, v))
// Arranca y frena suave entre dos anclas.
const suave = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const frena = (t: number) => 1 - (1 - t) ** 3
// Crece, se pasa un poco y se asienta: el punto al brotar.
const brota = (t: number) => {
  const c = 1.7, u = t - 1
  return 1 + (c + 1) * u * u * u + c * u * u
}

/** Píxeles de scroll entre dos anclas de la misma fila. */
const MISMA_FILA = 120
/** Píxeles de scroll en los que el punto se hunde al dejar un ancla y brota al llegar a otra. */
const HUNDIRSE = 110
const BROTAR = 130
/** Desde dónde entra rodando, en píxeles. */
const RODADA = 44

export function PuntoGuia() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const raiz = document.documentElement
    // La capa ocupa todo el documento y recorta: el punto nunca ensancha la página.
    const capa = document.createElement('div')
    capa.className = 'punto-capa'
    capa.setAttribute('aria-hidden', 'true')
    const punto = document.createElement('div')
    punto.className = 'punto-guia'
    capa.appendChild(punto)
    document.body.appendChild(capa)
    raiz.classList.add('punto-vivo')

    let ultimaForma = '', ultimoColor = '', seVe = false
    const escrito = new WeakMap<HTMLElement, Record<string, string>>()
    const tocados = new Set<HTMLElement>()
    // Solo toca el estilo cuando el valor cambia.
    const escribe = (el: HTMLElement, nombre: string, valor: number) => {
      const v = valor <= 0 ? '0' : valor >= 1 ? '1' : valor.toFixed(4)
      let de = escrito.get(el)
      if (!de) { de = {}; escrito.set(el, de) }
      if (de[nombre] === v) return
      de[nombre] = v
      el.style.setProperty(nombre, v)
      tocados.add(el)
    }

    const tick = () => {
      const S = window.scrollY
      const X = window.scrollX
      const ancho = innerWidth
      const alto = innerHeight
      const linea = lineaLectura()
      const max = Math.max(0, raiz.scrollHeight - alto)
      const claves: Clave[] = []

      // La bola de la portada (o, sin 3D, el punto de la imagen).
      if (puntoHero.listo) {
        claves.push({ s: puntoHero.suelta, x: puntoHero.x, y: puntoHero.y, d: puntoHero.r * 2, color: '', camino: '', entra: '' })
      } else {
        const h = document.querySelector<HTMLElement>('[data-punto-hero]')
        const r = h?.getBoundingClientRect()
        if (r && r.width) claves.push({ s: 0, x: r.left + X + r.width / 2, y: r.top + S + r.height / 2, d: r.width, color: '', camino: '', entra: '' })
      }

      document.querySelectorAll<HTMLElement>('[data-punto]').forEach((el) => {
        const o = el.dataset
        if (o.puntoDesde && ancho < Number(o.puntoDesde)) return
        if (o.puntoHasta && ancho > Number(o.puntoHasta)) return
        const r = el.getBoundingClientRect()
        if (!r.width && !r.height) return
        const tam = o.puntoTam ? Number(o.puntoTam) : r.width
        const color = o.puntoColor || ''
        const desfase = Number(o.puntoDesfase || 0)
        const camino = o.puntoCamino && (!o.puntoCaminoDesde || ancho >= Number(o.puntoCaminoDesde)) ? o.puntoCamino : ''
        const entra = o.puntoEntra || ''
        const cx = r.left + X + r.width / 2
        if (o.punto === 'via') {
          const arriba = r.top + S, abajo = r.bottom + S
          claves.push({ s: arriba - linea + desfase, x: cx, y: arriba, d: tam, color, el, via: true, camino, entra })
          claves.push({ s: abajo - linea + desfase, x: cx, y: abajo, d: tam, color, el, via: true, camino: '', entra: '' })
        } else {
          const cy = r.top + S + r.height / 2
          claves.push({ s: cy - linea + desfase, x: cx, y: cy, d: tam, color, el, camino, entra })
        }
      })
      if (!claves.length) return

      // Lo que tapa al punto, en coordenadas del documento.
      const tapas: [number, number, number, number][] = []
      document.querySelectorAll<HTMLElement>('[data-punto-tapa]').forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.width && r.height) tapas.push([r.left + X, r.top + S, r.right + X, r.bottom + S])
      })

      // Las que están en la misma fila (las tres palabras en escritorio)
      // llegan a la vez a la altura de lectura: se reparten un trozo de
      // scroll para que el punto vaya de una a otra. El reparto empieza medio
      // tramo antes de que la fila llegue a la altura de lectura: así la fila
      // sigue a la vista de la primera a la última aunque la pantalla sea
      // baja, y queda sitio antes para el ancla anterior.
      for (let i = 0; i < claves.length; i++) {
        const p = claves[i]
        if (!p.el || p.via) continue
        let j = i
        while (claves[j + 1] && !claves[j + 1].via && Math.abs(claves[j + 1].y - p.y) < 4 && Math.abs(claves[j + 1].s - p.s) < 4) j++
        if (j === i) continue
        const base = p.s
        for (let m = i; m <= j; m++) claves[m].s = base + (m - i - 0.5) * MISMA_FILA
        i = j
      }
      // En orden. Y las que no llegan antes del final del scroll se reparten
      // lo que queda, para que la última sea el final.
      for (let i = 1; i < claves.length; i++) {
        if (claves[i].s <= claves[i - 1].s) claves[i].s = claves[i - 1].s + 1
      }
      const k = claves.findIndex((c) => c.s > max - 1)
      if (k > 0) {
        const base = claves[k - 1].s, resto = claves.length - k
        for (let i = k; i < claves.length; i++) claves[i].s = base + ((max - base) * (i - k + 1)) / resto
      }

      // Dónde está el punto, cuánto mide y de qué color es. Todo sale del scroll.
      let x = 0, y = 0, d = 0, color = ''
      if (S >= claves[0].s) {
        let i = claves.length - 1
        for (let j = 0; j < claves.length - 1; j++) if (S < claves[j + 1].s) { i = j; break }
        const a = claves[i], b = claves[i + 1]
        if (!b) {
          x = a.x; y = a.y; d = a.d; color = a.color
        } else {
          const tramo = b.s - a.s
          const t = limita((S - a.s) / tramo)
          if (a.via && a.el === b.el) {
            // Por la vía, a la altura de lectura.
            x = a.x; y = a.y + (b.y - a.y) * t; d = a.d; color = a.color
          } else if (b.camino === 'salto') {
            const e = suave(t)
            x = a.x + (b.x - a.x) * e
            y = a.y + (b.y - a.y) * e - Math.sin(Math.PI * e) * Math.min(30, Math.abs(b.x - a.x) * 0.1)
            d = a.d + (b.d - a.d) * e
            color = e < 0.5 ? a.color : b.color
          } else if (b.camino === 'linea') {
            // Se coloca en su vertical antes de llegar y cae recto al hueco.
            const e = suave(t)
            x = a.x + (b.x - a.x) * suave(limita(t * 1.3))
            y = a.y + (b.y - a.y) * e
            d = a.d + (b.d - a.d) * e
            color = e < 0.5 ? a.color : b.color
          } else {
            // Sin camino a la vista: se hunde en el ancla que deja y brota en la siguiente.
            const fuera = Math.min(HUNDIRSE, tramo * 0.4)
            const dentro = Math.min(BROTAR, tramo * 0.4)
            if (S - a.s < fuera) {
              const u = (S - a.s) / fuera
              x = a.x; y = a.y; d = a.d * (1 - u * u); color = a.color
            } else if (b.s - S < dentro) {
              const u = 1 - (b.s - S) / dentro
              x = b.x - (b.entra === 'izquierda' ? (1 - frena(u)) * RODADA : 0)
              y = b.y; d = b.d * Math.max(0, brota(u)); color = b.color
            }
          }
        }
      }

      // Debajo de una tapa se encoge hasta desaparecer: entra por un borde y
      // sale por el otro.
      if (d > 0) {
        for (const [x0, y0, x1, y1] of tapas) {
          if (x <= x0 || x >= x1 || y <= y0 || y >= y1) continue
          const hondo = Math.min(x - x0, x1 - x, y - y0, y1 - y)
          d *= limita(1 - hondo / (d / 2 + 3))
          break
        }
      }

      const visible = d > 0.6
      if (visible) {
        const forma = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${(d / 40).toFixed(4)})`
        if (forma !== ultimaForma) { ultimaForma = forma; punto.style.transform = forma }
        if (color !== ultimoColor) {
          ultimoColor = color
          if (color) punto.style.setProperty('--pg-color', color)
          else punto.style.removeProperty('--pg-color')
        }
      }
      if (visible !== seVe) { seVe = visible; punto.classList.toggle('visible', visible) }

      // Lo que el punto deja escrito en la página.
      for (let j = 0; j < claves.length; j++) {
        const c = claves[j], n = claves[j + 1]
        if (!c.el) continue
        if (c.via) {
          if (n?.el === c.el) {
            c.el.classList.toggle('dentro', S >= c.s && S < n.s)
            escribe(c.el, '--punto-via', limita((S - c.s) / (n.s - c.s)))
          } else {
            c.el.classList.toggle('pasado', S >= c.s)
          }
        } else {
          c.el.classList.toggle('pasado', S >= c.s - 1)
          if (n?.camino === 'linea' && !n.via) {
            const grupo = c.el.closest<HTMLElement>('[data-punto-grupo]') ?? c.el
            escribe(grupo, '--punto-sale', suave(limita((S - c.s) / (n.s - c.s))))
          }
        }
      }
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      capa.remove()
      raiz.classList.remove('punto-vivo')
      tocados.forEach((el) => { el.style.removeProperty('--punto-via'); el.style.removeProperty('--punto-sale') })
      document.querySelectorAll('[data-punto]').forEach((el) => el.classList.remove('pasado', 'dentro'))
    }
  }, [])

  return null
}
