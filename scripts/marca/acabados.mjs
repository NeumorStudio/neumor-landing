// Calcula los acabados del NS píxel a píxel a partir del maestro: volumen por
// distancia al borde, luz de estudio, refracción y brillo. No usa servicios externos.
// Uso: node scripts/marca/acabados.mjs [porcelana] [cristal] [relieve] [tresDeClaro]
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DIR = "public/marca";
const S = 3200; // Se calcula al doble y se reduce al guardar
const SALIDA = 1600;
const ESCALA_NS = 0.74; // El NS ocupa unos dos tercios de la imagen

const d = fs.readFileSync(path.join(DIR, "ns-marca.svg"), "utf8").match(/ d="([^"]+)"/)[1];

const lineal = (hex) =>
  [1, 3, 5].map((i) => parseInt(hex.substr(i, 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
const srgb = (v) => {
  const c = v < 0 ? 0 : v > 1 ? 1 : v;
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
};
const normal = (v) => {
  const l = Math.hypot(...v);
  return v.map((x) => x / l);
};
const punto = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const suave = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mezcla = (a, b, t) => a + (b - a) * t;

const CARBON = lineal("#17181F");
const AMBAR = lineal("#F2A93B");
const BLANCO = [0.93, 0.925, 0.91];

// Distancia exacta al píxel objetivo más cercano (Felzenszwalb y Huttenlocher).
function distancia(objetivo) {
  const INF = 1e20;
  const g = new Float64Array(S * S);
  for (let i = 0; i < S * S; i++) g[i] = objetivo(i) ? 0 : INF;
  const f = new Float64Array(S), r = new Float64Array(S), v = new Int32Array(S), z = new Float64Array(S + 1);
  const pasada = () => {
    let k = 0;
    v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < S; q++) {
      let s;
      do {
        const p = v[k];
        s = (f[q] + q * q - f[p] - p * p) / (2 * q - 2 * p);
      } while (s <= z[k] && --k > -1);
      k++;
      v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < S; q++) {
      while (z[k + 1] < q) k++;
      const p = v[k];
      r[q] = (q - p) * (q - p) + f[p];
    }
  };
  for (let x = 0; x < S; x++) {
    for (let y = 0; y < S; y++) f[y] = g[y * S + x];
    pasada();
    for (let y = 0; y < S; y++) g[y * S + x] = r[y];
  }
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) f[x] = g[y * S + x];
    pasada();
    for (let x = 0; x < S; x++) g[y * S + x] = Math.sqrt(r[x]);
  }
  return g;
}

// Gaussiana aproximada con tres pasadas de caja.
function desenfocar(origen, sigma) {
  const r = Math.max(1, Math.round((Math.sqrt(4 * sigma * sigma + 1) - 1) / 2));
  const n = 2 * r + 1;
  const a = Float32Array.from(origen), b = new Float32Array(S * S), col = new Float32Array(S);
  const cl = (i) => Math.min(S - 1, Math.max(0, i));
  for (let pase = 0; pase < 3; pase++) {
    for (let y = 0; y < S; y++) {
      const o = y * S;
      let s = 0;
      for (let i = -r; i <= r; i++) s += a[o + cl(i)];
      for (let x = 0; x < S; x++) {
        b[o + x] = s / n;
        s += a[o + cl(x + r + 1)] - a[o + cl(x - r)];
      }
    }
    for (let x = 0; x < S; x++) {
      let s = 0;
      for (let i = -r; i <= r; i++) s += b[cl(i) * S + x];
      for (let y = 0; y < S; y++) {
        col[y] = s / n;
        s += b[cl(y + r + 1) * S + x] - b[cl(y - r) * S + x];
      }
      for (let y = 0; y < S; y++) a[y * S + x] = col[y];
    }
  }
  return a;
}

async function mascara() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2820 2820" width="${S}" height="${S}"><rect width="2820" height="2820" fill="#000"/><g transform="translate(1410 1410) scale(${ESCALA_NS}) translate(-1410 -1410)"><path fill="#fff" fill-rule="evenodd" d="${d}"/></g></svg>`;
  const crudo = await sharp(Buffer.from(svg), { limitInputPixels: false }).greyscale().raw().toBuffer();
  const A = new Float32Array(S * S);
  for (let i = 0; i < S * S; i++) A[i] = crudo[i] / 255;
  const dentro = distancia((i) => A[i] < 0.5);
  let mitad = 0;
  for (let i = 0; i < S * S; i++) if (dentro[i] > mitad) mitad = dentro[i];
  return { A, dentro, mitad };
}

