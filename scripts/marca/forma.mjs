// La forma del logo: la n en arco con el punto ámbar dentro.
// Todo se mide en una caja de 100 x 100. Es la versión 5, «Punto dentro»,
// que eligieron Stark y Carlos el 9 de noviembre de 2026.

export const AMBAR = "#F2A93B";
export const AMBAR_SOBRE_CLARO = "#E8962A";

// El maestro: patas en x 30 y 70, arco de radio 20 y trazo de 15.
export const MAESTRO = { x0: 30, r: 20, trazo: 15, base: 71, piernas: 22, punto: { cy: 62, r: 6.5 } };

// Para favicons de 16 a 48 px: el arco se abre un poco y el punto crece, para
// que a 16 px no se pegue a las patas. Es la misma n a la vista.
export const PEQUENA = { x0: 27, r: 23, trazo: 14, base: 72, piernas: 22, punto: { cy: 63, r: 7.5 } };

export const arcoD = (f) => {
  const arriba = f.base - f.piernas;
  return `M${f.x0} ${f.base}V${arriba}A${f.r} ${f.r} 0 0 1 ${f.x0 + 2 * f.r} ${arriba}V${f.base}`;
};

export const centroX = (f) => f.x0 + f.r;

// Lo que ocupa la n con el grosor del trazo incluido.
export function caja(f) {
  const m = f.trazo / 2;
  const x = f.x0 - m;
  const y = f.base - f.piernas - f.r - m;
  return { x, y, ancho: 2 * f.r + f.trazo, alto: f.piernas + f.r + f.trazo };
}

export const arco = (f, color) =>
  `<path d="${arcoD(f)}" fill="none" stroke="${color}" stroke-width="${f.trazo}" stroke-linecap="round" stroke-linejoin="round"/>`;

export const punto = (f, color) => `<circle cx="${centroX(f)}" cy="${f.punto.cy}" r="${f.punto.r}" fill="${color}"/>`;

// Escala y centra la n para que su lado mayor ocupe `parte` de la caja.
export function encaja(f, parte, dentro) {
  const c = caja(f);
  const k = (100 * parte) / Math.max(c.ancho, c.alto);
  const cx = c.x + c.ancho / 2;
  const cy = c.y + c.alto / 2;
  return `<g transform="translate(50 50) scale(${+k.toFixed(4)}) translate(${-cx} ${-cy})">${dentro}</g>`;
}
