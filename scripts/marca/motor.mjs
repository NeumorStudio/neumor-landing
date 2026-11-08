// Los acabados de la n: cristal, blanco con relieve y neumórfico oscuro y claro.
// Son SVG con filtros. Es el mismo motor del boceto que vieron Stark y Carlos,
// y se rasteriza con sharp, así que sale igual en cualquier máquina.
import { MAESTRO, arcoD, centroX } from "./forma.mjs";

const U = "userSpaceOnUse";

export const ACABADOS = {
  cristal: { nombre: "Cristal", fondo: "#14151B" },
  blanco: { nombre: "Blanco con relieve", fondo: "#1B1C23" },
  relieveOscuro: { nombre: "Neumórfico oscuro", fondo: "#1B1C23" },
  relieveClaro: { nombre: "Neumórfico claro", fondo: "#E9E7E3" },
};

function filtros(id) {
  const reg = `filterUnits="${U}" x="-20" y="-20" width="140" height="140" color-interpolation-filters="sRGB"`;
  const interior = (c, dx, dy, b, res) =>
    `<feComponentTransfer in="SourceAlpha" result="inv${res}"><feFuncA type="table" tableValues="1 0"/></feComponentTransfer><feGaussianBlur in="inv${res}" stdDeviation="${b}"/><feOffset dx="${dx}" dy="${dy}" result="o${res}"/><feFlood flood-color="${c}"/><feComposite in2="o${res}" operator="in"/><feComposite in2="SourceAlpha" operator="in" result="${res}"/>`;
  // Sale del fondo: sombra oscura abajo a la derecha, luz arriba a la izquierda y un bisel.
  const sale = (osc, cla, b, o, bevO, bevC) =>
    `<feGaussianBlur in="SourceAlpha" stdDeviation="${b}" result="bl"/><feOffset in="bl" dx="${o}" dy="${o}" result="d1"/><feFlood flood-color="${osc}"/><feComposite in2="d1" operator="in" result="dk"/><feOffset in="bl" dx="${-o * 0.8}" dy="${-o * 0.8}" result="l1"/><feFlood flood-color="${cla}"/><feComposite in2="l1" operator="in" result="lt"/>${interior(bevO, 1.2, 1.2, 1.4, "bo")}${interior(bevC, -1, -1, 1.2, "bc")}<feMerge><feMergeNode in="dk"/><feMergeNode in="lt"/><feMergeNode in="SourceGraphic"/><feMergeNode in="bo"/><feMergeNode in="bc"/></feMerge>`;
  const grad = (n, a, b, x2 = 100) =>
    `<linearGradient id="${id}${n}" gradientUnits="${U}" x1="0" y1="0" x2="${x2}" y2="100"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
  return [
    `<filter id="${id}so" ${reg}>${sale("rgba(0,0,0,.72)", "rgba(255,255,255,.075)", 3.2, 3.4, "rgba(0,0,0,.35)", "rgba(255,255,255,.07)")}</filter>`,
    `<filter id="${id}sb" ${reg}>${sale("rgba(0,0,0,.8)", "rgba(255,255,255,.08)", 3.4, 3.6, "rgba(60,50,40,.28)", "rgba(255,255,255,.9)")}</filter>`,
    `<filter id="${id}sc" ${reg}>${sale("rgba(150,138,124,.55)", "rgba(255,255,255,.95)", 3.2, 3.4, "rgba(150,138,124,.25)", "rgba(255,255,255,.8)")}</filter>`,
    `<filter id="${id}gl" ${reg}><feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
    `<filter id="${id}bl" ${reg}><feGaussianBlur stdDeviation="6"/></filter>`,
    `<filter id="${id}bs" ${reg}><feGaussianBlur stdDeviation="14"/></filter>`,
    `<filter id="${id}ed" ${reg}><feMorphology in="SourceAlpha" operator="erode" radius=".9" result="e"/><feComposite in="SourceAlpha" in2="e" operator="out" result="borde"/><feFlood flood-color="#fff" flood-opacity=".75"/><feComposite in2="borde" operator="in"/></filter>`,
    `<filter id="${id}sh" ${reg}><feGaussianBlur in="SourceAlpha" stdDeviation="3"/><feOffset dx="2.5" dy="4"/><feComponentTransfer><feFuncA type="linear" slope=".55"/></feComponentTransfer></filter>`,
    grad("go", "#25262F", "#17181E"),
    grad("gb", "#FFFFFF", "#D9D5CE"),
    grad("gc", "#F5F3EF", "#DEDAD4"),
    grad("ga", "#FFC970", "#E8922A"),
    `<linearGradient id="${id}gh" gradientUnits="${U}" x1="0" y1="0" x2="60" y2="100"><stop offset="0" stop-color="#fff" stop-opacity=".38"/><stop offset=".45" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/></linearGradient>`,
  ].join("");
}

