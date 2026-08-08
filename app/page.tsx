'use client'

import { useEffect, useRef } from 'react'
import { ContactForm } from "@/components/forms/ContactForm"
import { NeumorfSection } from "@/components/ui/NeumorfSection"
import { Navbar } from "@/components/ui/Navbar"
import { marca, sitio, costeManual } from "@/lib/content/marca"
import { BrilloLiquido } from "@/components/ui/BrilloLiquido"
import { AgendaQueSeLlena } from "@/components/ui/AgendaQueSeLlena"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import Matter from 'matter-js'

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin)

// Piezas de la mesa de taller del hero
const toyPieces = [
  { label: 'web', lab: false },
  { label: 'panel', lab: false },
  { label: 'bot', lab: false },
  { label: 'api', lab: false },
  { label: 'juego', lab: true },
]

// Lo que incluye el producto webs+panel.
// Los iconos salen todos de la misma rejilla generada de una vez, así que
// comparten grosor de trazo, relieve y luz: es lo que hace que se lean como un
// set y no como nueve iconos sueltos de sitios distintos.
const productFeatures = [
  { title: 'Web que convierte', copy: 'Pensada para que la visita acabe siendo cliente.', icono: 'web' },
  { title: 'Panel de gestión', copy: 'Precios, horarios y contenidos, sin depender de nadie.', icono: 'panel' },
  { title: 'Área de clientes', copy: 'Un espacio privado que fideliza.', icono: 'clientes' },
  { title: 'Campañas', copy: 'Mensajes segmentados en el momento oportuno.', icono: 'campanas' },
  { title: 'Automatización', copy: 'Respuestas y recordatorios sin intervenir.', icono: 'automatizacion' },
]

/**
 * Aquí había dos vídeos de stock rotulados «La web pública» y «El panel de
 * gestión». Se leían como trabajo nuestro sin serlo, y ya no hacen falta:
 * Salonio está en producción y la sección de abajo enseña el producto real.
 */

// Lo que hace Salonio de verdad, no lo que promete el folleto.
// Esta es la única sección que se deja larga a propósito: es la prueba, y el
// contraste con el resto es lo que le dice al ojo dónde detenerse.
const salonioFeatures = [
  { title: 'Reservas sin llamadas', copy: 'El cliente elige hueco y la agenda se actualiza sola.' },
  { title: 'Cobro de la señal', copy: 'El dinero va directo al banco del salón, sin pasar por nosotros.' },
  { title: 'Recordatorios automáticos', copy: 'Menos ausencias sin que nadie avise a mano.' },
  { title: 'Fidelización por sellos', copy: 'El barbero ve en la agenda a quién le toca premio.' },
  { title: 'Instalable en el móvil', copy: 'Se instala como app, sin pasar por ninguna tienda.' },
  { title: 'Dominio propio', copy: 'Sin marketplace ni comisiones delante de su marca.' },
]

const salonioStack = ['Next.js', 'Supabase', 'PostgreSQL + RLS', 'Stripe Connect', 'Vercel', 'Web Push']

const nichos = [
  'Restaurantes', 'Salones', 'Clínicas',
  'Gimnasios', 'Tiendas', 'Reformas'
]

const labItems = [
  {
    status: 'en desarrollo',
    title: 'Prototipos interactivos',
    copy: 'Mecánicas y experiencias interactivas que evaluamos internamente antes de convertirlas en producto.',
  },
  {
    status: 'en validación',
    title: 'Componentes de interfaz',
    copy: 'Elementos de interfaz propios que diseñamos, probamos y reutilizamos en los proyectos de cliente.',
  },
  {
    status: 'en producción',
    title: 'Herramientas internas',
    copy: 'Software que automatiza parte de nuestro propio flujo de trabajo y madura hasta convertirse en producto.',
  },
]

