'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { lineaLectura, puntoHero } from './punto-estado'

/**
 * El punto de la n acompaña toda la página.
 *
 * Sale de la bola de la portada y va de ancla en ancla al ritmo del scroll:
 * se posa en el número de cada capítulo, marca cada problema, salta por las
 * tres palabras de lo que hacemos, baja por la lista del ejemplo, toma el
 * color de cada proyecto, recorre el proceso y acaba dentro de la n del
 * contacto. Cada sección le da una razón para seguir.
 *
 * Las anclas son elementos con `data-punto`:
 * - `data-punto=""`: un sitio donde el punto se posa al pasar por la altura de lectura.
 * - `data-punto="via"`: una vía vertical; el punto baja por ella a la altura de lectura.
 * - `data-punto="pausa"`: mientras la altura de lectura está dentro, el punto se esconde.
 * Y opciones: `data-punto-tam` (diámetro en px; si no, el ancho del ancla),
 * `data-punto-color`, `data-punto-desfase` (px de scroll de retraso) y
 * `data-punto-desde` / `data-punto-hasta` (anchos de pantalla en los que cuenta).
 *
 * Entre dos anclas cercanas el punto salta con un arranque y una frenada
 * suaves. Entre dos lejanas no cruza la página flotando por encima del
 * contenido: se queda en la altura de lectura, se apaga por el camino y
 * vuelve a encenderse justo antes de la siguiente, esperándola.
 *
 * Al pasar, el ancla recibe la clase `pasado` (y una vía, `dentro` mientras
 * el punto la recorre). Sin JavaScript o con movimiento reducido no hay punto
 * y las anclas se ven ya completas (ver `.punto-vivo` en el CSS).
 */

type Clave = { s: number; x: number; y: number; d: number; color: string; el?: HTMLElement; via?: boolean }

// Arranca y frena suave entre dos anclas.
const suave = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
/** Píxeles de scroll entre dos anclas de la misma fila. */
const MISMA_FILA = 120

export function PuntoGuia() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const raiz = document.documentElement
    const punto = document.createElement('div')
    punto.className = 'punto-guia'
    punto.setAttribute('aria-hidden', 'true')
    document.body.appendChild(punto)
    raiz.classList.add('punto-vivo')

    let x = 0, y = 0, d = 0, primera = true, colorActual = ''

    const tick = () => {
      const S = window.scrollY
      const ancho = innerWidth
      const alto = innerHeight
      const linea = lineaLectura()
      const max = Math.max(0, raiz.scrollHeight - alto)
      const claves: Clave[] = []
      const pausas: [number, number][] = []

      // La bola de la portada (o, sin 3D, el punto de la imagen).
      if (puntoHero.listo) {
        claves.push({ s: puntoHero.suelta, x: puntoHero.x, y: puntoHero.y, d: puntoHero.r * 2, color: '' })
      } else {
        const h = document.querySelector<HTMLElement>('[data-punto-hero]')
        const r = h?.getBoundingClientRect()
        if (r && r.width) claves.push({ s: 0, x: r.left + r.width / 2, y: r.top + r.height / 2, d: r.width, color: '' })
      }

      document.querySelectorAll<HTMLElement>('[data-punto]').forEach((el) => {
        const o = el.dataset
        if (o.puntoDesde && ancho < Number(o.puntoDesde)) return
        if (o.puntoHasta && ancho > Number(o.puntoHasta)) return
        const r = el.getBoundingClientRect()
        if (!r.width && !r.height) return
        if (o.punto === 'pausa') { pausas.push([r.top, r.bottom]); return }
        const tam = o.puntoTam ? Number(o.puntoTam) : r.width
        const color = o.puntoColor || ''
        const desfase = Number(o.puntoDesfase || 0)
        const cx = r.left + r.width / 2
        if (o.punto === 'via') {
          claves.push({ s: S + r.top - linea + desfase, x: cx, y: r.top, d: tam, color, el, via: true })
          claves.push({ s: S + r.bottom - linea + desfase, x: cx, y: r.bottom, d: tam, color, el, via: true })
        } else {
          const cy = r.top + r.height / 2
          claves.push({ s: S + cy - linea + desfase, x: cx, y: cy, d: tam, color, el })
        }
      })
      if (!claves.length) return

      // En orden. Las que están en la misma fila (las tres palabras en
      // escritorio) llegan a la vez a la altura de lectura: se reparten un
      // trozo de scroll para que el punto salte de una a otra. Y las que no
      // llegan antes del final del scroll se reparten lo que queda, para que
      // la última sea el final.
      for (let i = 1; i < claves.length; i++) {
        const p = claves[i - 1], c = claves[i]
        if (p.el && !p.via && !c.via && Math.abs(c.y - p.y) < 4 && c.s - p.s < 4) c.s = p.s + MISMA_FILA
        else if (c.s <= p.s) c.s = p.s + 1
      }
      const k = claves.findIndex((c) => c.s > max - 1)
      if (k > 0) {
        const base = claves[k - 1].s, resto = claves.length - k
        for (let i = k; i < claves.length; i++) claves[i].s = base + ((max - base) * (i - k + 1)) / resto
      }

      let px: number, py: number, pd: number, color: string
      let dormido = false
      const visible = S >= claves[0].s
      let i = claves.length - 1
      for (let j = 0; j < claves.length - 1; j++) if (S < claves[j + 1].s) { i = j; break }
      const a = claves[i], b = claves[i + 1]
      if (!visible || !b) {
        const c = visible ? a : claves[0]
        px = c.x; py = c.y; pd = c.d; color = c.color
      } else {
        const t = Math.min(1, Math.max(0, (S - a.s) / (b.s - a.s)))
        const enVia = a.via && a.el === b.el
        // Tramo largo: más de una pantalla de scroll de un ancla a la otra.
        const largo = !enVia && b.s - a.s > alto
        const e = enVia || largo ? t : suave(t)
        dormido = largo && S - a.s > alto * 0.2 && b.s - S > alto * 0.3
        px = a.x + (b.x - a.x) * e
        py = a.y + (b.y - a.y) * e
        pd = a.d + (b.d - a.d) * e
        color = e < 0.5 ? a.color : b.color
      }

      const enPausa = dormido || pausas.some(([arriba, abajo]) => linea > arriba && linea < abajo)
      const f = primera || !visible ? 1 : 0.4
      x += (px - x) * f
      y += (py - y) * f
      d += (pd - d) * f
      primera = false
      punto.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${(d / 40).toFixed(4)})`
      // `visible` cambia de golpe (es el relevo con la bola 3D, que también
      // desaparece de golpe); `en-pausa` se funde.
      punto.classList.toggle('visible', visible)
      punto.classList.toggle('en-pausa', enPausa)
      if (color !== colorActual) {
        colorActual = color
        if (color) punto.style.setProperty('--pg-color', color)
        else punto.style.removeProperty('--pg-color')
      }

      for (let j = 0; j < claves.length; j++) {
        const c = claves[j]
        if (!c.el) continue
        if (c.via) {
          if (claves[j + 1]?.el === c.el) c.el.classList.toggle('dentro', S >= c.s && S < claves[j + 1].s)
          else c.el.classList.toggle('pasado', S >= c.s)
        } else {
          c.el.classList.toggle('pasado', S >= c.s - 1)
        }
      }
    }

    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      punto.remove()
      raiz.classList.remove('punto-vivo')
    }
  }, [])

  return null
}