/**
 * Pinta la n en un acabado.
 * - fondo: true pone el color del acabado, un color lo sustituye y false lo deja transparente.
 * - margen: unidades que se añaden alrededor de la caja de 100. El cristal echa
 *   luz fuera de la caja, y sin margen se cortaría en seco al quitar el fondo.
 * - radio: esquinas del fondo, para iconos sueltos.
 */
export function acabado(estilo, { fondo = true, margen = 0, radio = 0, id = "n", f = MAESTRO } = {}) {
  const g = (s) => `url(#${id}${s})`;
  const base = (color, filtro) =>
    `<path d="${arcoD(f)}" fill="none" stroke="${color}" stroke-width="${f.trazo}" stroke-linecap="round" stroke-linejoin="round"${filtro ? ` filter="${g(filtro)}"` : ""}/>`;
  const punto = (filtro) =>
    `<circle cx="${centroX(f)}" cy="${f.punto.cy}" r="${f.punto.r}" fill="${g("ga")}" filter="${g(filtro)}"/>`;

  let cuerpo;
  if (estilo === "relieveOscuro") cuerpo = base(g("go"), "so") + punto("gl");
  else if (estilo === "blanco") cuerpo = base(g("gb"), "sb") + punto("gl");
  else if (estilo === "relieveClaro") cuerpo = base(g("gc"), "sc") + punto("sc");
  else if (estilo === "cristal") {
    // Dos luces detrás, ámbar y azul, que el cristal deja ver desenfocadas.
    const luces = `<circle cx="36" cy="36" r="27" fill="#F2A93B"/><circle cx="70" cy="70" r="22" fill="#6D7BFF" opacity=".55"/>`;
    cuerpo =
      `<g filter="${g("bs")}" opacity=".85">${luces}</g>` +
      `<mask id="${id}m" maskUnits="${U}" x="0" y="0" width="100" height="100">${base("#fff")}</mask>` +
      `<g filter="${g("sh")}">${base("#000")}</g>` +
      `<g mask="url(#${id}m)"><rect width="100" height="100" fill="#14151B"/><g filter="${g("bl")}">${luces}</g><rect width="100" height="100" fill="#fff" opacity=".14"/><rect width="100" height="100" fill="${g("gh")}"/></g>` +
      `<g filter="${g("ed")}">${base("#fff")}</g>` +
      punto("gl");
  } else throw new Error(`Acabado desconocido: ${estilo}`);

  const color = fondo === true ? ACABADOS[estilo].fondo : fondo;
  const lado = 100 + 2 * margen;
  const capaFondo = color
    ? `<rect x="${-margen}" y="${-margen}" width="${lado}" height="${lado}"${radio ? ` rx="${radio}"` : ""} fill="${color}"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-margen} ${-margen} ${lado} ${lado}" role="img" aria-label="NeumorStudio"><defs>${filtros(id)}</defs>${capaFondo}${cuerpo}</svg>\n`;
}