const processSteps = [
  {
    day: '1',
    title: 'Análisis',
    copy: 'Estudiamos tu negocio y definimos el alcance: funcionalidades, plazos y presupuesto cerrado.',
  },
  {
    day: '2',
    title: 'Desarrollo',
    copy: 'Construimos la solución con entregas parciales, para que el avance sea visible y verificable.',
  },
  {
    day: '3',
    title: 'Entrega y soporte',
    copy: 'Publicación, formación de tu equipo y soporte continuado tras la puesta en marcha.',
  },
]

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const trayRef = useRef<HTMLDivElement>(null)

  // ========== MESA DE TALLER: al primer toque las piezas cobran físicas ==========
  useEffect(() => {
    const tray = trayRef.current
    if (!tray) return

    // Arrastre suave inicial; muere en cuanto entran las físicas
    const draggables = Draggable.create('.toy-piece', {
      type: 'x,y',
      bounds: tray,
      inertia: true,
      edgeResistance: 0.7,
      onPress() { this.target.classList.add('dragging') },
      onRelease() { this.target.classList.remove('dragging') },
    })

    let engine: Matter.Engine | null = null
    let raf = 0
    let releaseOutside: (() => void) | null = null

    const activatePhysics = () => {
      draggables.forEach((d) => d.kill())

      const trayRect = tray.getBoundingClientRect()
      const w = trayRect.width
      const h = trayRect.height
      engine = Matter.Engine.create({ enableSleeping: true })
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
        // Centro de la pieza en el flujo, sin el transform que dejó el arrastre
        const baseX = cx - (Number(gsap.getProperty(el, 'x')) || 0)
        const baseY = cy - (Number(gsap.getProperty(el, 'y')) || 0)
        const body = Matter.Bodies.rectangle(cx, cy, r.width, r.height, {
          chamfer: { radius: 13 },
          restitution: 0.25,
          friction: 0.6,
          frictionAir: 0.02,
        })
        Matter.Composite.add(engine!.world, body)
        return { el, body, baseX, baseY }
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
      releaseOutside = () => { mouse.button = -1 }
      window.addEventListener('pointerup', releaseOutside)

      let last = performance.now()
      const step = (now: number) => {
        Matter.Engine.update(engine!, Math.min(now - last, 33))
        last = now
        for (const { el, body, baseX, baseY } of items) {
          el.style.transform =
            `translate(${body.position.x - baseX}px, ${body.position.y - baseY}px) rotate(${body.angle}rad)`
        }
        raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }

    const onFirstTouch = (e: PointerEvent) => {
      if (!(e.target as Element).closest('.toy-piece')) return
      tray.removeEventListener('pointerdown', onFirstTouch, true)
      activatePhysics()
    }
    // Con reduced motion se quedan en arrastre simple, sin caída
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tray.addEventListener('pointerdown', onFirstTouch, true)
    }

    return () => {
      tray.removeEventListener('pointerdown', onFirstTouch, true)
      if (releaseOutside) window.removeEventListener('pointerup', releaseOutside)
      cancelAnimationFrame(raf)
      if (engine) Matter.Engine.clear(engine)
      draggables.forEach((d) => d.kill())
    }
  }, [])

  // ========== ENTRADAS Y REVEALS ==========
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Hero: una sola entrada orquestada
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo('.hero-eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 })
        .fromTo('.hero-line', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.7 }, '-=0.2')
        .fromTo('.hero-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
        .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 }, '-=0.35')
        .fromTo('.toy-tray', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
        .fromTo('.toy-piece', { opacity: 0, scale: 0.6, y: -40 }, { opacity: 1, scale: 1, y: 0, stagger: 0.07, duration: 0.6, ease: 'back.out(2)' }, '-=0.4')

      // Reveal genérico por sección
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(
          el.children,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // Pills de nichos
      gsap.fromTo(
        '.nicho-pill',
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          stagger: 0.05, duration: 0.5, ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.nichos-section',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden">
      <BrilloLiquido />
      <Navbar />

      <main className="min-h-screen pt-20">
        {/* ========== HERO: MANIFIESTO + MESA DE TALLER ========== */}
        <NeumorfSection className="py-14 md:py-20 relative">
          <div className="hero-fondo" aria-hidden="true" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="hero-eyebrow font-mono text-xs tracking-[0.25em] uppercase text-[var(--ink-soft)] mb-6">
              {marca.descriptor}
            </p>

            {/* El titular es la misión dicha en una línea. Habla de lo que gana
                quien paga, no de lo que hacemos nosotros. */}
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="hero-line block">Montamos el software</span>
              <span className="hero-line block">que tu negocio</span>
              <span className="hero-line block text-[var(--accent)]">todavía hace a mano.</span>
            </h1>

            <p className="hero-desc text-base md:text-lg text-[var(--ink-soft)] mb-8 max-w-xl mx-auto">
              {marca.subtitular}
            </p>

            {/* El primer botón lleva a un producto en producción, no a un
                formulario: es lo que hace verdad el "se demuestra, no se promete". */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
              <a
                href={sitio.demoSalonio}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-cta ng-btn-primary"
              >
                Ver uno funcionando
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <button
                onClick={() => document.querySelector('#contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="hero-cta ng-raised px-6 py-3 text-sm font-medium"
              >
                Cuéntanos tu caso
              </button>
            </div>

            {/* Mesa de taller: las piezas se arrastran de verdad */}
            {/* La mesa de piezas pasa a ser cristal: es lo único que flota sobre
                el fondo del hero y por tanto el sitio natural del material.
                Su contenido —las piezas arrastrables— sigue intacto. */}
            <div ref={trayRef} className="toy-tray lq lq-vivo h-36 md:h-40 flex flex-wrap items-center justify-center gap-3 px-6">
              {toyPieces.map((piece) => (
                <span key={piece.label} className="toy-piece" data-lab={piece.lab || undefined}>
                  <span className="toy-dot" />
                  {piece.label}
                </span>
              ))}
            </div>
          </div>
        </NeumorfSection>

        {/* ========== EL COSTE DE HACERLO A MANO ==========
            La bisagra del scroll: el hero promete y esta sección explica por qué
            hace falta. Va justo después del titular para que quien llega se
            reconozca antes de que le vendamos nada. */}
        <NeumorfSection id="coste" className="max-w-6xl">
          <div className="reveal text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              {costeManual.titulo}
            </h2>
            <p className="text-[var(--ink-soft)] max-w-2xl mx-auto">
              {costeManual.entrada}
            </p>
          </div>

          <div className="reveal grid gap-6 md:grid-cols-2">
            {costeManual.puntos.map((punto) => (
              <article key={punto.titulo} className="ng-card p-6">
                <h3 className="font-display text-lg font-bold mb-2">{punto.titulo}</h3>
                <p className="text-sm text-[var(--ink-soft)]">{punto.detalle}</p>
              </article>
            ))}
          </div>

          <p className="reveal text-center font-display text-xl md:text-2xl font-bold tracking-tight mt-10">
            {costeManual.cierre}
          </p>
        </NeumorfSection>

        {/* ========== LO QUE CONSTRUIMOS ========== */}
        <NeumorfSection id="construimos" className="max-w-6xl">
          <div className="reveal text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Lo que construimos
            </h2>
            <p className="text-[var(--ink-soft)] max-w-2xl mx-auto">
              Producto propio y desarrollo a medida. Lo que madura en nuestra
              línea de I+D se incorpora a este catálogo.
            </p>
          </div>

          <div className="reveal ng-card p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="ng-badge text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Disponible
              </span>
              <span className="ng-badge text-[var(--ink-soft)]">Panel de gestión</span>
              <span className="ng-badge text-[var(--ink-soft)]">Automatización incluida</span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Aplicaciones web con panel de gestión
            </h3>
            <p className="text-[var(--ink-soft)] max-w-2xl mb-10">
              Para empresas y negocios locales que necesitan una presencia digital
              profesional y autonomía completa en la gestión diaria.
            </p>

            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              {productFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-3 items-start">
                  {/* Cada tema carga su propio icono, y el cambio lo hace el CSS:
                      así no hay parpadeo al alternar claro/oscuro ni hace falta
                      que JavaScript decida nada. */}
                  <span
                    className="icono-feature"
                    aria-hidden="true"
                    style={{
                      '--ico': `url(/images/iconos/${feature.icono}.webp)`,
                      '--ico-oscuro': `url(/images/iconos-oscuro/${feature.icono}.webp)`,
                    } as React.CSSProperties}
                  />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                    <p className="text-sm text-[var(--ink-soft)]">{feature.copy}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="nichos-section flex flex-wrap items-center gap-3">
              <span className="text-sm text-[var(--ink-soft)] mr-1">Soluciones especializadas por sector:</span>
              {nichos.map((nicho) => (
                <span key={nicho} className="nicho-pill ng-raised px-4 py-2 text-sm cursor-default">
                  {nicho}
                </span>
              ))}
            </div>
          </div>
        </NeumorfSection>

        {/* ========== CÓMO TRABAJAMOS: LOS VALORES, CON SU PRUEBA ==========
            Va antes de Proyectos a propósito: aquí se promete y justo debajo
            está Salonio para confirmarlo. Un valor sin prueba es un eslogan. */}
        <NeumorfSection id="compromisos" className="max-w-6xl seccion-texturada">
          <div className="reveal text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Cómo trabajamos
            </h2>
            <p className="text-[var(--ink-soft)] max-w-2xl mx-auto">
              Cinco compromisos, cada uno con lo que lo demuestra al lado.
            </p>
          </div>

          <div className="reveal grid gap-6 md:grid-cols-2">
            {marca.valores.map((valor) => (
              <article key={valor.titulo} className="ng-card p-6 flex flex-col gap-2">
                <h3 className="font-display text-lg font-bold">{valor.titulo}</h3>
                <p className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  {valor.prueba}
                </p>
              </article>
            ))}
          </div>
        </NeumorfSection>

        {/* ========== PROYECTOS: SALONIO ========== */}
        <NeumorfSection id="proyectos" className="max-w-6xl">
          <div className="reveal text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Proyectos
            </h2>
            <p className="text-[var(--ink-soft)] max-w-2xl mx-auto">
              Producto propio en producción. Lo que describimos arriba,
              funcionando y con clientes reales usándolo cada día.
            </p>
          </div>

          <div className="reveal ng-card p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="ng-badge text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                En producción
              </span>
              <span className="ng-badge text-[var(--ink-soft)]">Producto propio</span>
              <span className="ng-badge text-[var(--ink-soft)]">Peluquerías y barberías</span>
            </div>

            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Salonio — reservas para peluquerías
            </h3>
            <p className="text-[var(--ink-soft)] max-w-2xl mb-8">
              Los clientes reservan solos a cualquier hora. El dueño deja de coger
              el teléfono a mitad de un corte.
            </p>

            {/* Esto sustituye al párrafo que explicaba cómo entran las reservas:
                se ve en cinco segundos y no hay que leerlo. */}
            <div className="mb-10">
              <AgendaQueSeLlena />
            </div>

            {/* Capturas reales del producto, no maquetas */}
            {/* El móvil se acota a 240px: a su ancho natural salía el doble de
                alto que la captura de escritorio y dejaba un hueco muerto. */}
            <div className="grid gap-6 md:grid-cols-[2fr_1fr] items-center justify-items-center mb-10">
              <figure>
                <div className="ng-video-card overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/salonio-web.webp"
                    alt="Página de inicio de Salonio en escritorio"
                    width={1600}
                    height={1000}
                    loading="lazy"
                    className="w-full h-auto"
                  />
                </div>
                <figcaption className="font-mono text-xs text-[var(--ink-soft)] mt-3 text-center">
                  La web pública
                </figcaption>
              </figure>
              <figure className="w-full max-w-[240px]">
                <div className="ng-video-card overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/salonio-movil.webp"
                    alt="Salonio en un móvil, instalable como app"
                    width={600}
                    height={1299}
                    loading="lazy"
                    className="w-full h-auto"
                  />
                </div>
                <figcaption className="font-mono text-xs text-[var(--ink-soft)] mt-3 text-center">
                  Instalable en el móvil
                </figcaption>
              </figure>
            </div>

            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
              {salonioFeatures.map((feature) => (
                <div key={feature.title}>
                  <h4 className="font-semibold text-sm mb-1">{feature.title}</h4>
                  <p className="text-sm text-[var(--ink-soft)]">{feature.copy}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-sm text-[var(--ink-soft)] mr-1">Construido con:</span>
              {salonioStack.map((tech) => (
                <span key={tech} className="ng-raised px-4 py-2 text-sm cursor-default">
                  {tech}
                </span>
              ))}
            </div>

            <a
              href="https://reservas.neumorstudio.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ng-btn-primary inline-flex"
            >
              Ver Salonio
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </NeumorfSection>

        {/* ========== EL PROCESO ========== */}
        <NeumorfSection id="proceso" className="max-w-6xl">
          <div className="reveal text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Del primer contacto a la entrega
            </h2>
            <p className="text-[var(--ink-soft)] max-w-2xl mx-auto">
              Tres pasos, plazos cerrados y una sola persona con la que hablar
              durante todo el proyecto.
            </p>
          </div>

          <div className="reveal grid gap-6 md:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.day} className="ng-card p-6">
                <span className="step-key mb-4">{step.day}</span>
                <h3 className="font-display text-lg font-bold mt-4 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--ink-soft)]">{step.copy}</p>
              </div>
            ))}
          </div>

        </NeumorfSection>

        {/* ========== EL LABORATORIO ==========
            Baja hasta aquí: quien decide comprar ya ha decidido antes de
            llegar, así que a partir de este punto el contenido técnico no le
            quita el sitio a nada. */}
        <NeumorfSection id="laboratorio" className="max-w-6xl">
          {/* Era la sección más larga siendo la menos importante: 152 palabras,
              tres tarjetas y un bloque entero sobre metodología interna. Queda
              en una línea y las etiquetas. Quien quiera detalle, va a GitHub. */}
          <div className="reveal text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-3">
              El laboratorio
            </h2>
            <p className="text-[var(--ink-soft)] mb-6">
              Lo que probamos por dentro antes de que llegue a un cliente.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {labItems.map((item) => (
                <span key={item.title} className="ng-raised px-4 py-2 text-sm cursor-default">
                  {item.title}
                </span>
              ))}
            </div>
          </div>
        </NeumorfSection>

        {/* ========== CONTACTO ========== */}
        <div ref={contactRef} id="contacto">
          <NeumorfSection className="pb-24">
            <div className="reveal grid gap-12 md:grid-cols-2 items-start">
              <div className="space-y-6">
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
                    Hablemos de tu proyecto
                  </h2>
                  <p className="text-[var(--ink-soft)] leading-relaxed">
                    Cuéntanos qué necesitas y te enviaremos una propuesta
                    concreta: qué montaríamos, por dónde empezaríamos, en cuánto
                    tiempo y cuánto costaría.
                  </p>
                </div>

                {/* Cualificar antes de que escriban ahorra tiempo a los dos y
                    sube la calidad de lo que entra por el formulario. */}
                <ul className="space-y-3">
                  {[
                    'Ideal si ya tienes negocio y pierdes horas en tareas repetidas',
                    'También si estás arrancando y quieres empezar con base sólida',
                    'Respuesta en menos de 24 horas',
                    'Si no te encajamos, te lo decimos',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[var(--ink-soft)]">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="contact-form">
                <ContactForm />
              </div>
            </div>
          </NeumorfSection>
        </div>

        {/* ========== FOOTER ========== */}
        <footer className="border-t border-[var(--edge-border)]">
          <NeumorfSection className="py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[var(--ink-soft)]">
            {/* Wordmark: neumor▪ / STUDIO */}
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="font-display text-2xl font-bold tracking-tight leading-none text-[var(--foreground)]">
                neumor
                <span
                  className="inline-block w-[0.16em] h-[0.16em] ml-[0.08em] rounded-[1px] bg-[var(--accent)]"
                  aria-hidden="true"
                />
              </span>
              <span className="text-[0.6rem] font-light uppercase tracking-[0.45em] ml-[0.2em]">
                Studio
              </span>
            </div>

            <span>&copy; {new Date().getFullYear()} NeumorStudio — Desarrollo de software</span>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/neumorstudio/"
                target="_blank"
                rel="noopener noreferrer"
                className="ng-raised w-10 h-10 !p-0 flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@neumorstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="ng-raised w-10 h-10 !p-0 flex items-center justify-center"
                aria-label="TikTok"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
              <a
                href="https://x.com/neumorstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="ng-raised w-10 h-10 !p-0 flex items-center justify-center"
                aria-label="X"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </NeumorfSection>
        </footer>
      </main>
    </div>
  )
}