// Sección redondeada: sube desde el borde hasta R y luego queda plana.
function altura(dentro, R, sigma) {
  const h = new Float32Array(S * S);
  for (let i = 0; i < S * S; i++) {
    const t = Math.min(dentro[i] / R, 1);
    h[i] = dentro[i] > 0 ? R * Math.sqrt(1 - (1 - t) * (1 - t)) : 0;
  }
  return desenfocar(h, sigma);
}
function normalEn(h, x, y, fuerza) {
  const xe = Math.min(S - 2, Math.max(1, x)), ye = Math.min(S - 2, Math.max(1, y));
  const gx = (h[ye * S + xe + 1] - h[ye * S + xe - 1]) / 2;
  const gy = (h[(ye + 1) * S + xe] - h[(ye - 1) * S + xe]) / 2;
  return normal([-gx * fuerza, -gy * fuerza, 1]);
}
const movido = (F, x, y, dx, dy) => F[Math.round(Math.min(S - 1, Math.max(0, y - dy))) * S + Math.round(Math.min(S - 1, Math.max(0, x - dx)))];
const reflejo = (n) => [2 * n[2] * n[0], 2 * n[2] * n[1], 2 * n[2] * n[2] - 1];

async function guardar(px, nombre) {
  const buf = Buffer.alloc(S * S * 3);
  // Un poco de grano evita las bandas en los degradados oscuros.
  let semilla = 12345;
  const azar = () => {
    semilla = (semilla * 1664525 + 1013904223) >>> 0;
    return semilla / 4294967296 - 0.5;
  };
  for (let i = 0; i < S * S; i++) {
    const grano = azar() * 1.6;
    for (let c = 0; c < 3; c++) buf[i * 3 + c] = Math.max(0, Math.min(255, Math.round(srgb(px[i * 3 + c]) * 255 + grano)));
  }
  await sharp(buf, { raw: { width: S, height: S, channels: 3 }, limitInputPixels: false })
    .resize(SALIDA, SALIDA, { kernel: "lanczos3" })
    .webp({ quality: 90, smartSubsample: true })
    .toFile(path.join(DIR, `${nombre}.webp`));
}

// Quita un color de fondo y lo convierte en transparencia, conservando luces y
// sombras. Así el NS se puede poner sobre cualquier fondo sin que se vea un cuadrado.
function sinFondo(rgb, n, fondo, salida) {
  const base = lineal(fondo).map(srgb);
  for (let i = 0; i < n; i++) {
    let a = 0;
    for (let c = 0; c < 3; c++) {
      const d = rgb[i * 3 + c] / 255 - base[c];
      a = Math.max(a, d > 0 ? d / (1 - base[c]) : -d / base[c]);
    }
    for (let c = 0; c < 3; c++) {
      const v = a > 0.002 ? (rgb[i * 3 + c] / 255 - base[c]) / a + base[c] : base[c];
      salida[i * 4 + c] = Math.round(Math.min(1, Math.max(0, v)) * 255);
    }
    salida[i * 4 + 3] = Math.round(a * 255);
  }
  return salida;
}

async function guardarSinFondo(px, nombre) {
  const rgb = new Uint8Array(S * S * 3);
  for (let i = 0; i < S * S * 3; i++) rgb[i] = Math.round(srgb(px[i]) * 255);
  const rgba = sinFondo(rgb, S * S, "#17181F", Buffer.alloc(S * S * 4));
  await sharp(rgba, { raw: { width: S, height: S, channels: 4 }, limitInputPixels: false })
    .resize(SALIDA, SALIDA, { kernel: "lanczos3" })
    .webp({ quality: 88, alphaQuality: 90 })
    .toFile(path.join(DIR, `${nombre}.webp`));
}

