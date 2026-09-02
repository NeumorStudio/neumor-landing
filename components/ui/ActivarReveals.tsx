'use client'

import { useEffect } from 'react'

/**
 * Las entradas por scroll, sin GSAP.
 *
 * Esto sustituye a ScrollTrigger —18 KB comprimidos— por el observador que el
 * navegador ya trae. Lo que hacía era: cuando una sección llega al 80 % de la
 * ventana, aparecen sus hijos escalonados y no vuelve a pasar. Eso es un
 * `IntersectionObserver` con margen y una clase. El mismo patrón que la barra
 * de navegación ya usaba para marcar la sección activa.
 *
 * El escalonado tampoco lo hace JavaScript: se escribe un índice por hijo y el
 * retardo lo calcula el CSS. Así la interpolación va en el compositor y este
 * fichero no toca ni una propiedad de estilo animada.
 *
 * Importante para el LCP: el estado inicial oculto vive en el CSS, no aquí.
 * Antes lo aplicaba GSAP al hidratar, así que el contenido se pintaba, se
 * escondía y volvía a aparecer.
 */
export function ActivarReveals() {
  useEffect(() => {
    // Sin movimiento no hay nada que observar: el CSS ya los deja visibles.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue
          entrada.target.classList.add('visible')
          // Una sola vez, como el `toggleActions: 'play none none none'` de antes.
          observador.unobserve(entrada.target)
        }
      },
      { rootMargin: '0px 0px -20% 0px' } // equivale al viejo start: 'top 80%'
    )

    document.querySelectorAll<HTMLElement>('.reveal, .nichos-section').forEach((seccion) => {
      seccion.querySelectorAll<HTMLElement>(':scope > *').forEach((hijo, i) => {
        hijo.style.setProperty('--i', String(i))
      })
      observador.observe(seccion)
    })

    return () => observador.disconnect()
  }, [])

  return null
}
