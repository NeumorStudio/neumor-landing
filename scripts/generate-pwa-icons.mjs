/**
 * Script para generar iconos PWA desde el logo
 * Ejecutar: node scripts/generate-pwa-icons.mjs
 */

import sharp from 'sharp'
import { mkdir } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

const SOURCE_IMAGE = join(rootDir, 'public/images/logo-mark-square.png')
const OUTPUT_DIR = join(rootDir, 'public/icons')

const ICONS = [
  { name: 'icon-72x72.png', size: 72 },
  { name: 'icon-96x96.png', size: 96 },
  { name: 'icon-128x128.png', size: 128 },
  { name: 'icon-144x144.png', size: 144 },
  { name: 'icon-152x152.png', size: 152 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

async function generateIcons() {
  console.log('Generando iconos PWA...\n')

  // Asegurar que existe el directorio
  await mkdir(OUTPUT_DIR, { recursive: true })

  // Cargar imagen fuente
  const sourceBuffer = await sharp(SOURCE_IMAGE)
    .resize(512, 512, { fit: 'cover' })
    .toBuffer()

  for (const icon of ICONS) {
    const outputPath = join(OUTPUT_DIR, icon.name)

    await sharp(sourceBuffer)
      .resize(icon.size, icon.size, { fit: 'cover' })
      .png({ quality: 90 })
      .toFile(outputPath)

    console.log(`  ✓ ${icon.name} (${icon.size}x${icon.size})`)
  }

  // Generar favicon.ico (16x16 y 32x32)
  const favicon16 = await sharp(sourceBuffer)
    .resize(16, 16, { fit: 'cover' })
    .png()
    .toBuffer()

  const favicon32 = await sharp(sourceBuffer)
    .resize(32, 32, { fit: 'cover' })
    .png()
    .toBuffer()

  // Guardar como PNG (el .ico requiere librería adicional)
  await sharp(favicon32).toFile(join(OUTPUT_DIR, 'favicon-32x32.png'))
  await sharp(favicon16).toFile(join(OUTPUT_DIR, 'favicon-16x16.png'))

  console.log(`  ✓ favicon-16x16.png`)
  console.log(`  ✓ favicon-32x32.png`)

  console.log('\n✅ Iconos generados en public/icons/')
  console.log('\nNota: Para el favicon.ico, usa https://favicon.io/ o similar')
}

generateIcons().catch(console.error)
