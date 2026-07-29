'use client'

import { useEffect } from 'react'

/**
 * Hace que el brillo del cristal siga al puntero en los elementos `.lq-vivo`.
 *
 * Es lo que separa un cristal vivo de una capa translúcida quieta, y es la
 * parte del lenguaje de Apple que sí se puede llevar a la web sin trampas.
 *
 * Tres cosas de las que depende que esto no cueste rendimiento:
 *  - Un único listener en el documento, no uno por elemento.
 *  - Se escribe en una variable CSS, no se toca layout ni se fuerza reflow.
 *  - No se activa en táctil (no hay puntero) ni con `reduced-motion`, así que
 *    en móvil el coste es exactamente cero.
 */
export function BrilloLiquido() {
  useEffect(() => {
    const finoPuntero = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finoPuntero || reduce) return

    let pendiente = false
    let ultimo: PointerEvent | null = null

    const pintar = () => {
      pendiente = false
      const e = ultimo
      if (!e) return
      const destino = (e.target as Element | null)?.closest?.('.lq-vivo') as HTMLElement | null
      if (!destino) return
      const r = destino.getBoundingClientRect()
      destino.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
      destino.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
    }

    // Se agrupa en un frame: sin esto, un pointermove dispara decenas de
    // escrituras por segundo sin que se vea ninguna diferencia.
    const alMover = (e: PointerEvent) => {
      ultimo = e
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(pintar)
    }

    document.addEventListener('pointermove', alMover, { passive: true })
    return () => document.removeEventListener('pointermove', alMover)
  }, [])

  return null
}
