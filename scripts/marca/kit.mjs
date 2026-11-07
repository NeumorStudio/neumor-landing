// Genera los logos y los iconos a partir del maestro, public/marca/ns-marca.svg.
// Uso: node scripts/marca/kit.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = "public/marca";
const DIR_WEB = "public/icons";
const LADO = 2820;
const NS_MAESTRO = 0.883; // Alto del NS dentro del lienzo del maestro
const NS_ICONO = 0.66; // En iconos deja aire y aguanta un recorte redondo
const NS_FAVICON = 0.82; // A 16 px el aire le quita lectura
const RADIO = LADO * 0.22;

const NEGRO = "#0B0B0F";
const BLANCO = "#FFFFFF";
const AMBAR = "#F2A93B";
const TECLA_LUZ = "#22242D";
const TECLA_SOMBRA = "#15161C";

const d = fs.readFileSync(path.join(DIR, "ns-marca.svg"), "utf8").match(/ d="([^"]+)"/)[1];

const envolver = (dentro) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${LADO} ${LADO}" role="img" aria-label="NeumorStudio">${dentro}</svg>\n`;

function ns(fill, parte = NS_MAESTRO, atributos = "") {
  const k = (parte / NS_MAESTRO).toFixed(4);
  const escala = parte === NS_MAESTRO ? "" : ` transform="translate(${LADO / 2} ${LADO / 2}) scale(${k}) translate(${-LADO / 2} ${-LADO / 2})"`;
  return `<path${escala} fill="${fill}" fill-rule="evenodd" ${atributos}d="${d}"/>`;
}

// La tecla: luz arriba a la izquierda, como las piezas de la web, y el NS con una sombra suave.
function tecla(radio) {
  return [
    `<defs><linearGradient id="tecla" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${TECLA_LUZ}"/><stop offset="1" stop-color="${TECLA_SOMBRA}"/></linearGradient>`,
    `<filter id="sombra" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${LADO * 0.012}"/></filter></defs>`,
    `<rect width="${LADO}" height="${LADO}" rx="${radio}" fill="url(#tecla)"/>`,
    `<g transform="translate(${LADO * 0.008} ${LADO * 0.012})" filter="url(#sombra)" opacity="0.6">${ns("#000000", NS_ICONO)}</g>`,
    ns(BLANCO, NS_ICONO),
  ].join("");
}

const piezas = {
  "ns-marca-blanco.svg": envolver(ns(BLANCO)),
  "ns-marca-negro.svg": envolver(ns(NEGRO)),
  "ns-marca-ambar.svg": envolver(ns(AMBAR)),
  "ns-icono-oscuro.svg": envolver(tecla(RADIO)),
  "ns-icono-ambar.svg": envolver(`<rect width="${LADO}" height="${LADO}" rx="${RADIO}" fill="${AMBAR}"/>${ns(NEGRO, NS_ICONO)}`),
};
for (const [nombre, contenido] of Object.entries(piezas)) fs.writeFileSync(path.join(DIR, nombre), contenido);

// La web pinta el NS en línea para que tome el color del tema y no parpadee al cargar.
fs.writeFileSync(
  "components/ui/ns-trazado.ts",
  `// Generado por scripts/marca/kit.mjs a partir de public/marca/ns-marca.svg. No se edita a mano.\nexport const NS_TRAZADO =\n  "${d}";\n`,
);

// Se rasteriza a cuatro veces el tamaño y se reduce: los bordes salen más limpios.
function png(svg, lado, opaco) {
  const grande = svg.replace("<svg ", `<svg width="${lado * 4}" height="${lado * 4}" `);
  let imagen = sharp(Buffer.from(grande)).resize(lado, lado, { kernel: "lanczos3" });
  if (opaco) imagen = imagen.flatten({ background: NEGRO }).removeAlpha();
  return imagen.png({ compressionLevel: 9 }).toBuffer();
}

// Un .ico es una cabecera, una entrada por tamaño y los PNG uno detrás de otro.
function ico(imagenes) {
  const cabecera = Buffer.alloc(6);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(imagenes.length, 4);
  let posicion = 6 + 16 * imagenes.length;
  const entradas = imagenes.map(({ lado, datos }) => {
    const e = Buffer.alloc(16);
    e[0] = lado;
    e[1] = lado;
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(datos.length, 8);
    e.writeUInt32LE(posicion, 12);
    posicion += datos.length;
    return e;
  });
  return Buffer.concat([cabecera, ...entradas, ...imagenes.map((i) => i.datos)]);
}

// Favicons: plano, porque a este tamaño el relieve no se ve.
const favicon = envolver(`<rect width="${LADO}" height="${LADO}" rx="${RADIO}" fill="${NEGRO}"/>${ns(BLANCO, NS_FAVICON)}`);
const pequenos = [];
for (const lado of [16, 32, 48]) {
  const datos = await png(favicon, lado, false);
  pequenos.push({ lado, datos });
  fs.writeFileSync(path.join(DIR, `icono-${lado}.png`), datos);
  if (lado < 48) fs.writeFileSync(path.join(DIR_WEB, `favicon-${lado}x${lado}.png`), datos);
}
fs.writeFileSync("app/favicon.ico", ico(pequenos));

// Apple, Google y las PWA redondean por su cuenta, y App Store no admite transparencia.
const cuadrado = envolver(tecla(0));
for (const lado of [180, 192, 512, 1024]) fs.writeFileSync(path.join(DIR, `icono-${lado}.png`), await png(cuadrado, lado, true));
for (const lado of [72, 96, 128, 144, 152, 192, 384, 512]) fs.writeFileSync(path.join(DIR_WEB, `icon-${lado}x${lado}.png`), await png(cuadrado, lado, true));
fs.writeFileSync(path.join(DIR_WEB, "apple-touch-icon.png"), await png(cuadrado, 180, true));

console.log("Kit generado en", DIR, "y", DIR_WEB);
