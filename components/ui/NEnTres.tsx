'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import type * as THREE from 'three'
import { puntoHero } from './punto-estado'
import { N_COLOR } from './n-color'
import { EVENTO_INTRO_FIN, introActiva } from './Intro'

/**
 * La n de la portada en 3D de verdad: el mismo dibujo del logo, con grosor,
 * saliendo de la pared como una tecla. Es el neumorfismo con luz real: luz
 * arriba a la izquierda, sombra blanda abajo a la derecha, y al inclinarse
 * hacia el ratón la sombra se mueve con ella.
 *
 * El punto es una bola. Al bajar, sale hacia delante, cae por el arco y en
 * ese momento la recoge el punto que acompaña el resto de la página
 * (`PuntoGuia`), en el mismo sitio y del mismo tamaño.
 *
 * Three.js se carga aparte, después de pintar el titular. Mientras tanto, o
 * sin WebGL, o con movimiento reducido, se ve la n en relieve como imagen.
 */

// La n en unidades de la caja de 100 (scripts/marca/forma.mjs), centrada y con
// el eje y hacia arriba.
const N = { rExt: 27.5, rInt: 12.5, cyExt: 1, cyInt: 2.2, pie: -28.5, esquina: 2.5, punto: { y: -12, r: 6.5 } }
const FONDO = 10
const BISEL = { alto: 2.4, ancho: 1.8 }
/** Parte del recorrido de la portada en la que la bola se suelta. */
const SUELTA = 0.2
/** Lo que cae la bola dentro de la escena antes del relevo, en unidades de la n. */
const CAIDA = 17
/** Lo que sale hacia delante al soltarse. */
const SALIDA = 9
// El lienzo es más grande que su caja por los cuatro lados (ver `.n3d-lienzo`):
// así la bola y su sombra caen sin que el borde las corte. La n no cambia de
// tamaño: la cámara abre el ángulo en la misma proporción.
const HOLGURA = 0.14
const AMPLIA = 1 + 2 * HOLGURA
const ANGULO = (2 * Math.atan(AMPLIA * Math.tan((22 * Math.PI) / 360)) * 180) / Math.PI

// La n va de ámbar a azul (n-color.ts). Aquí, en unidades de la n: centrada y
// con el eje y hacia arriba.
const DESDE = { x: N_COLOR.desde.x - 50, y: 50 - N_COLOR.desde.y }
const HACIA = { x: N_COLOR.hacia.x - 50, y: 50 - N_COLOR.hacia.y }

// La bola va en ámbar, como el punto que guía la página (`--accent-fill`):
// en claro un tono más oscuro, igual que en el CSS.
const TEMAS = {
  claro: { bola: '#eba729', brillo: '#000000', sombra: 0.2, cielo: '#ffffff', suelo: '#cfc8bc', hemi: 1.55, luz: 2.0, relleno: 0.35, contra: 0 },
  oscuro: { bola: '#f2b33d', brillo: '#1e1300', sombra: 0.6, cielo: '#dde1ef', suelo: '#14151c', hemi: 1.55, luz: 2.2, relleno: 0.35, contra: 1.2 },
}

const limita = (v: number) => Math.min(1, Math.max(0, v))
const sale = (t: number) => 1 - Math.pow(1 - t, 3)
const cae = (t: number) => t * t

/**
 * El color de la n va en una textura de una fila con el degradado, y cada
 * vértice dice en qué punto de esa fila cae. No vale pintar los vértices:
 * la cara de la n son triángulos largos que van de una pata a la otra, y el
 * color se mezclaría de ámbar a azul sin pasar por la porcelana del medio.
 * La posición en el degradado sí se reparte bien por el triángulo, y la
 * textura pone cada color en su sitio.
 */
function degradado(T: typeof THREE) {
  const lienzo = document.createElement('canvas')
  lienzo.width = 512
  lienzo.height = 1
  const ctx = lienzo.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, lienzo.width, 0)
  for (const [t, c] of N_COLOR.paradas) g.addColorStop(t, c)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, lienzo.width, 1)
  const textura = new T.CanvasTexture(lienzo)
  textura.colorSpace = T.SRGBColorSpace
  return textura
}

