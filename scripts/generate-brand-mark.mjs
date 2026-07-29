/**
 * Genera el símbolo de marca (el monograma NS) en las dos piezas de las que
 * cuelga todo lo demás:
 *
 *   public/images/logo-mark.png         → navbar e imagen de compartir (esquinas redondeadas)
 *   public/images/logo-mark-square.png  → fuente de los iconos PWA (cuadrado, sin redondear)
 *
 * La fuente es public/images/logo-ns.svg, un único trazo vectorial. Se parte de
 * vector a propósito: la versión anterior del símbolo se recortaba de un PNG y
 * cada tamaño había que rehacerlo a mano. Desde el SVG, cualquier tamaño sale
 * nítido y el color se cambia en una línea.
 *
 * Después de este script hay que ejecutar generate-pwa-icons.mjs, que deriva
 * los nueve iconos y los favicons de logo-mark-square.png.
 *
 * Ejecutar: node scripts/generate-brand-mark.mjs
 */

import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const SOURCE_SVG = join(rootDir, 'public/images/logo-ns.svg')
const OUT_DIR = join(rootDir, 'public/images')

const LIENZO = 512
// El fondo oscuro de la marca, el mismo que el themeColor del modo oscuro.
const FONDO = { r: 0x12, g: 0x15, b: 0x1c, alpha: 1 }
// Proporción del lienzo que ocupa el trazo. Por debajo de 0.6 el símbolo se
// pierde a tamaño favicon; por encima de 0.7 toca los bordes al redondear.
const OCUPACION = 0.64
const RADIO = 0.22 * LIENZO

async function trazoBlanco() {
  const svg = await readFile(SOURCE_SVG, 'utf8')
  // El SVG viene en negro (#010101). Solo cambia el relleno, nunca la forma.
  const blanco = svg.replaceAll('#010101', '#FFFFFF').replaceAll('#000000', '#FFFFFF')

  // density alta para que el rasterizado no dependa del tamaño declarado.
  // trim() recorta el transparente sobrante: el trazo no está centrado dentro
  // del lienzo original del SVG y sin esto quedaría descentrado.
  return sharp(Buffer.from(blanco), { density: 600 })
    .png()
    .trim()
    .toBuffer()
}

async function componer({ redondear }) {
  const trazo = await trazoBlanco()
  const { width, height } = await sharp(trazo).metadata()

  // Encaja el trazo dentro del cuadrado respetando su proporción.
  const objetivo = Math.round(LIENZO * OCUPACION)
  const escala = objetivo / Math.max(width, height)
  const w = Math.round(width * escala)
  const h = Math.round(height * escala)

  const trazoEscalado = await sharp(trazo).resize(w, h).toBuffer()

  let img = sharp({
    create: { width: LIENZO, height: LIENZO, channels: 4, background: FONDO },
  })
    .composite([
      {
        input: trazoEscalado,
        top: Math.round((LIENZO - h) / 2),
        left: Math.round((LIENZO - w) / 2),
      },
    ])
    .png()

  if (redondear) {
    const mascara = Buffer.from(
      `<svg width="${LIENZO}" height="${LIENZO}"><rect width="${LIENZO}" height="${LIENZO}" rx="${RADIO}" ry="${RADIO}" fill="#fff"/></svg>`
    )
    img = sharp(await img.toBuffer())
      .composite([{ input: mascara, blend: 'dest-in' }])
      .png()
  }

  return img.toBuffer()
}

/**
 * Escribe un .ico con varios tamaños. sharp no exporta .ico, pero el formato
 * admite PNG embebido tal cual, así que basta con montar la cabecera a mano:
 * ICONDIR (6 bytes) + una ICONDIRENTRY de 16 bytes por tamaño + los PNG.
 * Se evita así añadir una dependencia solo para esto.
 */
async function escribirIco(fuente, destino, tamaños) {
  const pngs = []
  for (const size of tamaños) {
    pngs.push(await sharp(fuente).resize(size, size).png().toBuffer())
  }

  const cabecera = Buffer.alloc(6)
  cabecera.writeUInt16LE(0, 0) // reservado
  cabecera.writeUInt16LE(1, 2) // 1 = icono
  cabecera.writeUInt16LE(tamaños.length, 4)

  let offset = 6 + tamaños.length * 16
  const entradas = tamaños.map((size, i) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0) // 0 significa 256
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt8(0, 2) // paleta
    e.writeUInt8(0, 3) // reservado
    e.writeUInt16LE(1, 4) // planos
    e.writeUInt16LE(32, 6) // bits por píxel
    e.writeUInt32LE(pngs[i].length, 8)
    e.writeUInt32LE(offset, 12)
    offset += pngs[i].length
    return e
  })

  await writeFile(destino, Buffer.concat([cabecera, ...entradas, ...pngs]))
}

async function main() {
  console.log('Generando el símbolo de marca desde logo-ns.svg...\n')

  const redondeado = await componer({ redondear: true })
  await sharp(redondeado).toFile(join(OUT_DIR, 'logo-mark.png'))
  console.log(`  ✓ logo-mark.png (${LIENZO}x${LIENZO}, esquinas redondeadas)`)

  const cuadrado = await componer({ redondear: false })
  await sharp(cuadrado).toFile(join(OUT_DIR, 'logo-mark-square.png'))
  console.log(`  ✓ logo-mark-square.png (${LIENZO}x${LIENZO}, cuadrado)`)

  // El .ico manda sobre todo lo demás en la pestaña del navegador: si se queda
  // sin actualizar, la web enseña el símbolo nuevo y la pestaña el viejo.
  await escribirIco(redondeado, join(rootDir, 'app/favicon.ico'), [16, 32, 48])
  console.log('  ✓ app/favicon.ico (16, 32 y 48)')

  console.log('\nAhora: node scripts/generate-pwa-icons.mjs')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
