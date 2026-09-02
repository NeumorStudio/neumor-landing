'use client'

import { useEffect, useRef } from 'react'

/**
 * La mesa de piezas del hero.
 *
 * Vivía dentro de `page.tsx` y era la razón de que la portada entera fuese un
 * componente de cliente: cien líneas de físicas obligaban a mandar al navegador
 * también el titular, las tarjetas y el pie de página. Ahora es una isla.
 *
 * Y el motor no viaja en el primer paquete. Matter.js son ~26 KB comprimidos
 * para una animación que solo ocurre si alguien toca una pieza —y que ni
 * siquiera se arma con `prefers-reduced-motion`—, así que se carga en el
 * momento en que se ve claro que va a hacer falta.
 *
 * GSAP Draggable e InertiaPlugin ya no están. Eran otros 15 KB para la fase de
 * arrastre previa a las físicas, y el `MouseConstraint` de Matter hace lo mismo
 * —agarrar, lanzar y apilar— sin añadir nada.
 */

type Pieza = { label: string; lab: boolean }

export function MesaDeTaller({ piezas }: { piezas: readonly Pieza[] }) {
  const bandeja = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tray = bandeja.current
    if (!tray) return
    // Sin movimiento: las piezas se quedan quietas y no se carga ningún motor.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let limpiar: (() => void) | null = null
    let pedido = false
    let cancelado = false

    const arrancar = async () => {
      if (pedido) return
      pedido = true
      quitarEscuchas()
      const Matter = (await import('matter-js')).default
      // Entre el `await` y esta línea puede haberse desmontado el componente
      // —una navegación, un refresco en caliente—. Si ocurre, la limpieza del
      // efecto ya se ejecutó con `limpiar` a null, así que no canceló nada:
      // arrancar ahora dejaría un `requestAnimationFrame` girando para siempre
      // sobre un nodo que ya no está en la página, más los listeners que
      // `Matter.Mouse` engancha a la bandeja y que no tienen forma de quitarse.
      if (cancelado) return
      limpiar = activarFisicas(tray, Matter)
    }

    // En escritorio se adelanta al pasar el ratón por encima, así el motor ya
    // está listo cuando llega el clic. En táctil no hay hover, así que se carga
    // con el primer toque: la caída de las piezas es respuesta suficiente
    // aunque ese primer gesto todavía no arrastre.
    const alTocar = (e: PointerEvent) => {
      if (!(e.target as Element).closest('.toy-piece')) return
      arrancar()
    }
    const quitarEscuchas = () => {
      tray.removeEventListener('pointerenter', arrancar)
      tray.removeEventListener('pointerdown', alTocar, true)
    }

    tray.addEventListener('pointerenter', arrancar)
    tray.addEventListener('pointerdown', alTocar, true)

    return () => {
      cancelado = true
      quitarEscuchas()
      limpiar?.()
    }
  }, [])

  return (
    /* Decorativa para quien usa lector de pantalla. Las cinco palabras que hay
       dentro —web, panel, bot, api, juego— se leerían sueltas y sin contexto, y
       lo que significan ya está contado en condiciones en «Lo que construimos».
       Además el arrastre no tiene equivalente por teclado, así que anunciarla
       sería ofrecer algo que luego no se puede usar. */
    <div
      ref={bandeja}
      aria-hidden="true"
      className="toy-tray lq lq-vivo h-36 md:h-40 flex flex-wrap items-center justify-center gap-3 px-6"
    >
      {piezas.map((pieza) => (
        <span key={pieza.label} className="toy-piece" data-lab={pieza.lab || undefined}>
          <span className="toy-dot" />
          {pieza.label}
        </span>
      ))}
    </div>
  )
}

/** Devuelve la función de limpieza. Es el cuerpo que estaba en `page.tsx`. */
function activarFisicas(tray: HTMLElement, Matter: typeof import('matter-js')) {
  const trayRect = tray.getBoundingClientRect()
  const w = trayRect.width
  const h = trayRect.height
  const engine = Matter.Engine.create({ enableSleeping: true })
  engine.gravity.y = 1.2

  // ponytail: paredes fijadas al tamaño actual; un resize con físicas activas las desajusta
  const grosor = 200
  Matter.Composite.add(engine.world, [
    Matter.Bodies.rectangle(w / 2, h + grosor / 2, w * 2, grosor, { isStatic: true }),
    Matter.Bodies.rectangle(w / 2, -grosor / 2, w * 2, grosor, { isStatic: true }),
    Matter.Bodies.rectangle(-grosor / 2, h / 2, grosor, h * 4, { isStatic: true }),
    Matter.Bodies.rectangle(w + grosor / 2, h / 2, grosor, h * 4, { isStatic: true }),
  ])

  const items = Array.from(tray.querySelectorAll<HTMLElement>('.toy-piece')).map((el) => {
    const r = el.getBoundingClientRect()
    const cx = r.left - trayRect.left + r.width / 2
    const cy = r.top - trayRect.top + r.height / 2
    // Solo mientras hay físicas: promocionar la capa de forma permanente cuesta
    // memoria en la mayoría de visitas, en las que esto no llega a ejecutarse.
    el.style.willChange = 'transform'
    // La entrada es una animación CSS que acaba en `transform: none`. Si aún
    // está corriendo cuando se activan las físicas, pisaría el transform que
    // escribe el motor en cada frame y las piezas darían tirones.
    el.style.animation = 'none'
    const body = Matter.Bodies.rectangle(cx, cy, r.width, r.height, {
      chamfer: { radius: 13 },
      restitution: 0.25,
      friction: 0.6,
      frictionAir: 0.02,
    })
    Matter.Composite.add(engine.world, body)
    return { el, body, baseX: cx, baseY: cy }
  })

  // Agarrar, lanzar y apilar con el puntero
  const mouse = Matter.Mouse.create(tray)
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, damping: 0.1 },
  })
  Matter.Composite.add(engine.world, mouseConstraint)

  Matter.Events.on(mouseConstraint, 'startdrag', (e) => {
    const body = (e as unknown as { body?: Matter.Body }).body
    items.find((i) => i.body === body)?.el.classList.add('dragging')
  })
  Matter.Events.on(mouseConstraint, 'enddrag', () => {
    items.forEach((i) => i.el.classList.remove('dragging'))
  })

  // Si el puntero se suelta fuera de la bandeja, la pieza quedaría agarrada
  const soltarFuera = () => { mouse.button = -1 }
  window.addEventListener('pointerup', soltarFuera)

  let raf = 0
  let last = performance.now()
  const paso = (now: number) => {
    Matter.Engine.update(engine, Math.min(now - last, 33))
    last = now
    for (const { el, body, baseX, baseY } of items) {
      el.style.transform =
        `translate(${body.position.x - baseX}px, ${body.position.y - baseY}px) rotate(${body.angle}rad)`
    }
    raf = requestAnimationFrame(paso)
  }
  raf = requestAnimationFrame(paso)

  return () => {
    window.removeEventListener('pointerup', soltarFuera)
    cancelAnimationFrame(raf)
    items.forEach(({ el }) => { el.style.willChange = '' })
    Matter.Engine.clear(engine)
  }
}
