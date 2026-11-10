// Los acabados de la n: plano y en relieve (claro y oscuro).
// Son SVG con filtros y se rasterizan con sharp, así que salen igual en
// cualquier máquina. Sin brillos, sin cristal y sin luces de color: la n es
// material, como una tecla, y el relieve solo se usa en piezas grandes.
import { CARBON, MAESTRO, PORCELANA, n } from "./forma.mjs";

const U = "userSpaceOnUse";

export const ACABADOS = {
  plano: { nombre: "Plano", fondo: CARBON, tinta: PORCELANA },
  relieveClaro: { nombre: "Relieve claro", fondo: PORCELANA, tinta: PORCELANA, filtro: "rc" },
  relieveOscuro: { nombre: "Relieve oscuro", fondo: "#1E1F26", tinta: "#26272F", filtro: "ro" },
};

// Sale del fondo: sombra abajo a la derecha, luz arriba a la izquierda y un bisel fino.
function relieve(id, sombra, opSombra, luz, opLuz, opBiselOsc, opBiselLuz) {
  return (
    `<filter id="${id}" filterUnits="${U}" x="-20" y="-20" width="140" height="140" color-interpolation-filters="sRGB">` +
    `<feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="b"/>` +
    `<feOffset in="b" dx="2.4" dy="2.7" result="o1"/><feFlood flood-color="${sombra}" flood-opacity="${opSombra}"/><feComposite in2="o1" operator="in" result="sombra"/>` +
    `<feOffset in="b" dx="-2.1" dy="-2.1" result="o2"/><feFlood flood-color="${luz}" flood-opacity="${opLuz}"/><feComposite in2="o2" operator="in" result="luz"/>` +
    `<feComponentTransfer in="SourceAlpha" result="fuera"><feFuncA type="table" tableValues="1 0"/></feComponentTransfer>` +
    `<feGaussianBlur in="fuera" stdDeviation=".9" result="fb"/>` +
    `<feOffset in="fb" dx="-.8" dy="-.8" result="f1"/><feFlood flood-color="${sombra}" flood-opacity="${opBiselOsc}"/><feComposite in2="f1" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="biselOsc"/>` +
    `<feOffset in="fb" dx=".8" dy=".8" result="f2"/><feFlood flood-color="#FFFFFF" flood-opacity="${opBiselLuz}"/><feComposite in2="f2" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="biselLuz"/>` +
    `<feMerge><feMergeNode in="sombra"/><feMergeNode in="luz"/><feMergeNode in="SourceGraphic"/><feMergeNode in="biselOsc"/><feMergeNode in="biselLuz"/></feMerge>` +
    `</filter>`
  );
}

const FILTROS = {
  rc: relieve("rc", "#8F877A", 0.5, "#FFFFFF", 0.95, 0.28, 0.8),
  ro: relieve("ro", "#000000", 0.62, "#FFFFFF", 0.1, 0.35, 0.17),
};

/**
 * Pinta la n en un acabado.
 * - fondo: true pone el color del acabado, un color lo sustituye y false lo deja transparente.
 * - margen: unidades que se añaden alrededor de la caja de 100, para que la
 *   sombra del relieve no se corte al quitar el fondo.
 * - radio: esquinas del fondo, para iconos sueltos.
 */
export function acabado(estilo, { fondo = true, margen = 0, radio = 0, f = MAESTRO } = {}) {
  const a = ACABADOS[estilo];
  if (!a) throw new Error(`Acabado desconocido: ${estilo}`);
  const defs = a.filtro ? `<defs>${FILTROS[a.filtro]}</defs>` : "";
  const cuerpo = n(f, a.tinta, a.filtro ? ` filter="url(#${a.filtro})"` : "");
  const color = fondo === true ? a.fondo : fondo;
  const lado = 100 + 2 * margen;
  const capaFondo = color
    ? `<rect x="${-margen}" y="${-margen}" width="${lado}" height="${lado}"${radio ? ` rx="${radio}"` : ""} fill="${color}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margen} ${-margen} ${lado} ${lado}" role="img" aria-label="NeumorStudio">${defs}${capaFondo}${cuerpo}</svg>\n`;
}
