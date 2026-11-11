'use client'

import { useEffect, useRef } from 'react'
import { ContactForm } from "@/components/forms/ContactForm"
import { Proyectos } from "@/components/ui/Proyectos"
import { ProductoEnEscena, type FuncionProducto } from "@/components/ui/ProductoEnEscena"
import { NeumorfSection } from "@/components/ui/NeumorfSection"
import { Navbar } from "@/components/ui/Navbar"
import { LogoN } from "@/components/ui/LogoN"
import { NEnTres } from "@/components/ui/NEnTres"
import { PuntoGuia } from "@/components/ui/PuntoGuia"
import { lineaLecturaPct } from "@/components/ui/punto-estado"
import { N_FORMA } from "@/components/ui/n-forma"
import { marca, sitio, costeManual } from "@/lib/content/marca"
import { BrilloLiquido } from "@/components/ui/BrilloLiquido"
import { Intro, EVENTO_INTRO, introActiva } from "@/components/ui/Intro"
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Lo que incluye el producto webs+panel. Cada función lleva su pantalla
// ilustrada en ProductoEnEscena, todas del mismo ejemplo inventado (Olmo, un
// restaurante), y una línea que cuenta qué se ve en ella.
const productFeatures: FuncionProducto[] = [
  {
    title: 'Web que convierte',
    copy: 'Pensada para que la visita acabe siendo cliente.',
    ejemplo: 'La portada de Olmo con la reserva a mano: se elige día y hora, y entra confirmada.',
    pantalla: 'web',
  },
  {
    title: 'Panel de gestión',
    copy: 'Precios, horarios y contenidos, sin depender de nadie.',
    ejemplo: 'El sábado de un vistazo: reservas, ocupación, quién llega ahora y cómo está la sala.',
    pantalla: 'panel',
  },
  {
    title: 'Área de clientes',
    copy: 'Un espacio privado que fideliza.',
    ejemplo: 'Lucía ve su próxima reserva, la cambia sin llamar y lleva la cuenta de sus sellos y sus visitas.',
    pantalla: 'clientes',
  },
  {
    title: 'Campañas',
    copy: 'Mensajes segmentados en el momento oportuno.',
    ejemplo: 'Un mensaje a quien lleva dos meses sin venir. Lucía contesta y su mesa queda reservada.',
    pantalla: 'campanas',
  },
  {
    title: 'Automatización',
    copy: 'Respuestas y recordatorios sin intervenir.',
    ejemplo: 'Con cada reserva salen solos la confirmación, el recordatorio y la petición de reseña. Si alguien cancela, el hueco se ofrece al siguiente.',
    pantalla: 'automatizacion',
  },
]

// Lo que hacemos, en tres palabras. El punto salta de una a otra al bajar y
// cada una se enciende cuando la toca.
const queHacemos = [
  { palabra: 'Webs', linea: 'que convierten visitas en clientes' },
  { palabra: 'Paneles', linea: 'para llevar el negocio sin depender de nadie' },
  { palabra: 'Automatización', linea: 'para lo que hoy se hace a mano' },
]

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

const dosCifras = (n: number) => String(n).padStart(2, '0')

/**
 * La cabecera de cada sección: un número de capítulo con un hueco para el
 * punto de la n. El punto se posa en él al llegar a la sección: es lo que
 * cose la página como un recorrido de principio a fin.
 */
