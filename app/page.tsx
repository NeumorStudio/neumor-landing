import { ContactForm } from "@/components/forms/ContactForm"
import { Proyectos } from "@/components/ui/Proyectos"
import { NeumorfSection } from "@/components/ui/NeumorfSection"
import { Navbar } from "@/components/ui/Navbar"
import { marca, sitio, costeManual } from "@/lib/content/marca"
import { BrilloLiquido } from "@/components/ui/BrilloLiquido"
import { MesaDeTaller } from "@/components/ui/MesaDeTaller"
import { ActivarReveals } from "@/components/ui/ActivarReveals"

/**
 * La portada se renderiza en el servidor.
 *
 * Era `'use client'` entera: seiscientas líneas, de las cuales el 90 % es
 * marcado que no cambia nunca —el titular, las tarjetas, los valores, el pie—
 * viajaban dos veces al navegador, una como HTML y otra como JavaScript para
 * hidratar. Ahora solo son de cliente las cuatro piezas que de verdad
 * necesitan serlo: la barra, la mesa del hero, el selector de proyectos y el
 * formulario.
 */

// Piezas de la mesa de taller del hero
const toyPieces = [
  { label: 'web', lab: false },
  { label: 'panel', lab: false },
  { label: 'bot', lab: false },
  { label: 'api', lab: false },
  { label: 'juego', lab: true },
] as const

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

const nichos = [
  'Restaurantes', 'Salones', 'Clínicas',
  'Gimnasios', 'Tiendas', 'Reformas'
]

// Solo los rótulos: la sección los pinta como etiquetas y nada más. Antes cada
// uno arrastraba un `status` y un `copy` que dejaron de renderizarse cuando la
// sección se redujo a una línea, y seguían aquí sin que nadie los leyera.
const labItems = [
  'Prototipos interactivos',
  'Componentes de interfaz',
  'Herramientas internas',
]

const processSteps = [
  {
    day: '1',
    title: 'Análisis',
    copy: 'Estudiamos tu negocio y definimos el alcance: qué entra, qué no, y con qué presupuesto cerrado.',
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
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Primer tabulador de la página. Sin esto hay que pasar por los cuatro
          enlaces de la barra, el conmutador de tema y el botón de propuesta
          antes de tocar el contenido, en cada visita. */}
      <a href="#contenido" className="ng-saltar">
        Saltar al contenido
      </a>

      <BrilloLiquido />
      <ActivarReveals />
      <Navbar />

      <main id="contenido" className="min-h-screen pt-20">
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              {/* Un enlace, no un botón con `onClick`. Hace exactamente lo mismo
                  —el desplazamiento suave y el hueco bajo la barra ya están en
                  el CSS— sin necesitar una línea de JavaScript, y de paso se
                  puede abrir en otra pestaña y se anuncia como lo que es. */}
              <a href="#contacto" className="hero-cta ng-raised px-6 py-3 text-sm font-medium">
                Cuéntanos tu caso
              </a>
            </div>

            {/* Mesa de taller: las piezas se arrastran de verdad. Es la única
                parte del hero que necesita JavaScript, y su motor no se descarga
                hasta que alguien se acerca a tocarla. */}
            <MesaDeTaller piezas={toyPieces} />
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
              {/* `emerald-600` sobre esta superficie se quedaba en 2,95:1 — por
                  debajo incluso del mínimo de un elemento de interfaz. El tono
                  oscuro llega a 6:1 y en modo oscuro se sigue usando el claro,
                  que allí ya cumplía de sobra. */}
              <span className="ng-badge text-emerald-800 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
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
                <p className="font-mono text-xs text-emerald-800 dark:text-emerald-400">
                  {valor.prueba}
                </p>
              </article>
            ))}
          </div>
        </NeumorfSection>

        {/* ========== PROYECTOS ==========
            Selector, no pila. Iban uno debajo de otro y cada encargo nuevo
            alargaba la home; ahora las placas enseñan el catálogo de trabajos
            de un vistazo y el panel pinta el elegido. El contenido está en
            `lib/content/proyectos.ts`: añadir uno es escribir un objeto. */}
        <NeumorfSection id="proyectos" className="max-w-6xl">
          <div className="reveal text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Proyectos
            </h2>
            <p className="text-[var(--ink-soft)] max-w-2xl mx-auto">
              Dos en producción, de dos clases distintas: uno es nuestro y el
              otro es de un cliente. Los dos con gente usándolos hoy.
            </p>
          </div>

          <Proyectos />

          {/* La prueba acaba de convencer o no va a convencer nunca; es el punto
              del scroll donde más gente decide. Antes desde aquí solo se podía
              seguir bajando o volver a la barra. */}
          <p className="reveal text-center mt-10">
            <a href="#contacto" className="ng-btn-primary inline-flex">
              Quiero algo así para mi negocio
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </p>
        </NeumorfSection>

        {/* ========== EL PROCESO ========== */}
        <NeumorfSection id="proceso" className="max-w-6xl">
          <div className="reveal text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Del primer contacto a la entrega
            </h2>
            {/* Decía "plazos cerrados" y luego no daba ni una fecha en toda la
                sección. Una promesa que el propio texto no cumple resta más de
                lo que suma, así que se queda lo que sí se sostiene. */}
            <p className="text-[var(--ink-soft)] max-w-2xl mx-auto">
              Tres pasos y una sola persona con la que hablar durante todo el
              proyecto.
            </p>
          </div>

          <div className="reveal grid gap-6 md:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.day} className="ng-card p-6">
                <span className="step-key mb-4" aria-hidden="true">{step.day}</span>
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
                <span key={item} className="ng-raised px-4 py-2 text-sm cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </NeumorfSection>

        {/* ========== CONTACTO ========== */}
        <div id="contacto">
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
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <svg className="w-3 h-3 text-emerald-600 dark:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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

            {/* Sin año. La página es estática, así que `new Date()` se evaluaba
                al compilar y se quedaba congelado en el año del último
                despliegue: en enero el pie miente hasta que alguien publica.
                Un aviso de copyright no necesita fecha para ser válido. */}
            <span>&copy; NeumorStudio — Desarrollo de software</span>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/neumorstudio/"
                target="_blank"
                rel="noopener noreferrer"
                className="ng-raised w-10 h-10 !p-0 flex items-center justify-center"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
