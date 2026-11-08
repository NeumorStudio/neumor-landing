// Genera el kit de la marca a partir de la forma de la n (scripts/marca/forma.mjs).
// Uso: node scripts/marca/kit.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { AMBAR, AMBAR_SOBRE_CLARO, MAESTRO, PEQUENA, arco, caja, encaja, punto } from "./forma.mjs";
import { acabado } from "./motor.mjs";

const DIR = "public/marca";
const NEGRO = "#0B0B0F";
const BLANCO = "#FFFFFF";
const CARBON = "#17181F";
const RADIO = 22; // Esquinas de los iconos sueltos, sobre 100
const N_FAVICON = 0.84; // A 16 px el aire le quita lectura

// Los logos planos van recortados a la n, con medio punto de aire.
const c = caja(MAESTRO);
const vista = `${c.x - 1} ${c.y - 0.5} ${c.ancho + 2} ${c.alto + 1}`;
const plano = (colorArco, colorPunto) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vista}" role="img" aria-label="NeumorStudio">${arco(MAESTRO, colorArco)}${punto(MAESTRO, colorPunto)}</svg>\n`;

const piezas = {
  "n-marca.svg": plano("currentColor", AMBAR),
  "n-marca-blanco.svg": plano(BLANCO, AMBAR),
  "n-marca-negro.svg": plano(NEGRO, AMBAR_SOBRE_CLARO),
  "n-marca-una-tinta.svg": plano("currentColor", "currentColor"),
  "n-icono.svg": acabado("blanco", { radio: RADIO }),
  "n-icono-cristal.svg": acabado("cristal", { radio: RADIO }),
};
for (const [nombre, contenido] of Object.entries(piezas)) fs.writeFileSync(path.join(DIR, nombre), contenido);

// Lo pequeño se rasteriza a cuatro veces el tamaño y se reduce: los bordes salen más limpios.
async function imagen(svg, lado, { opaco = false, formato = "png" } = {}) {
  const k = lado <= 512 ? 4 : 1;
  const grande = svg.replace("<svg ", `<svg width="${lado * k}" height="${lado * k}" `);
  let img = sharp(Buffer.from(grande)).resize(lado, lado, { kernel: "lanczos3" });
  if (opaco) img = img.flatten({ background: NEGRO }).removeAlpha();
  if (formato === "webp") return img.webp({ quality: 88, alphaQuality: 90, effort: 6 }).toBuffer();
  if (formato === "jpg") return img.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  return img.png({ compressionLevel: 9 }).toBuffer();
}
const guarda = async (nombre, svg, lado, opciones) =>
  fs.writeFileSync(path.join(DIR, nombre), await imagen(svg, lado, opciones));

// Favicons: planos y con la n pequeña, porque a este tamaño el relieve no se ve.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="${RADIO}" fill="${NEGRO}"/>${encaja(PEQUENA, N_FAVICON, arco(PEQUENA, BLANCO) + punto(PEQUENA, AMBAR))}</svg>`;
for (const lado of [16, 32, 48]) await guarda(`icono-${lado}.png`, favicon, lado);

// Apple, Google y las PWA redondean por su cuenta, y App Store no admite transparencia.
const cuadrado = acabado("blanco");
for (const lado of [180, 192, 512, 1024]) await guarda(`icono-${lado}.png`, cuadrado, lado, { opaco: true });

// Acabados en grande, sobre su fondo. Por debajo de unos 200 px se usa el plano.
const acabados = { "n-cristal": "cristal", "n-blanco": "blanco", "n-relieve-oscuro": "relieveOscuro", "n-relieve-claro": "relieveClaro" };
for (const [nombre, estilo] of Object.entries(acabados)) await guarda(`${nombre}.webp`, acabado(estilo), 1600, { formato: "webp" });

// Sin fondo, para la portada de la web: uno por tema. Llevan margen para que la
// luz del cristal se apague antes del borde de la imagen.
await guarda("n-cristal-sin-fondo.webp", acabado("cristal", { fondo: false, margen: 20 }), 1400, { formato: "webp" });
await guarda("n-relieve-claro-sin-fondo.webp", acabado("relieveClaro", { fondo: false, margen: 20 }), 1400, { formato: "webp" });

// Para la imagen al compartir enlaces: sobre carbón, el fondo de esa imagen. Es
// JPEG porque el generador de Next no lee WebP.
await guarda("n-cristal-social.jpg", acabado("cristal", { fondo: CARBON, margen: 20 }), 640, { formato: "jpg" });

console.log("Kit generado en", DIR);
