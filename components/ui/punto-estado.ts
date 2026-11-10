/**
 * Lo que comparten la n en 3D de la portada y el punto que recorre la página.
 *
 * La portada escribe aquí, en cada fotograma, dónde está la bola en la
 * pantalla y a partir de qué scroll se suelta. El punto lo lee y, desde ese
 * momento, sale de ese sitio exacto: así parece la misma pieza.
 */
export const puntoHero = {
  /** Centro de la bola en la pantalla, en píxeles. */
  x: 0,
  y: 0,
  /** Radio de la bola en la pantalla, en píxeles. */
  r: 0,
  /** Scroll (en píxeles) a partir del cual la bola se suelta y sigue el punto. */
  suelta: 0,
  /** La escena 3D está pintando y estos datos valen. */
  listo: false,
}

/**
 * La altura de lectura, en tanto por ciento de la pantalla: por ahí pasa el
 * punto y ahí se enciende cada cosa. En móvil va algo más abajo, porque la
 * barra de arriba tapa más en proporción.
 */
export const lineaLecturaPct = () => (window.innerWidth < 768 ? 56 : 50)

/** La altura de lectura en píxeles desde arriba de la pantalla. */
export const lineaLectura = () => (window.innerHeight * lineaLecturaPct()) / 100