// El 3D para el tema claro. Su NS es blanco como su fondo, así que no se puede
// quitar por color: se desvanece en círculo y queda como un halo sobre la página.
async function tresDeClaro() {
  const { data, info } = await sharp("public/images/logoneumor.jpeg").removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const rgba = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = y * w + x;
    rgba[i * 4] = data[i * 3];
    rgba[i * 4 + 1] = data[i * 3 + 1];
    rgba[i * 4 + 2] = data[i * 3 + 2];
    rgba[i * 4 + 3] = Math.round(suave(0.5, 0.36, Math.hypot(x / w - 0.5, y / h - 0.5)) * 255);
  }
  await sharp(rgba, { raw: { width: w, height: h, channels: 4 } })
    .webp({ quality: 88, alphaQuality: 90 })
    .toFile(path.join(DIR, "ns-3d-sin-fondo.webp"));
}

// Líquido blanco y brillante, con luz ámbar en los huecos, sobre carbón.
async function porcelana() {
  const { A, dentro, mitad } = await mascara();
  const fuera = distancia((i) => A[i] >= 0.5);
  const h = altura(dentro, mitad * 1.02, mitad * 0.2);
  const G = desenfocar(A, S * 0.05);
  const sombra1 = desenfocar(A, S * 0.006), sombra2 = desenfocar(A, S * 0.026);
  const L = normal([-0.5, -0.62, 0.62]), H = normal([L[0], L[1], L[2] + 1]), rebote = normal([0.62, 0.72, 0.3]);
  const px = new Float32Array(S * S * 3);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const i = y * S + x, a = A[i];
    const luzSuelo = suave(0.52, 0.08, Math.hypot(x / S - 0.5, y / S - 0.46)) * 1.1;
    const sombra = (1 - 0.86 * movido(sombra1, x, y, S * 0.008, S * 0.011)) * (1 - 0.62 * movido(sombra2, x, y, S * 0.024, S * 0.032));
    const hueco = suave(0.36, 0.7, G[i]);
    const luz = (Math.exp(-fuera[i] / (S * 0.003)) * 0.6 + Math.exp(-fuera[i] / (S * 0.016)) * 0.3) * (0.03 + 0.97 * hueco) + Math.exp(-fuera[i] / (S * 0.06)) * 0.012;
    if (a <= 0.002) {
      for (let c = 0; c < 3; c++) px[i * 3 + c] = CARBON[c] * (1 + luzSuelo) * sombra + AMBAR[c] * luz;
      continue;
    }
    const n = normalEn(h, x, y, 1.15);
    const difusa = Math.max(0, (punto(n, L) + 0.4) / 1.4);
    const arriba = 0.5 - 0.5 * n[1];
    const r = reflejo(n);
    const u = (r[0] * 0.78 + r[1] * 0.62 + 0.7) / 0.2, v = (-r[0] * 0.62 + r[1] * 0.78) / 0.62;
    const ventana = suave(1.1, 0.55, u * u + v * v);
    const nh = Math.max(0, punto(n, H));
    const brillo = nh ** 260 * 1.1 + nh ** 28 * 0.12;
    const fresnel = (1 - n[2]) ** 3.2;
    const calor = Math.max(0, punto(n, rebote)) ** 2.2 * (0.25 + 0.75 * hueco);
    const tinte = Math.exp(-dentro[i] / (mitad * 0.32)) * (0.15 + 0.85 * hueco);
    for (let c = 0; c < 3; c++) {
      const fondo = CARBON[c] * (1 + luzSuelo) * sombra + AMBAR[c] * luz;
      let color = BLANCO[c] * (0.13 + 0.16 * arriba + 0.8 * difusa);
      color = mezcla(color, CARBON[c] * 1.1 + AMBAR[c] * 0.34 * hueco, Math.min(0.72, fresnel * 0.86));
      color += AMBAR[c] * (calor * 0.5 + tinte * 0.2) + ventana * 0.6 + brillo;
      px[i * 3 + c] = mezcla(fondo, color, a);
    }
  }
  await guardar(px, "ns-porcelana");
  await guardarSinFondo(px, "ns-porcelana-sin-fondo");
  // La imagen social se monta con un generador que no lee WebP
  await sharp(path.join(DIR, "ns-porcelana.webp")).resize(640, 640).jpeg({ quality: 88 }).toFile(path.join(DIR, "ns-porcelana-social.jpg"));
}