function Capitulo({ n, nombre, centrado = true, ancla = true, caida = false }: { n: number; nombre: string; centrado?: boolean; ancla?: boolean; caida?: boolean }) {
  return (
    <p className={`capitulo${centrado ? ' justify-center' : ''}`}>
      {/* El punto brota aquí rodando desde la izquierda, donde no hay texto.
          Con `caida` llega a la vista desde la bola de la portada, en
          escritorio: ahí la n está al lado del titular y el camino va libre. */}
      <span
        className={`capitulo-punto${ancla ? ' punto-hueco' : ''}`}
        data-punto={ancla ? '' : undefined}
        data-punto-entra={ancla ? 'izquierda' : undefined}
        data-punto-camino={ancla && caida ? 'linea' : undefined}
        data-punto-camino-desde={ancla && caida ? '1024' : undefined}
        aria-hidden="true"
      />
      <span className="capitulo-n">{dosCifras(n)}</span>
      <span aria-hidden="true">—</span>
      {nombre}
    </p>
  )
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)

  // ========== LA VÍA DEL RECORRIDO ==========
  // Va del centro del primer paso al centro del último. Depende del alto de
  // las tarjetas, así que se mide en vez de fijarla en el CSS.
  useEffect(() => {
    const via = document.querySelector<HTMLElement>('.recorrido-via')
    const nodos = document.querySelectorAll<HTMLElement>('.paso-nodo')
    const caja = via?.parentElement
    if (!via || !caja || nodos.length < 2) return
    let primera = true
    const medir = () => {
      const a = nodos[0].getBoundingClientRect()
      const b = nodos[nodos.length - 1].getBoundingClientRect()
      const c = caja.getBoundingClientRect()
      via.style.top = `${a.top - c.top + a.height / 2}px`
      via.style.left = `${a.left - c.left + a.width / 2}px`
      via.style.height = `${b.top - a.top}px`
      if (!primera) ScrollTrigger.refresh()
      primera = false
    }
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(caja)
    return () => ro.disconnect()
  }, [])

  // ========== ENTRADAS Y REVEALS ==========
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // Hero: una sola entrada orquestada. Si hay pantalla de carga, espera a
      // que la web empiece a abrirse desde el punto y entra a la vez.
      const conIntro = introActiva()
      const entrada = gsap.timeline({ paused: conIntro, defaults: { ease: 'power3.out' } })
      if (conIntro) {
        entrada.timeScale(1.35)
        const empezar = () => { entrada.play() }
        window.addEventListener(EVENTO_INTRO, empezar, { once: true })
        gsap.delayedCall(5, empezar)
      }
      entrada
        .fromTo('.hero-logo', { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 1.1 })
        .fromTo('.hero-eyebrow', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.8')
        .fromTo('.hero-line', { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.7 }, '-=0.2')
        .fromTo('.hero-subrayado', { '--subrayado': 0 }, { '--subrayado': 1, duration: 0.8, ease: 'power2.inOut' }, '-=0.25')
        .fromTo('.hero-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.6')
        .fromTo('.hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5 }, '-=0.35')

      // Reveal genérico por sección: el contenido sube desde la profundidad,
      // tumbado unos grados hacia atrás, y se enfoca al ponerse de pie. El
      // filtro y el giro se quitan al acabar para no dejar capas vivas.
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(
          el.children,
          { opacity: 0, y: 40, rotationX: 9, transformPerspective: 1200, transformOrigin: '50% 100%', filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            filter: 'blur(0px)',
            stagger: 0.08,
            duration: 0.9,
            ease: 'power3.out',
            clearProps: 'filter,transform',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      })

      // El cierre del coste se ilumina palabra a palabra al leerlo.
      gsap.fromTo('.cierre-palabra', { opacity: 0.18 }, {
        opacity: 1, stagger: 0.12, ease: 'none',
        scrollTrigger: { trigger: '.cierre-coste', start: 'top 85%', end: 'top 45%', scrub: 0.4 },
      })

      // El recorrido del proceso: el punto de la n (PuntoGuia) baja por la
      // vía y la va llenando de tinta, y cada paso se enciende al llegar.
      const via = document.querySelector<HTMLElement>('.recorrido-via')
      if (via) {
        // Sin esta clase el recorrido se ve completo: si el JavaScript no
        // llega, los pasos no se quedan apagados.
        via.parentElement?.classList.add('vivo')
        // Cada tecla se enciende cuando el punto la toca por arriba: él se
        // mete debajo y la tecla se llena de tinta.
        gsap.utils.toArray<HTMLElement>('.paso').forEach((paso) => {
          ScrollTrigger.create({
            trigger: paso.querySelector('.paso-nodo'),
            start: () => `top ${lineaLecturaPct()}%`,
            toggleClass: { targets: paso, className: 'activo' },
          })
        })
      }

      // El coste: cada frase está apagada y se enciende al pasar por la
      // altura de lectura. El punto de la n baja de marca en marca y deja
      // dibujada la línea que las une (eso lo hace PuntoGuia).
      const lista = document.querySelector<HTMLElement>('.coste-lista')
      if (lista) {
        lista.classList.add('vivo')
        gsap.utils.toArray<HTMLElement>('.coste-punto').forEach((punto) => {
          gsap.timeline({
            scrollTrigger: { trigger: punto, start: 'top 80%', end: () => `top ${lineaLecturaPct()}%`, scrub: 0.4 },
          })
            .fromTo(punto.querySelector('.coste-frase'), { opacity: 0.16, x: -6 }, { opacity: 1, x: 0, ease: 'none' }, 0)
        })
      }

      // Los compromisos se apilan: cada tarjeta se queda pegada arriba y la
      // siguiente sube por encima. La de debajo se encoge y se oscurece un poco.
      const cartas = gsap.utils.toArray<HTMLElement>('.pila-carta')
      cartas.forEach((carta, i) => {
        const siguiente = cartas[i + 1]
        if (!siguiente) return
        gsap.timeline({
          scrollTrigger: {
            trigger: siguiente,
            start: 'top bottom',
            end: () => `top ${parseFloat(getComputedStyle(siguiente).top) || 96}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
          .to(carta, { scale: 0.94, ease: 'none' }, 0)
          .to(carta.querySelector('.pila-velo'), { opacity: 1, ease: 'none' }, 0)
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

    return () => {
      ctx.revert()
      document.querySelector('.recorrido')?.classList.remove('vivo')
      document.querySelector('.coste-lista')?.classList.remove('vivo')
    }
  }, [])

  // Sin movimiento, el recorrido se ve ya completo.
  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.querySelectorAll('.paso').forEach((p) => p.classList.add('activo'))
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-clip">
      <Intro />
      <BrilloLiquido />
      <PuntoGuia />
      <Navbar />

      <main className="min-h-screen pt-20">
        {/* ========== HERO: EL TITULAR Y LA N EN 3D ==========
            La n sale de la pared como una tecla y la bola de dentro es el
            punto que acompaña toda la página. */}
        <NeumorfSection className="max-w-6xl !pt-6 !pb-10 lg:!pt-10 md:!pb-12 relative flex flex-col lg:min-h-[calc(100svh-5rem)]">
          <div className="relative z-10 flex-1 grid items-center gap-4 lg:gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <div className="text-center lg:text-left">
              <p className="hero-eyebrow font-mono text-xs tracking-[0.25em] uppercase text-[var(--ink-soft)] text-balance mb-6">
                {marca.descriptor}
              </p>

              {/* El titular es la misión dicha en una línea. Habla de lo que gana
                  quien paga, no de lo que hacemos nosotros. */}
              <h1 className="font-display text-[2.05rem] sm:text-5xl xl:text-[3.4rem] font-semibold leading-[1.04] mb-6">
                <span className="hero-line block">Montamos el software</span>
                <span className="hero-line block">que tu negocio</span>
                <span className="hero-line block"><span className="hero-subrayado">todavía hace a mano.</span></span>
              </h1>

              <p className="hero-desc text-base md:text-lg text-[var(--ink-soft)] mb-8 max-w-xl mx-auto lg:mx-0">
                {marca.subtitular}
              </p>

              {/* El primer botón lleva a un producto en producción, no a un
                  formulario: es lo que hace verdad el "se demuestra, no se promete". */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center">
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
            </div>

            <div className="hero-logo order-first lg:order-none mx-auto w-full max-w-[19rem] sm:max-w-sm lg:max-w-none">
              <NEnTres className="hero-n3d" />
            </div>
          </div>

        </NeumorfSection>

        {/* ========== EL COSTE DE HACERLO A MANO ==========
            La bisagra del scroll: el hero promete y esta sección explica por qué
            hace falta. Va justo después del titular para que quien llega se
            reconozca antes de que le vendamos nada. */}
        <NeumorfSection id="coste" className="max-w-6xl">
          <div className="reveal text-center mb-14 md:mb-20">
            <Capitulo n={1} nombre="El problema" caida />
            <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4 text-balance">
              {costeManual.titulo}
            </h2>
            <p className="text-[var(--ink-soft)] md:text-lg max-w-2xl mx-auto">
              {costeManual.entrada}
            </p>
          </div>

          {/* Cuatro frases grandes, apagadas, que se encienden una a una al
              bajar. El punto de la n baja de marca en marca por la línea que
              las une, a la vista: ese carril va libre de texto. */}
          <ol className="coste-lista">
            {costeManual.puntos.map((punto, i) => (
              <li key={punto.titulo} className="coste-punto" data-punto-grupo="">
                {i < costeManual.puntos.length - 1 && (
                  <span className="coste-tramo" aria-hidden="true"><span /></span>
                )}
                <span
                  className="coste-marca punto-hueco"
                  data-punto=""
                  data-punto-camino={i > 0 ? 'linea' : undefined}
                  aria-hidden="true"
                />
                <div className="coste-frase">
                  <h3 className="coste-titulo">{punto.titulo}</h3>
                  <p className="coste-detalle">{punto.detalle}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Se enciende palabra a palabra con el scroll (ver el efecto de entradas). */}
          <p className="cierre-coste text-center font-display text-2xl md:text-4xl font-semibold mt-20 md:mt-28 max-w-3xl mx-auto text-balance">
            {costeManual.cierre.split(' ').map((palabra, i) => (
              <span key={i} className="cierre-palabra">{palabra} </span>
            ))}
          </p>
        </NeumorfSection>

        {/* ========== LO QUE CONSTRUIMOS ==========
            Primero en tres palabras, con el punto saltando de una a otra, y
            luego el ejemplo entero: una web con su panel, pantalla a pantalla. */}
        <NeumorfSection id="construimos" className="max-w-6xl">
          <div className="reveal text-center mb-10 md:mb-14">
            <Capitulo n={2} nombre="La solución" />
            <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4">
              Lo que construimos
            </h2>
          </div>

          <ol className="tres">
            {queHacemos.map((q, i) => (
              <li key={q.palabra} className="tres-item">
                {/* En fila (de tableta para arriba) el punto salta de un
                    hueco al siguiente. En móvil van apiladas, con la palabra
                    en medio, y brota en cada una. */}
                <span
                  className="tres-hueco punto-hueco"
                  data-punto=""
                  data-punto-camino={i > 0 ? 'salto' : undefined}
                  data-punto-camino-desde={i > 0 ? '768' : undefined}
                  aria-hidden="true"
                />
                <span className="tres-palabra font-display">{q.palabra}</span>
                <span className="tres-linea">{q.linea}</span>
              </li>
            ))}
          </ol>

          <p className="text-center text-[var(--ink-soft)] md:text-lg max-w-2xl mx-auto mt-12 md:mt-16 mb-10 md:mb-14">
            Así se ve todo junto en un restaurante inventado, Olmo: la web, su
            panel y lo que pasa solo por detrás.
          </p>

          <ProductoEnEscena funciones={productFeatures} />

          <div className="nichos-section mt-16 md:mt-24 flex flex-col items-center gap-4 text-center">
            <span className="text-sm text-[var(--ink-soft)]">Soluciones especializadas por sector</span>
            <div className="flex flex-wrap justify-center gap-2.5">
              {nichos.map((nicho) => (
                <span key={nicho} className="nicho-pill ng-raised px-4 py-2 text-sm cursor-default">
                  {nicho}
                </span>
              ))}
            </div>
          </div>
        </NeumorfSection>

        {/* ========== PROYECTOS ==========
            Justo después del ejemplo, a propósito: Olmo es inventado y aquí
            están los de verdad. Es el momento en que quien duda quiere pruebas.
            El selector enseña el catálogo de un vistazo y el panel pinta el
            elegido; el punto toma el color de cada proyecto. Los datos están en
            `lib/content/proyectos.ts`: añadir uno es escribir un objeto. */}
        <NeumorfSection id="proyectos" className="max-w-6xl">
          <div className="reveal text-center mb-12 md:mb-16">
            <Capitulo n={3} nombre="Casos reales" />
            <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4">
              Proyectos
            </h2>
            <p className="text-[var(--ink-soft)] md:text-lg max-w-2xl mx-auto">
              Olmo es un ejemplo. Estos no: están en producción y con gente
              usándolos hoy. Uno es nuestro y el otro, de un cliente.
            </p>
          </div>

          <Proyectos />
        </NeumorfSection>

        {/* ========== CÓMO TRABAJAMOS: LOS VALORES, CON SU PRUEBA ========== */}
        <NeumorfSection id="compromisos" className="max-w-6xl seccion-texturada">
          <div className="reveal text-center mb-12 md:mb-16">
            <Capitulo n={4} nombre="Compromisos" />
            <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4">
              Cómo trabajamos
            </h2>
            <p className="text-[var(--ink-soft)] md:text-lg max-w-2xl mx-auto">
              Cinco compromisos, y al lado de cada uno, lo que lo demuestra.
            </p>
          </div>

          {/* Las tarjetas se apilan al bajar: cada una se queda arriba y la
              siguiente sube por encima. */}
          <ol className="pila">
            {marca.valores.map((valor, i) => (
              <li
                key={valor.titulo}
                className="pila-carta ng-card"
                style={{ '--i': i } as React.CSSProperties}
              >
                <span className="pila-num">
                  {dosCifras(i + 1)}
                  <span>/ {dosCifras(marca.valores.length)}</span>
                </span>
                <h3 className="pila-titulo">{valor.titulo}</h3>
                <div className="pila-prueba">
                  <span className="pila-etiqueta">La prueba</span>
                  <p>{valor.prueba}</p>
                </div>
                <span className="pila-velo" aria-hidden="true" />
              </li>
            ))}
          </ol>
        </NeumorfSection>

        {/* ========== EL PROCESO ========== */}
        <NeumorfSection id="proceso" className="max-w-6xl">
          <div className="reveal text-center mb-12 md:mb-16">
            <Capitulo n={5} nombre="El proceso" />
            <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4">
              Del primer contacto a la entrega
            </h2>
            <p className="text-[var(--ink-soft)] max-w-2xl mx-auto">
              Tres pasos, plazos cerrados y una sola persona con la que hablar
              durante todo el proyecto.
            </p>
          </div>

          {/* El recorrido. Una vía vertical une los tres pasos y el punto de la
              n baja por ella al hacer scroll, encendiendo cada paso al pasar. */}
          <div className="recorrido max-w-3xl mx-auto">
            <div className="recorrido-via" data-punto="via" data-punto-tam="14" aria-hidden="true">
              <span className="recorrido-luz" />
            </div>
            <ol className="recorrido-lista">
            {processSteps.map((step) => (
              <li key={step.day} className="paso">
                <span className="paso-nodo step-key" data-punto-tapa="" aria-hidden="true">
                  {step.day.padStart(2, '0')}
                </span>
                <div className="paso-tarjeta ng-card p-6 md:p-7">
                  <p className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-[var(--ink-soft)] mb-2">
                    Paso {step.day} de {processSteps.length}
                  </p>
                  <h3 className="font-display text-xl md:text-2xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--ink-soft)]">{step.copy}</p>
                </div>
              </li>
            ))}
            </ol>
          </div>
        </NeumorfSection>

        {/* ========== EL LABORATORIO ==========
            Baja hasta aquí: quien decide comprar ya ha decidido antes de
            llegar, así que a partir de este punto el contenido técnico no le
            quita el sitio a nada. */}
        <NeumorfSection id="laboratorio" className="max-w-6xl">
          <div className="reveal text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3">
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

        {/* ========== CONTACTO ==========
            El recorrido acaba aquí: el punto vuelve a la n y el logo queda
            completo junto al formulario. */}
        <div id="contacto">
          <NeumorfSection className="pb-24">
            <div className="reveal grid gap-12 md:grid-cols-2 items-start">
              <div className="space-y-6">
                <div className="casa" aria-hidden="true">
                  <svg viewBox={N_FORMA.vista} className="casa-n">
                    <path d={N_FORMA.n} />
                  </svg>
                  <span className="casa-hueco punto-hueco" data-punto="" />
                </div>
                <div>
                  {/* Sin hueco para el punto: aquí el final es la n de arriba. */}
                  <Capitulo n={6} nombre="Hablemos" centrado={false} ancla={false} />
                  <h2 className="font-display text-3xl md:text-5xl font-semibold mb-4">
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
                      <span className="contacto-marca" aria-hidden="true">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <NeumorfSection className="!py-8 md:!py-10 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[var(--ink-soft)]">
            {/* La misma firma que la barra: la n y el nombre. */}
            <div className="flex items-center gap-2.5 text-xl font-semibold tracking-[-0.035em] text-[var(--foreground)]">
              <LogoN className="w-7 h-7" />
              NeumorStudio
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
            </div>
          </NeumorfSection>
        </footer>
      </main>
    </div>
  )
}
