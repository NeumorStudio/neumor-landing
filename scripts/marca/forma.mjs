// La forma del logo: la n en arco con el punto dentro.
// Todo se mide en una caja de 100 x 100. Es la versión 6, «Rectas suaves»: la
// misma n que eligieron Stark y Carlos el 9 de noviembre de 2026, dibujada como
// forma rellena. Stark la aceptó el 10 de noviembre de 2026, con el punto sin color.
//
// Qué cambia respecto a la 5:
// - Las patas acaban en recto, con esquinas suaves, y no en redondo.
// - El arco es un poco más fino arriba (13,8 frente a 15). Un arco del mismo
//   grosor que las patas se ve más gordo arriba; así se ve igual.
// - El logo va a una tinta: la n y el punto, del mismo color.

// Los neutros de la marca. No hay color de acento: el punto se queda sin color
// para poder jugar con él (moverlo, encenderlo, darle el color de cada cliente).
export const CARBON = "#17181F";
export const GRAFITO = "#23242C";
export const PORCELANA = "#E8E6E1";
export const PAPEL = "#FBFAF8";

// El maestro: patas centradas en x 30 y 70, arco de radio 20 y grosor 15.
// - arriba: grosor del arco en lo alto, en proporción al de las patas.
// - esquina: radio de las esquinas de las patas.
export const MAESTRO = {
  x0: 30, r: 20, trazo: 15, base: 71, piernas: 22, arriba: 0.92, esquina: 2.5,
  punto: { cy: 62, r: 6.5 },
};

// Para favicons de 16 a 48 px: el arco se abre un poco y el punto crece, para
// que a 16 px no se pegue a las patas. Es la misma n a la vista.
export const PEQUENA = {
  x0: 27, r: 23, trazo: 14, base: 72, piernas: 22, arriba: 0.94, esquina: 2,
  punto: { cy: 63, r: 7.5 },
};

const r2 = (v) => +v.toFixed(2);

// La línea central del arco, de pata a pata. No es el logo: sirve de guía para
// animaciones que dibujan la n (máscaras, recorridos).
export const arcoD = (f) => {
  const arriba = f.base - f.piernas;
  return `M${f.x0} ${f.base}V${arriba}A${f.r} ${f.r} 0 0 1 ${f.x0 + 2 * f.r} ${arriba}V${f.base}`;
};

// La n como forma rellena: contorno exterior, pata derecha, hueco y pata izquierda.
export function nD(f) {
  const h = f.trazo / 2;
  const L = f.x0 - h, Li = f.x0 + h;
  const Ri = f.x0 + 2 * f.r - h, R = f.x0 + 2 * f.r + h;
  const cy = f.base - f.piernas;
  const rO = f.r + h, rI = f.r - h;
  // El centro del hueco sube para que el arco adelgace arriba sin tocar las patas.
  const cyI = r2(cy - f.trazo * (1 - f.arriba));
  const B = f.base + h, c = f.esquina;
  return (
    `M${L} ${B - c}V${cy}A${rO} ${rO} 0 0 1 ${R} ${cy}V${B - c}` +
    `A${c} ${c} 0 0 1 ${R - c} ${B}H${Ri + c}A${c} ${c} 0 0 1 ${Ri} ${B - c}` +
    `V${cyI}A${rI} ${rI} 0 0 0 ${Li} ${cyI}V${B - c}` +
    `A${c} ${c} 0 0 1 ${Li - c} ${B}H${L + c}A${c} ${c} 0 0 1 ${L} ${B - c}Z`
  );
}

export const centroX = (f) => f.x0 + f.r;

// Lo que ocupa la n.
export function caja(f) {
  const m = f.trazo / 2;
  const x = f.x0 - m;
  const y = f.base - f.piernas - f.r - m;
  return { x, y, ancho: 2 * f.r + f.trazo, alto: f.piernas + f.r + f.trazo };
}

export const punto = (f, color, extra = "") =>
  `<circle cx="${centroX(f)}" cy="${f.punto.cy}" r="${f.punto.r}" fill="${color}"${extra}/>`;

// La n completa a una tinta. `extra` añade atributos (un filtro, por ejemplo) a las dos piezas.
export const n = (f, color, extra = "") => `<path d="${nD(f)}" fill="${color}"${extra}/>${punto(f, color, extra)}`;

// Escala y centra la n para que su lado mayor ocupe `parte` de la caja.
export function encaja(f, parte, dentro) {
  const c = caja(f);
  const k = (100 * parte) / Math.max(c.ancho, c.alto);
  const cx = c.x + c.ancho / 2;
  const cy = c.y + c.alto / 2;
  return `<g transform="translate(50 50) scale(${+k.toFixed(4)}) translate(${-cx} ${-cy})">${dentro}</g>`;
}