/** Dónde cae cada vértice de la n en el degradado, como coordenada de textura. */
function enDegradado(T: typeof THREE, pos: THREE.BufferAttribute) {
  const dx = HACIA.x - DESDE.x, dy = HACIA.y - DESDE.y, d2 = dx * dx + dy * dy
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = limita(((pos.getX(i) - DESDE.x) * dx + (pos.getY(i) - DESDE.y) * dy) / d2)
    uv[i * 2 + 1] = 0.5
  }
  return new T.BufferAttribute(uv, 2)
}

export function NEnTres({ className = '' }: { className?: string }) {
  const caja = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = caja.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const prueba = document.createElement('canvas')
    if (!(prueba.getContext('webgl2') || prueba.getContext('webgl'))) return

    let vivo = true
    let limpiar = () => {}

    const arrancar = () => import('three').then((T) => {
      if (!vivo) return

      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      // Comprobar los shaders obliga a esperar a que compilen. En producción
      // no hace falta.
      renderer.debug.checkShaderErrors = process.env.NODE_ENV !== 'production'
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.outputColorSpace = T.SRGBColorSpace
      renderer.toneMapping = T.NoToneMapping
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = T.VSMShadowMap
      const lienzo = renderer.domElement
      lienzo.className = 'n3d-lienzo'
      el.appendChild(lienzo)

      const escena = new T.Scene()
      const camara = new T.PerspectiveCamera(ANGULO, 1, 10, 600)
      camara.position.set(0, 0, 215)

      // La n: el contorno del logo, encogido lo que luego crece el bisel.
      const b = BISEL.ancho
      const rE = N.rExt - b, rI = N.rInt + b, pie = N.pie + b, c = Math.max(N.esquina - b, 0.4)
      const forma = new T.Shape()
      forma.moveTo(-rE, pie + c)
      forma.lineTo(-rE, N.cyExt)
      forma.absarc(0, N.cyExt, rE, Math.PI, 0, true)
      forma.lineTo(rE, pie + c)
      forma.absarc(rE - c, pie + c, c, 0, -Math.PI / 2, true)
      forma.lineTo(rI + c, pie)
      forma.absarc(rI + c, pie + c, c, -Math.PI / 2, -Math.PI, true)
      forma.lineTo(rI, N.cyInt)
      forma.absarc(0, N.cyInt, rI, 0, Math.PI, false)
      forma.lineTo(-rI, pie + c)
      forma.absarc(-rI - c, pie + c, c, 0, -Math.PI / 2, true)
      forma.lineTo(-rE + c, pie)
      forma.absarc(-rE + c, pie + c, c, -Math.PI / 2, -Math.PI, true)
      const geoN = new T.ExtrudeGeometry(forma, {
        depth: FONDO, bevelEnabled: true, bevelThickness: BISEL.alto, bevelSize: b, bevelSegments: 8, curveSegments: 72,
      })
      geoN.translate(0, 0, -FONDO / 2)
      geoN.setAttribute('uv', enDegradado(T, geoN.attributes.position as THREE.BufferAttribute))
      const geoBola = new T.SphereGeometry(N.punto.r, 64, 48)

      // Esmalte: el color va en la pieza y una capa fina de barniz le da el
      // brillo del material. Nada translúcido ni con halo.
      const colorN = degradado(T)
      const matN = new T.MeshPhysicalMaterial({
        map: colorN, roughness: 0.4, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.3,
      })
      // Casi mate: un punto, no una bola de billar.
      const matBola = new T.MeshStandardMaterial({ roughness: 0.48, metalness: 0 })
      const n = new T.Mesh(geoN, matN)
      n.castShadow = true
      n.receiveShadow = true
      const bola = new T.Mesh(geoBola, matBola)
      bola.castShadow = true
      // La bola, a ras de la cara de la n y un poco separada de la pared.
      const zBola = FONDO / 2 + BISEL.alto - N.punto.r
      bola.position.set(0, N.punto.y, zBola)
      const grupo = new T.Group()
      grupo.add(n, bola)
      escena.add(grupo)

      // La pared: solo recoge la sombra, el color es el de la página.
      const matMuro = new T.ShadowMaterial({ opacity: 0.2, depthWrite: false })
      const muro = new T.Mesh(new T.PlaneGeometry(700, 700), matMuro)
      muro.position.z = -FONDO / 2 - BISEL.alto - 0.05
      muro.receiveShadow = true
      escena.add(muro)

      const hemi = new T.HemisphereLight('#ffffff', '#cccccc', 1)
      // La luz principal, apenas cálida; la de relleno y la de detrás, frías.
      const luz = new T.DirectionalLight('#fff6ea', 2)
      luz.position.set(-55, 70, 95)
      luz.castShadow = true
      luz.shadow.mapSize.set(2048, 2048)
      const sc = luz.shadow.camera as THREE.OrthographicCamera
      sc.left = -75; sc.right = 75; sc.top = 75; sc.bottom = -75; sc.near = 10; sc.far = 420
      luz.shadow.radius = 16
      luz.shadow.blurSamples = 24
      luz.shadow.bias = -0.0005
      const relleno = new T.DirectionalLight('#e6ecff', 0.3)
      relleno.position.set(70, -15, 80)
      // Una luz por detrás que dibuja el canto en el tema oscuro, en azul.
      const contra = new T.DirectionalLight('#a9bdff', 0)
      contra.position.set(25, 70, -60)
      escena.add(hemi, luz, relleno, contra)

      const aplicarTema = () => {
        const t = TEMAS[document.documentElement.classList.contains('dark') ? 'oscuro' : 'claro']
        matBola.color.set(t.bola)
        matBola.emissive.set(t.brillo)
        matMuro.opacity = t.sombra
        hemi.color.set(t.cielo)
        hemi.groundColor.set(t.suelo)
        hemi.intensity = t.hemi
        luz.intensity = t.luz
        relleno.intensity = t.relleno
        contra.intensity = t.contra
      }
      aplicarTema()
      const mo = new MutationObserver(aplicarTema)
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

      const medir = () => {
        const r = el.getBoundingClientRect()
        const w = Math.max(1, r.width * AMPLIA), h = Math.max(1, r.height * AMPLIA)
        renderer.setSize(w, h, false)
        camara.aspect = w / h
        camara.updateProjectionMatrix()
      }
      medir()
      const ro = new ResizeObserver(medir)
      ro.observe(el)

      // Con ratón, la n se inclina hacia él. En táctil se mece despacio sola.
      const fino = window.matchMedia('(pointer: fine)').matches
      let objX = 0, objY = 0
      const mover = (e: PointerEvent) => {
        objY = (e.clientX / innerWidth - 0.5) * 0.55
        objX = (e.clientY / innerHeight - 0.5) * 0.32
      }
      if (fino) window.addEventListener('pointermove', mover, { passive: true })

      let visible = true
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { rootMargin: '120px' })
      io.observe(el)

      const v = new T.Vector3()
      const enMundo = new T.Vector3()
      const tan = Math.tan(T.MathUtils.degToRad(camara.fov / 2))
      let rx = 0, ry = 0, primera = true
      const t0 = performance.now()

      // Va en el mismo reloj que el punto de la página y delante de él: así
      // el punto lee siempre dónde está la bola en este mismo fotograma y el
      // relevo entre los dos es exacto.
      const bucle = () => {
        const ahora = performance.now()
        const r = el.getBoundingClientRect()
        // De 0 (arriba del todo) a 1 (cuando el lienzo ha salido por arriba).
        const fin = r.bottom + scrollY
        const p = limita(scrollY / Math.max(1, fin))

        const vaiven = fino ? 0 : Math.sin((ahora - t0) / 2600) * 0.14
        rx += (objX - rx) * 0.06
        ry += (objY + vaiven - ry) * 0.06
        grupo.rotation.set(rx - p * 0.42, ry, 0)
        grupo.position.y = p * 8

        // La bola: sale hacia delante y cae por el arco. Cae hasta los pies de
        // la n y no más: ahí la releva el punto de la página, antes de que el
        // borde del lienzo la corte.
        const a = limita(p / 0.08), bq = limita((p - 0.05) / (SUELTA - 0.05))
        bola.position.z = zBola + sale(a) * SALIDA
        bola.position.y = N.punto.y - cae(bq) * CAIDA
        // Al soltarse deja de pintarse (la releva el punto de la página), pero
        // sigue dando sombra un momento mientras se encoge: la sombra se apaga
        // suave en vez de desaparecer de golpe.
        const suelta = p >= SUELTA
        const resto = limita((p - SUELTA) / 0.1)
        matBola.colorWrite = !suelta
        matBola.depthWrite = !suelta
        bola.scale.setScalar(1 - resto)
        bola.visible = resto < 1

        // Dónde está la bola en la página, para que el punto la recoja ahí. Va
        // en coordenadas del documento: el punto vive pegado a la página.
        bola.updateWorldMatrix(true, false)
        enMundo.setFromMatrixPosition(bola.matrixWorld)
        v.copy(enMundo).project(camara)
        const lado = r.width * AMPLIA, alto = r.height * AMPLIA
        const pxPorUnidad = alto / (2 * camara.position.distanceTo(enMundo) * tan)
        puntoHero.x = r.left - r.width * HOLGURA + scrollX + ((v.x + 1) / 2) * lado
        puntoHero.y = r.top - r.height * HOLGURA + scrollY + ((1 - v.y) / 2) * alto
        puntoHero.r = N.punto.r * pxPorUnidad
        puntoHero.suelta = SUELTA * fin
        puntoHero.listo = true

        if (visible || primera) {
          renderer.render(escena, camara)
          if (primera) {
            primera = false
            el.classList.add('n3d-listo')
          }
        }
      }
      // Los shaders se compilan sin parar la página, donde el navegador lo
      // permite, y la escena empieza a dibujarse cuando están listos.
      renderer.compileAsync(escena, camara).catch(() => {}).then(() => {
        if (vivo) gsap.ticker.add(bucle, false, true)
      })

      limpiar = () => {
        gsap.ticker.remove(bucle)
        window.removeEventListener('pointermove', mover)
        ro.disconnect()
        io.disconnect()
        mo.disconnect()
        geoN.dispose()
        geoBola.dispose()
        matN.dispose()
        colorN.dispose()
        matBola.dispose()
        matMuro.dispose()
        renderer.dispose()
        lienzo.remove()
        el.classList.remove('n3d-listo')
        puntoHero.listo = false
      }
    })

    // Con pantalla de carga, el 3D espera a que la web se haya abierto:
    // montarlo ocupa el procesador cerca de medio segundo y la apertura daría
    // un salto. Mientras tanto se ve la foto de esta misma n.
    let espera = 0
    const ya = () => {
      window.clearTimeout(espera)
      window.removeEventListener(EVENTO_INTRO_FIN, ya)
      if (vivo) arrancar()
    }
    if (introActiva()) {
      window.addEventListener(EVENTO_INTRO_FIN, ya)
      espera = window.setTimeout(ya, 6000)
    } else {
      arrancar()
    }

    return () => {
      vivo = false
      window.clearTimeout(espera)
      window.removeEventListener(EVENTO_INTRO_FIN, ya)
      limpiar()
    }
  }, [])

  return (
    <div ref={caja} className={`n3d ${className}`}>
      {/* Lo que se ve mientras carga Three.js, o en su lugar. Una por tema.
          Son fotos de esta misma escena en reposo, así que el paso de la
          imagen al 3D no se nota. */}
      <Image
        src="/marca/n-color-oscuro.webp"
        alt=""
        width={1400}
        height={1400}
        priority
        sizes="(min-width: 1024px) 40vw, 18rem"
        className="n3d-imagen hero-n-oscuro"
      />
      <Image
        src="/marca/n-color-claro.webp"
        alt=""
        width={1400}
        height={1400}
        sizes="(min-width: 1024px) 40vw, 18rem"
        className="n3d-imagen hero-n-claro"
      />
      {/* Dónde está el punto en la imagen: de aquí sale si no hay 3D. */}
      <span className="n3d-ancla" data-punto-hero="" aria-hidden="true" />
    </div>
  )
}
