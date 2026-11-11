// Genera el kit de la marca a partir de la forma de la n (scripts/marca/forma.mjs).
// Uso: node scripts/marca/kit.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { CARBON, MAESTRO, PEQUENA, PORCELANA, arcoD, caja, centroX, encaja, n, nD } from "./forma.mjs";
import { acabado } from "./motor.mjs";

const DIR = "public/marca";
const DIR_WEB = "public/icons";
const BLANCO = "#FFFFFF";
const RADIO = 22; // Esquinas de los iconos sueltos, sobre 100
const N_FAVICON = 0.84; // A 16 px el aire le quita lectura

// Lo que ya no forma parte del kit: el cristal y el blanco con brillo.
for (const viejo of ["n-cristal.webp", "n-cristal-sin-fondo.webp", "n-cristal-social.jpg", "n-icono-cristal.svg", "n-blanco.webp", "n-marca-una-tinta.svg"])
  fs.rmSync(path.join(DIR, viejo), { force: true });

// Los logos planos van recortados a la n, con medio punto de aire. Son a una
// tinta: `n-marca.svg` toma el color del texto donde se ponga.
const c = caja(MAESTRO);
const vista = `${c.x - 1} ${c.y - 0.5} ${c.ancho + 2} ${c.alto + 1}`;
const plano = (color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vista}" role="img" aria-label="NeumorStudio">${n(MAESTRO, color)}</svg>\n`;

const piezas = {
  "n-marca.svg": plano("currentColor"),
  "n-marca-blanco.svg": plano(BLANCO),
  "n-marca-negro.svg": plano(CARBON),
  "n-icono.svg": acabado("plano", { radio: RADIO }),
};
for (const [nombre, contenido] of Object.entries(piezas)) fs.writeFileSync(path.join(DIR, nombre), contenido);

// La web pinta la n en línea para que tome el color del tema y no parpadee al
// cargar. `arco` y `trazo` son la línea central, para animaciones que la dibujan.
const forma = {
  vista,
  n: nD(MAESTRO),
  arco: arcoD(MAESTRO),
  trazo: MAESTRO.trazo,
  punto: { cx: centroX(MAESTRO), cy: MAESTRO.punto.cy, r: MAESTRO.punto.r },
};
fs.writeFileSync(
  "components/ui/n-forma.ts",
  `// Generado por scripts/marca/kit.mjs a partir de scripts/marca/forma.mjs. No se edita a mano.\nexport const N_FORMA = ${JSON.stringify(forma, null, 2)} as const;\n`,
);

// Lo pequeño se rasteriza a cuatro veces el tamaño y se reduce: los bordes salen más limpios.
async function imagen(svg, lado, { opaco = false, formato = "png" } = {}) {
  const k = lado <= 512 ? 4 : 1;
  const grande = svg.replace("<svg ", `<svg width="${lado * k}" height="${lado * k}" `);
  let img = sharp(Buffer.from(grande)).resize(lado, lado, { kernel: "lanczos3" });
  if (opaco) img = img.flatten({ background: CARBON }).removeAlpha();
  if (formato === "webp") return img.webp({ quality: 88, alphaQuality: 90, effort: 6 }).toBuffer();
  if (formato === "jpg") return img.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  return img.png({ compressionLevel: 9 }).toBuffer();
}
const guarda = async (nombre, svg, lado, opciones) =>
  fs.writeFileSync(path.join(DIR, nombre), await imagen(svg, lado, opciones));

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

// Favicons: planos y con la n pequeña, porcelana sobre carbón.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="${RADIO}" fill="${CARBON}"/>${encaja(PEQUENA, N_FAVICON, n(PEQUENA, PORCELANA))}</svg>`;
const pequenos = [];
for (const lado of [16, 32, 48]) {
  const datos = await imagen(favicon, lado);
  pequenos.push({ lado, datos });
  fs.writeFileSync(path.join(DIR, `icono-${lado}.png`), datos);
  if (lado < 48) fs.writeFileSync(path.join(DIR_WEB, `favicon-${lado}x${lado}.png`), datos);
}
fs.writeFileSync("app/favicon.ico", ico(pequenos));

// Iconos de app, avatares y firma de correo: planos y a sangre. Apple, Google y
// las PWA redondean por su cuenta, y App Store no admite transparencia.
const cuadrado = acabado("plano");
for (const lado of [180, 192, 512, 1024]) await guarda(`icono-${lado}.png`, cuadrado, lado, { opaco: true });
for (const lado of [72, 96, 128, 144, 152, 192, 384, 512])
  fs.writeFileSync(path.join(DIR_WEB, `icon-${lado}x${lado}.png`), await imagen(cuadrado, lado, { opaco: true }));
fs.writeFileSync(path.join(DIR_WEB, "apple-touch-icon.png"), await imagen(cuadrado, 180, { opaco: true }));

// El relieve, solo en grande: sobre su fondo y sin fondo (uno por tema).
await guarda("n-relieve-claro.webp", acabado("relieveClaro"), 1600, { formato: "webp" });
await guarda("n-relieve-oscuro.webp", acabado("relieveOscuro"), 1600, { formato: "webp" });
await guarda("n-relieve-claro-sin-fondo.webp", acabado("relieveClaro", { fondo: false, margen: 20 }), 1400, { formato: "webp" });
await guarda("n-relieve-oscuro-sin-fondo.webp", acabado("relieveOscuro", { fondo: false, margen: 20 }), 1400, { formato: "webp" });

// Para la imagen al compartir enlaces: sobre carbón, el fondo de esa imagen. Es
// JPEG porque el generador de Next no lee WebP.
await guarda("n-social.jpg", acabado("relieveOscuro", { fondo: CARBON, margen: 20 }), 640, { formato: "jpg" });

console.log("Kit generado en", DIR, "y", DIR_WEB);