// Cristal que refracta la luz de detrás, con filo fino y brillo en los bordes.
async function cristal() {
  const { A, dentro, mitad } = await mascara();
  const h = altura(dentro, mitad * 0.82, mitad * 0.1);
  const sombra = desenfocar(A, S * 0.03);
  const focos = [
    [0.62, 0.64, 0.15, AMBAR, 0.95],
    [0.4, 0.38, 0.12, AMBAR.map((v) => v * 0.65 + 0.33), 0.42],
  ];
  const luzDetras = (fx, fy) => {
    const c = [CARBON[0], CARBON[1], CARBON[2]];
    for (const [bx, by, radio, color, fuerza] of focos) {
      const g = Math.exp(-((fx - bx) ** 2 + (fy - by) ** 2) / (2 * radio * radio)) * fuerza;
      for (let j = 0; j < 3; j++) c[j] += color[j] * g * 0.6;
    }
    const borde = suave(0.5, 0.26, Math.hypot(fx - 0.5, fy - 0.5));
    return c.map((v, j) => mezcla(CARBON[j], v, borde));
  };
  const L = normal([-0.55, -0.66, 0.5]), H = normal([L[0], L[1], L[2] + 1]);
  const px = new Float32Array(S * S * 3);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const i = y * S + x, a = A[i], fx = x / S, fy = y / S;
    const atenua = 1 - 0.62 * movido(sombra, x, y, S * 0.012, S * 0.022);
    const fondo = luzDetras(fx, fy).map((v) => v * atenua);
    if (a <= 0.002) {
      for (let c = 0; c < 3; c++) px[i * 3 + c] = fondo[c];
      continue;
    }
    const n = normalEn(h, x, y, 1.1);
    // Cada color se desvía un poco distinto, como en un cristal de verdad.
    const refractado = [0.92, 1, 1.09].map((e, c) => luzDetras(fx + n[0] * 0.17 * e, fy + n[1] * 0.17 * e)[c]);
    const fresnel = (1 - n[2]) ** 2.6;
    const filo = Math.exp(-((dentro[i] / (S * 0.0016)) ** 2)) * (0.2 + 0.8 * Math.abs(n[0] * -0.64 + n[1] * -0.77));
    const r = reflejo(n);
    const u = (r[0] * 0.78 + r[1] * 0.62 + 0.62) / 0.15, v = (-r[0] * 0.62 + r[1] * 0.78) / 0.6;
    const ventana = suave(1.1, 0.5, u * u + v * v);
    const brillo = Math.max(0, punto(n, H)) ** 320 * 1.2;
    for (let c = 0; c < 3; c++) {
      let color = refractado[c] * 1.32 + 0.016;
      color = mezcla(color, 0.62, Math.min(0.55, fresnel * 0.55));
      color += ventana * 0.42 + brillo + filo * 0.72;
      px[i * 3 + c] = mezcla(fondo[c], color, a);
    }
  }
  await guardar(px, "ns-cristal");
}

// Neumorfismo puro: mismo color que la superficie y dos sombras suaves.
async function relieve() {
  const { A, dentro, mitad } = await mascara();
  const h = altura(dentro, mitad * 0.5, mitad * 0.08);
  const sombra = desenfocar(A, S * 0.018);
  const superficie = lineal("#1D1F27"), L = normal([-0.6, -0.7, 0.55]);
  const px = new Float32Array(S * S * 3);
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const i = y * S + x, a = A[i];
    const k = (1 - 0.68 * movido(sombra, x, y, S * 0.017, S * 0.02)) * (1 + 0.62 * movido(sombra, x, y, -S * 0.013, -S * 0.016));
    const luz = Math.max(0.12, 1.1 + 2.6 * (punto(normalEn(h, x, y, 1), L) - L[2]));
    for (let c = 0; c < 3; c++) px[i * 3 + c] = mezcla(superficie[c] * k, superficie[c] * luz, a);
  }
  await guardar(px, "ns-relieve");
}

const acabados = { porcelana, cristal, relieve, tresDeClaro };
const pedidos = process.argv.slice(2);
for (const nombre of pedidos.length ? pedidos : Object.keys(acabados)) {
  await acabados[nombre]();
  console.log("Listo:", nombre);
}
