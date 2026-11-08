// Genera los campos de luz del hero: claro y oscuro, apaisado y vertical.
// Uso: node scripts/marca/fondos.mjs
import path from "node:path";
import sharp from "sharp";

const DIR = "public/images";

const lineal = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
const srgb = (v) => {
  const c = Math.min(1, Math.max(0, v));
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};

// Sin un solo borde: el CSS recorta estas imágenes como quiere y nunca se nota.
async function campo(nombre, ancho, alto, base, focos) {
  const fondo = lineal(base);
  const buf = Buffer.alloc(ancho * alto * 3);
  const luces = focos.map(([cx, cy, rx, ry, hex, fuerza]) => ({ cx, cy, rx, ry, color: lineal(hex), fuerza }));
  let semilla = 7;
  const azar = () => {
    semilla = (semilla * 1664525 + 1013904223) >>> 0;
    return semilla / 4294967296 - 0.5;
  };
  for (let y = 0; y < alto; y++) for (let x = 0; x < ancho; x++) {
    const fx = x / ancho, fy = y / alto;
    const c = [...fondo];
    for (const l of luces) {
      const g = Math.exp(-(((fx - l.cx) / l.rx) ** 2 + ((fy - l.cy) / l.ry) ** 2) / 2) * l.fuerza;
      for (let k = 0; k < 3; k++) c[k] = c[k] * (1 - g) + l.color[k] * g;
    }
    const grano = azar() * 1.4;
    const i = (y * ancho + x) * 3;
    for (let k = 0; k < 3; k++) buf[i + k] = Math.max(0, Math.min(255, Math.round(srgb(c[k]) * 255 + grano)));
  }
  await sharp(buf, { raw: { width: ancho, height: alto, channels: 3 } }).webp({ quality: 82 }).toFile(path.join(DIR, `${nombre}.webp`));
}

const AMBAR = "#F2A93B", BRASA = "#B9681C", CREMA = "#FFE2B0", MIEL = "#F7C777";

// En oscuro, luz baja: el protagonista es la n y el campo solo le da dónde brillar.
await campo("fondo-oscuro", 1600, 893, "#17181F", [
  [0.73, 0.5, 0.16, 0.28, AMBAR, 0.1],
  [0.9, 0.2, 0.12, 0.2, BRASA, 0.08],
  [0.16, 0.3, 0.15, 0.26, BRASA, 0.08],
  [0.42, 0.88, 0.2, 0.18, BRASA, 0.06],
]);
await campo("fondo-oscuro-movil", 900, 1613, "#17181F", [
  [0.5, 0.26, 0.34, 0.16, AMBAR, 0.1],
  [0.12, 0.5, 0.26, 0.16, BRASA, 0.08],
  [0.86, 0.72, 0.28, 0.18, BRASA, 0.07],
]);
await campo("fondo-claro", 1600, 893, "#F4F2EE", [
  [0.73, 0.5, 0.18, 0.32, MIEL, 0.62],
  [0.9, 0.2, 0.13, 0.24, CREMA, 0.7],
  [0.18, 0.28, 0.17, 0.3, CREMA, 0.72],
  [0.42, 0.86, 0.22, 0.22, CREMA, 0.6],
]);
await campo("fondo-claro-movil", 900, 1613, "#F4F2EE", [
  [0.5, 0.26, 0.36, 0.17, MIEL, 0.6],
  [0.12, 0.5, 0.28, 0.17, CREMA, 0.68],
  [0.86, 0.72, 0.3, 0.19, CREMA, 0.62],
]);
console.log("Fondos generados en", DIR);
