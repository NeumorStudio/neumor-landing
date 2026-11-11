// Dibuja las ilustraciones del ejemplo (Olmo, un restaurante inventado) y las
// deja en public/olmo. Son SVG hechos a mano con código: una mesa vista desde
// arriba para la portada de su web y tres platos pequeños para la carta.
// Uso: node scripts/olmo/mesa.mjs
import fs from "node:fs";
import path from "node:path";

const DIR = "public/olmo";
fs.mkdirSync(DIR, { recursive: true });

// Azar con semilla: el dibujo sale igual cada vez.
function azar(semilla) {
  let s = semilla >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const n = (v) => +v.toFixed(1);

// ---------- Piezas ----------

// Lo que comparten todos los dibujos: luz de arriba a la izquierda y sombra
// blanda abajo a la derecha.
const DEFS = `
<filter id="sombra" x="-30%" y="-30%" width="170%" height="170%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="9"/>
  <feOffset dx="10" dy="14"/>
  <feComponentTransfer><feFuncA type="linear" slope=".55"/></feComponentTransfer>
  <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="sombra-suave" x="-30%" y="-30%" width="170%" height="170%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="3.2"/>
  <feOffset dx="3" dy="4.5"/>
  <feComponentTransfer><feFuncA type="linear" slope=".42"/></feComponentTransfer>
  <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="veta" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".006 .19" numOctaves="4" seed="11"/>
  <feColorMatrix values="0 0 0 0 .06  0 0 0 0 .035  0 0 0 0 .02  2.1 0 0 0 -.92"/>
</filter>
<filter id="veta-clara" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".008 .3" numOctaves="3" seed="29"/>
  <feColorMatrix values="0 0 0 0 1  0 0 0 0 .86  0 0 0 0 .68  1.6 0 0 0 -.86"/>
</filter>
<filter id="grano" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/>
  <feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .5 0"/>
</filter>
<linearGradient id="madera" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#574030"/><stop offset=".45" stop-color="#3b2a1e"/><stop offset="1" stop-color="#231811"/>
</linearGradient>
<radialGradient id="luz" cx=".2" cy=".06" r=".95">
  <stop offset="0" stop-color="#ffd9a6" stop-opacity=".5"/><stop offset=".5" stop-color="#ffd9a6" stop-opacity=".12"/><stop offset="1" stop-color="#ffd9a6" stop-opacity="0"/>
</radialGradient>
<radialGradient id="vineta" cx=".42" cy=".4" r=".85">
  <stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/>
</radialGradient>
<radialGradient id="plato" cx=".4" cy=".36" r=".72">
  <stop offset="0" stop-color="#fdfaf3"/><stop offset=".62" stop-color="#f1eadc"/><stop offset=".9" stop-color="#ddd2bf"/><stop offset="1" stop-color="#c9bda8"/>
</radialGradient>
<radialGradient id="plato-fondo" cx=".42" cy=".38" r=".7">
  <stop offset="0" stop-color="#fbf7ee"/><stop offset=".8" stop-color="#efe7d8"/><stop offset="1" stop-color="#e2d8c5"/>
</radialGradient>
<radialGradient id="burrata" cx=".36" cy=".3" r=".8">
  <stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#f6f1e8"/><stop offset=".85" stop-color="#dfd5c5"/><stop offset="1" stop-color="#c9bda9"/>
</radialGradient>
<radialGradient id="higo" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="#f9d9c4"/><stop offset=".34" stop-color="#ee9c8f"/><stop offset=".7" stop-color="#c8475f"/><stop offset=".93" stop-color="#8d2548"/><stop offset="1" stop-color="#5a1836"/>
</radialGradient>
<linearGradient id="hoja" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#a9c66c"/><stop offset="1" stop-color="#4f7029"/>
</linearGradient>
<radialGradient id="aceituna" cx=".34" cy=".3" r=".8">
  <stop offset="0" stop-color="#d3de8c"/><stop offset=".45" stop-color="#96aa4a"/><stop offset="1" stop-color="#4c5f20"/>
</radialGradient>
<radialGradient id="aceituna-negra" cx=".34" cy=".3" r=".8">
  <stop offset="0" stop-color="#7a5a72"/><stop offset=".5" stop-color="#40263c"/><stop offset="1" stop-color="#1c0f1b"/>
</radialGradient>
<radialGradient id="cuenco" cx=".38" cy=".32" r=".8">
  <stop offset="0" stop-color="#474c58"/><stop offset=".7" stop-color="#262a32"/><stop offset="1" stop-color="#15171c"/>
</radialGradient>
<radialGradient id="cuenco-dentro" cx=".6" cy=".66" r=".75">
  <stop offset="0" stop-color="#2a2e37"/><stop offset="1" stop-color="#0c0d11"/>
</radialGradient>
<radialGradient id="vino" cx=".4" cy=".36" r=".7">
  <stop offset="0" stop-color="#9c1c38"/><stop offset=".6" stop-color="#5d0b20"/><stop offset="1" stop-color="#2c040e"/>
</radialGradient>
<radialGradient id="miga" cx=".42" cy=".4" r=".7">
  <stop offset="0" stop-color="#fbeed0"/><stop offset=".75" stop-color="#ecd5a6"/><stop offset="1" stop-color="#d6b47c"/>
</radialGradient>
<linearGradient id="corteza" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#c98a47"/><stop offset="1" stop-color="#7d4a1f"/>
</linearGradient>
<linearGradient id="tabla" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#a87a4a"/><stop offset="1" stop-color="#6c4728"/>
</linearGradient>
<linearGradient id="lino" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#ece6d8"/><stop offset="1" stop-color="#cfc6b3"/>
</linearGradient>
<linearGradient id="acero" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#8d929c"/><stop offset=".35" stop-color="#f1f3f6"/><stop offset=".6" stop-color="#b9bec8"/><stop offset="1" stop-color="#6f747e"/>
</linearGradient>
<radialGradient id="nuez" cx=".38" cy=".32" r=".8">
  <stop offset="0" stop-color="#c79a66"/><stop offset="1" stop-color="#7c5230"/>
</radialGradient>
<radialGradient id="yema" cx=".38" cy=".32" r=".8">
  <stop offset="0" stop-color="#ffd76a"/><stop offset=".6" stop-color="#f3a623"/><stop offset="1" stop-color="#c9780e"/>
</radialGradient>
<radialGradient id="tarta" cx=".3" cy=".3" r="1">
  <stop offset="0" stop-color="#f7dc9a"/><stop offset=".6" stop-color="#e2ab4c"/><stop offset="1" stop-color="#9c5f1c"/>
</radialGradient>
<radialGradient id="arroz" cx=".4" cy=".36" r=".75">
  <stop offset="0" stop-color="#f3d58f"/><stop offset=".7" stop-color="#dba94d"/><stop offset="1" stop-color="#a8721f"/>
</radialGradient>
<radialGradient id="sarten" cx=".4" cy=".36" r=".75">
  <stop offset="0" stop-color="#3b3d44"/><stop offset="1" stop-color="#101114"/>
</radialGradient>
<radialGradient id="alcachofa" cx=".4" cy=".34" r=".8">
  <stop offset="0" stop-color="#c9cf8f"/><stop offset=".55" stop-color="#8e9a55"/><stop offset="1" stop-color="#55612c"/>
</radialGradient>`;

const hojaD = "M0 -16C9 -9 9 7 0 16C-9 7 -9 -9 0 -16Z";
const hoja = (x, y, giro, k = 1, relleno = "url(#hoja)") =>
  `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${k})"><path d="${hojaD}" fill="${relleno}"/><path d="M0 -14V14" stroke="#3c5a1c" stroke-width="1" stroke-opacity=".7" fill="none"/><path d="M0 -6L5 -9M0 0L6 -3M0 6L5 3M0 -6L-5 -9M0 0L-6 -3M0 6L-5 3" stroke="#3c5a1c" stroke-width=".6" stroke-opacity=".45" fill="none"/></g>`;

// Medio higo: piel morada, carne rosa y un anillo de pepitas.
function higo(x, y, r, giro, a) {
  let pepitas = "";
  for (let i = 0; i < 16; i++) {
    const ang = (i / 16) * Math.PI * 2 + a() * 0.3, d = r * (0.42 + a() * 0.2);
    pepitas += `<ellipse cx="${n(Math.cos(ang) * d)}" cy="${n(Math.sin(ang) * d * 0.9)}" rx="1.5" ry=".9" transform="rotate(${n((ang * 180) / Math.PI)} ${n(Math.cos(ang) * d)} ${n(Math.sin(ang) * d * 0.9)})" fill="#f7e2b8" fill-opacity=".9"/>`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${giro})" filter="url(#sombra-suave)"><ellipse rx="${r}" ry="${n(r * 0.9)}" fill="#3a1630"/><ellipse rx="${n(r - 2.6)}" ry="${n(r * 0.9 - 2.6)}" fill="url(#higo)"/>${pepitas}<ellipse cx="${n(-r * 0.3)}" cy="${n(-r * 0.34)}" rx="${n(r * 0.3)}" ry="${n(r * 0.14)}" fill="#fff" fill-opacity=".28" transform="rotate(-30)"/></g>`;
}

// Una aceituna: verde y rellena de pimiento, o negra.
function aceituna(x, y, giro, k, negra) {
  const fill = negra ? "url(#aceituna-negra)" : "url(#aceituna)";
  const pimiento = negra ? "" : `<ellipse cx="11.5" cy="0" rx="3.4" ry="3.9" fill="#c5412f"/><ellipse cx="11" cy="-1" rx="1.2" ry="1.4" fill="#f08a6e" fill-opacity=".7"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${giro}) scale(${k})" filter="url(#sombra-suave)"><ellipse rx="15.5" ry="11.5" fill="${fill}"/>${pimiento}<ellipse cx="-5" cy="-4.6" rx="5.6" ry="2.6" fill="#fff" fill-opacity="${negra ? 0.3 : 0.5}" transform="rotate(-18)"/></g>`;
}

// Una rebanada de pan con su miga.
function rebanada(x, y, giro, a) {
  let poros = "";
  for (let i = 0; i < 9; i++) {
    const ang = a() * Math.PI * 2, d = a() * 26;
    poros += `<ellipse cx="${n(Math.cos(ang) * d)}" cy="${n(Math.sin(ang) * d * 0.62)}" rx="${n(1.6 + a() * 2.6)}" ry="${n(1 + a() * 1.6)}" fill="#c9a66c" fill-opacity=".55"/>`;
  }
  return `<g transform="translate(${x} ${y}) rotate(${giro})" filter="url(#sombra-suave)"><ellipse rx="46" ry="31" fill="url(#corteza)"/><ellipse rx="40.5" ry="25.5" fill="url(#miga)"/>${poros}</g>`;
}

// ---------- La mesa de la portada ----------
function mesa() {
  const W = 660, H = 430;
  const a = azar(7);
  const cx = 428, cy = 222, R = 152, r = 108;

  // Motas de la cerámica.
  let motas = "";
  for (let i = 0; i < 46; i++) {
    const ang = a() * Math.PI * 2, d = 20 + a() * (R - 26);
    motas += `<circle cx="${n(cx + Math.cos(ang) * d)}" cy="${n(cy + Math.sin(ang) * d)}" r="${n(0.5 + a() * 0.9)}" fill="#8f7f62" fill-opacity="${n(0.18 + a() * 0.3)}"/>`;
  }
  // Pimienta y sal sobre el plato.
  let pimienta = "";
  for (let i = 0; i < 30; i++) {
    const ang = a() * Math.PI * 2, d = a() * 92;
    pimienta += `<circle cx="${n(cx + Math.cos(ang) * d)}" cy="${n(cy + Math.sin(ang) * d)}" r="${n(0.6 + a() * 0.9)}" fill="${a() > 0.4 ? "#2b2018" : "#fff"}" fill-opacity="${n(0.5 + a() * 0.4)}"/>`;
  }

  // El cuenco de aceitunas.
  const bx = 120, by = 112;
  const aceitunas = [
    [-24, -20, -24, 1, 0], [9, -28, 28, 0.96, 0], [31, -5, 78, 1, 1], [22, 23, -34, 0.98, 0],
    [-8, 29, 12, 1, 0], [-32, 9, 62, 0.94, 1], [-3, -1, -12, 1.04, 0],
  ].map(([x, y, g, k, negra]) => aceituna(bx + x, by + y, g, k, negra)).join("");

  // La rama de olivo.
  const tallo = "M196 26C226 44 258 70 304 82";
  const hojasRama = [
    [206, 28, -62, 0], [214, 42, 18, 1], [228, 40, -52, 0], [238, 58, 26, 1], [252, 54, -44, 0],
    [262, 72, 34, 1], [276, 66, -36, 0], [288, 84, 44, 1], [304, 82, -78, 0],
  ].map(([x, y, g, enves]) =>
    `<g transform="translate(${x} ${y}) rotate(${g})"><ellipse cx="13" rx="15" ry="4.4" fill="${enves ? "#aab78a" : "#6f8744"}"/><path d="M0 0H27" stroke="${enves ? "#8a9a68" : "#4d6230"}" stroke-width=".7" fill="none"/></g>`).join("");

  const pan = rebanada(566, 46, -14, a) + rebanada(616, 66, 8, a);

  // Cubiertos sobre la servilleta.
  const tenedor = `<g transform="translate(612 196)"><path d="M-9 -78V-44C-9 -34 -4 -30 -3 -24L-4 86C-4 92 4 92 4 86L3 -24C4 -30 9 -34 9 -44V-78H6V-48H3.6V-78H1.2V-48H-1.2V-78H-3.6V-48H-6V-78Z" fill="url(#acero)"/></g>`;
  const cuchillo = `<g transform="translate(636 196)"><path d="M-3 -80C6 -70 7 -40 4 -14H-3ZM-3.6 -12H4L3.4 86C3.4 92 -3 92 -3 86Z" fill="url(#acero)"/></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
<defs>${DEFS}</defs>
<rect width="${W}" height="${H}" fill="url(#madera)"/>
<rect width="${W}" height="${H}" filter="url(#veta)" opacity=".9"/>
<rect width="${W}" height="${H}" filter="url(#veta-clara)" opacity=".1"/>
<path d="M0 148H${W}M0 301H${W}" stroke="#120b07" stroke-opacity=".5" stroke-width="1.6"/>
<path d="M0 149.6H${W}M0 302.6H${W}" stroke="#fff" stroke-opacity=".05" stroke-width="1"/>
<rect width="${W}" height="${H}" fill="url(#luz)"/>

<!-- Tabla con pan -->
<g transform="rotate(-9 600 50)" filter="url(#sombra)"><rect x="508" y="-34" width="206" height="150" rx="16" fill="url(#tabla)"/></g>
<g transform="rotate(-9 600 50)"><path d="M516 -6H706M516 22H706M516 52H706M516 84H706" stroke="#4a2f18" stroke-opacity=".28" stroke-width="1.2"/></g>
${pan}

<!-- Servilleta y cubiertos -->
<g filter="url(#sombra)"><path d="M584 98L668 104L662 322L580 314Z" fill="url(#lino)"/></g>
<path d="M592 108L589 308M606 110L603 310M620 111L617 311M634 112L631 312M648 113L645 313" stroke="#b5ab95" stroke-opacity=".5" stroke-width="1"/>
<g filter="url(#sombra-suave)">${tenedor}${cuchillo}</g>

<!-- Cuenco de aceitunas -->
<g filter="url(#sombra)"><circle cx="${bx}" cy="${by}" r="66" fill="url(#cuenco)"/></g>
<circle cx="${bx}" cy="${by}" r="55" fill="url(#cuenco-dentro)"/>
<path d="M${bx - 58} ${by - 22}A62 62 0 0 1 ${bx - 8} ${by - 61}" stroke="#fff" stroke-opacity=".3" stroke-width="2.4" stroke-linecap="round" fill="none"/>
${aceitunas}

<!-- Rama de olivo -->
<g filter="url(#sombra-suave)"><path d="${tallo}" stroke="#5b6a36" stroke-width="2.2" stroke-linecap="round" fill="none"/>${hojasRama}
<ellipse cx="246" cy="76" rx="6.5" ry="8.5" fill="url(#aceituna)" transform="rotate(20 246 76)"/><ellipse cx="282" cy="98" rx="6" ry="8" fill="url(#aceituna-negra)" transform="rotate(-12 282 98)"/></g>

<!-- El plato -->
<g filter="url(#sombra)"><circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#plato)"/></g>
<circle cx="${cx}" cy="${cy}" r="${R - 1}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#plato-fondo)"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#8a7a5c" stroke-opacity=".26" stroke-width="2.2"/>
<circle cx="${cx + 1.5}" cy="${cy + 2}" r="${r - 2}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>
${motas}
<path d="M${cx - 124} ${cy - 44}A132 132 0 0 1 ${cx - 40} ${cy - 126}" stroke="#fff" stroke-opacity=".75" stroke-width="3.2" stroke-linecap="round" fill="none"/>

<!-- Burrata con higos, nueces y miel -->
<g transform="translate(${cx} ${cy}) scale(1.13) translate(${-cx} ${-cy})">
<ellipse cx="${cx + 6}" cy="${cy + 26}" rx="62" ry="30" fill="#c9c25a" fill-opacity=".3"/>
${higo(cx + 54, cy - 44, 25, -24, a)}
${higo(cx + 62, cy + 30, 23, 38, a)}
${higo(cx - 54, cy + 52, 24, 8, a)}
<g filter="url(#sombra-suave)"><ellipse cx="${cx - 12}" cy="${cy - 8}" rx="52" ry="47" fill="url(#burrata)"/></g>
<path d="M${cx - 4} ${cy - 46}C${cx + 8} ${cy - 36} ${cx + 4} ${cy - 22} ${cx + 16} ${cy - 16}M${cx + 2} ${cy - 44}C${cx + 14} ${cy - 40} ${cx + 22} ${cy - 30} ${cx + 22} ${cy - 20}" stroke="#bdb09a" stroke-opacity=".6" stroke-width="1.6" stroke-linecap="round" fill="none"/>
<ellipse cx="${cx - 32}" cy="${cy - 28}" rx="17" ry="9" fill="#fff" fill-opacity=".85" transform="rotate(-32 ${cx - 32} ${cy - 28})"/>
${hoja(cx + 26, cy - 2, 62, 1.15)}
${hoja(cx - 26, cy + 34, -38, 1.05)}
${hoja(cx - 70, cy - 12, 14, 0.95)}
${hoja(cx + 14, cy + 62, 96, 0.9)}
<g filter="url(#sombra-suave)">
<path d="M0 -9C7 -10 11 -4 9 2C12 6 6 11 0 9C-6 11 -12 6 -9 2C-11 -4 -7 -10 0 -9Z" fill="url(#nuez)" transform="translate(${cx + 26} ${cy + 52}) rotate(20)"/>
<path d="M0 -9C7 -10 11 -4 9 2C12 6 6 11 0 9C-6 11 -12 6 -9 2C-11 -4 -7 -10 0 -9Z" fill="url(#nuez)" transform="translate(${cx - 62} ${cy - 50}) rotate(-40) scale(.9)"/>
<path d="M0 -9C7 -10 11 -4 9 2C12 6 6 11 0 9C-6 11 -12 6 -9 2C-11 -4 -7 -10 0 -9Z" fill="url(#nuez)" transform="translate(${cx + 84} ${cy - 4}) rotate(70) scale(.85)"/>
</g>
<path d="M${cx + 26} ${cy + 46}V${cy + 58}M${cx - 62} ${cy - 55}L${cx - 62} ${cy - 45}" stroke="#5e3c20" stroke-opacity=".5" stroke-width="1" fill="none"/>
<path d="M${cx - 86} ${cy + 18}C${cx - 60} ${cy - 6} ${cx - 40} ${cy + 30} ${cx - 14} ${cy + 4}S${cx + 30} ${cy + 28} ${cx + 52} ${cy + 4}S${cx + 84} ${cy + 30} ${cx + 92} ${cy + 46}" stroke="#e2a83a" stroke-opacity=".85" stroke-width="2.6" stroke-linecap="round" fill="none"/>
<circle cx="${cx - 88}" cy="${cy + 22}" r="3.6" fill="#e2a83a" fill-opacity=".85"/><circle cx="${cx + 94}" cy="${cy + 50}" r="3" fill="#e2a83a" fill-opacity=".85"/><circle cx="${cx + 40}" cy="${cy + 78}" r="2.2" fill="#e2a83a" fill-opacity=".7"/>
${pimienta}
</g>

<!-- Copa de vino, vista desde arriba -->
<g filter="url(#sombra)"><circle cx="596" cy="356" r="33" fill="#fff" fill-opacity=".05" stroke="#fff" stroke-opacity=".22" stroke-width="1.2"/></g>
<circle cx="596" cy="356" r="47" fill="#fff" fill-opacity=".06"/>
<circle cx="596" cy="356" r="40" fill="url(#vino)"/>
<ellipse cx="584" cy="342" rx="15" ry="7" fill="#ff9db0" fill-opacity=".2" transform="rotate(-34 584 342)"/>
<circle cx="596" cy="356" r="47" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1.6"/>
<path d="M560 330A44 44 0 0 1 586 311" stroke="#fff" stroke-opacity=".85" stroke-width="2.6" stroke-linecap="round" fill="none"/>

<rect width="${W}" height="${H}" fill="url(#vineta)"/>
<rect width="${W}" height="${H}" filter="url(#grano)" opacity=".1" style="mix-blend-mode:overlay"/>
</svg>
`;
}

// ---------- Tres platos pequeños para la carta ----------
function platito(contenido, fondo = "#2f2219") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
<defs>${DEFS}</defs>
<rect width="200" height="200" fill="${fondo}"/>
<rect width="200" height="200" filter="url(#veta)" opacity=".8"/>
<rect width="200" height="200" fill="url(#luz)"/>
${contenido}
<rect width="200" height="200" fill="url(#vineta)" opacity=".7"/>
</svg>
`;
}
const basePlato = (r = 82) => `<g filter="url(#sombra)"><circle cx="100" cy="100" r="${r}" fill="url(#plato)"/></g><circle cx="100" cy="100" r="${n(r * 0.72)}" fill="url(#plato-fondo)"/><circle cx="100" cy="100" r="${n(r * 0.72)}" fill="none" stroke="#8a7a5c" stroke-opacity=".26" stroke-width="1.8"/><path d="M${n(100 - r * 0.8)} ${n(100 - r * 0.3)}A${n(r * 0.86)} ${n(r * 0.86)} 0 0 1 ${n(100 - r * 0.28)} ${n(100 - r * 0.81)}" stroke="#fff" stroke-opacity=".75" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;

function alcachofas() {
  const a = azar(21);
  const una = (x, y, g, k) => {
    let petalos = "";
    for (let i = 0; i < 9; i++) petalos += `<path d="M0 0C-7 -10 -5 -22 0 -27C5 -22 7 -10 0 0Z" fill="url(#alcachofa)" stroke="#4b5626" stroke-opacity=".5" stroke-width=".7" transform="rotate(${i * 40})"/>`;
    return `<g transform="translate(${x} ${y}) rotate(${g}) scale(${k})" filter="url(#sombra-suave)">${petalos}<circle r="8" fill="#d9c98f"/><circle r="4" fill="#b59a57"/></g>`;
  };
  let sal = "";
  for (let i = 0; i < 16; i++) { const ang = a() * 6.283, d = a() * 52; sal += `<circle cx="${n(100 + Math.cos(ang) * d)}" cy="${n(100 + Math.sin(ang) * d)}" r="${n(0.7 + a() * 0.7)}" fill="#fff" fill-opacity=".8"/>`; }
  return platito(`${basePlato()}<ellipse cx="102" cy="108" rx="48" ry="22" fill="#c9c25a" fill-opacity=".28"/>${una(80, 92, 12, 0.92)}${una(124, 86, -30, 0.84)}${una(108, 126, 44, 0.88)}<path d="M62 122C80 108 96 132 118 114S140 110 146 126" stroke="#e2a83a" stroke-opacity=".7" stroke-width="2" stroke-linecap="round" fill="none"/>${sal}`);
}

function arroz() {
  const a = azar(33);
  let granos = "";
  for (let i = 0; i < 150; i++) { const ang = a() * 6.283, d = Math.sqrt(a()) * 64; granos += `<ellipse cx="${n(100 + Math.cos(ang) * d)}" cy="${n(100 + Math.sin(ang) * d)}" rx="2.6" ry="1" fill="#fbe9b6" fill-opacity="${n(0.5 + a() * 0.4)}" transform="rotate(${n(a() * 180)} ${n(100 + Math.cos(ang) * d)} ${n(100 + Math.sin(ang) * d)})"/>`; }
  const seta = (x, y, g, k) => `<g transform="translate(${x} ${y}) rotate(${g}) scale(${k})" filter="url(#sombra-suave)"><path d="M-13 2C-13 -11 13 -11 13 2C8 5 -8 5 -13 2Z" fill="#b08355"/><path d="M-4 3H4L3 14C3 17 -3 17 -3 14Z" fill="#e9d9bd"/><path d="M-9 -3C-4 -7 4 -7 9 -3" stroke="#d9b98c" stroke-width="1.4" stroke-linecap="round" fill="none"/></g>`;
  return platito(`<g filter="url(#sombra)"><circle cx="100" cy="100" r="84" fill="url(#sarten)"/></g><circle cx="100" cy="100" r="72" fill="url(#arroz)"/>${granos}${seta(76, 84, -20, 1)}${seta(124, 78, 30, 0.9)}${seta(114, 124, 150, 0.95)}${seta(74, 126, 200, 0.85)}${hoja(100, 100, 40, 0.6)}${hoja(138, 108, -60, 0.5)}<circle cx="100" cy="100" r="84" fill="none" stroke="#fff" stroke-opacity=".14" stroke-width="1.6"/><path d="M34 70A72 72 0 0 1 76 30" stroke="#fff" stroke-opacity=".4" stroke-width="2.4" stroke-linecap="round" fill="none"/>`, "#30231a");
}

function tarta() {
  return platito(`${basePlato(80)}<g filter="url(#sombra-suave)"><path d="M62 138L112 52C134 62 148 82 150 106Z" fill="url(#tarta)"/><path d="M62 138L112 52" stroke="#fff3cf" stroke-opacity=".7" stroke-width="2" fill="none"/><path d="M112 52C134 62 148 82 150 106" stroke="#6e3f10" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M112 52C134 62 148 82 150 106" stroke="#8a5216" stroke-width="2" stroke-linecap="round" fill="none" stroke-dasharray="2 5"/></g><path d="M70 150C96 142 126 150 152 134" stroke="#8d2548" stroke-opacity=".8" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="64" cy="152" r="4" fill="#8d2548" fill-opacity=".8"/><g filter="url(#sombra-suave)"><circle cx="134" cy="140" r="7" fill="#5a1836"/><circle cx="146" cy="130" r="6" fill="#742043"/><circle cx="131" cy="139" r="2" fill="#fff" fill-opacity=".35"/></g>${hoja(118, 150, 70, 0.5)}`);
}

const piezas = { "mesa.svg": mesa(), "plato-alcachofas.svg": alcachofas(), "plato-arroz.svg": arroz(), "plato-tarta.svg": tarta() };
for (const [nombre, svg] of Object.entries(piezas)) {
  fs.writeFileSync(path.join(DIR, nombre), svg.replace(/\n\s*\n/g, "\n"));
  console.log(nombre, (svg.length / 1024).toFixed(1) + " KB");
}
