/**
 * Los proyectos, como datos.
 *
 * Estaban sueltos en `page.tsx` y la sección crecía hacia abajo cada vez que
 * añadíamos uno. Aquí cada proyecto es una entrada de esta lista y la sección
 * mide lo mismo con dos que con doce: el selector enseña las placas y el panel
 * pinta solo el elegido.
 *
 * Añadir el siguiente es escribir un objeto más. Si trae una pieza propia
 * —Salonio tiene su agenda animada, Regalado su comparador— se declara en
 * `pieza` y el panel la coloca; lo demás sale igual para todos.
 */

export type Naturaleza = 'Producto propio' | 'Encargo de cliente'

/** Las piezas interactivas que sabe pintar el panel. Es una lista cerrada a
 *  propósito: así el componente no recibe JSX desde los datos y el fichero se
 *  queda siendo contenido, no maquetación. */
export type PiezaProyecto = 'agenda-salonio' | 'antes-despues-regalado'

export type Proyecto = {
  id: string
  nombre: string
  /** Lo que va en la placa del selector, debajo del nombre. */
  naturaleza: Naturaleza
  titulo: string
  entradilla: string
  insignias: string[]
  pieza?: PiezaProyecto
  capturas?: { src: string; alt: string; pie: string; ancho: number; alto: number; estrecha?: boolean }[]
  funciones: { title: string; copy: string }[]
  stack: string[]
  enlace: { href: string; texto: string }
}

export const proyectos: Proyecto[] = [
  {
    id: 'salonio',
    nombre: 'Salonio',
    naturaleza: 'Producto propio',
    titulo: 'Salonio — reservas para peluquerías',
    entradilla:
      'Los clientes reservan solos a cualquier hora. El dueño deja de coger el teléfono a mitad de un corte.',
    insignias: ['Peluquerías y barberías'],
    pieza: 'agenda-salonio',
    capturas: [
      {
        src: '/images/salonio-web.webp',
        alt: 'Página de inicio de Salonio en escritorio',
        pie: 'La web pública',
        ancho: 1600,
        alto: 1000,
      },
      {
        src: '/images/salonio-movil.webp',
        alt: 'Salonio en un móvil, instalable como app',
        pie: 'Instalable en el móvil',
        ancho: 600,
        alto: 1299,
        // A su ancho natural sale el doble de alto que la captura de
        // escritorio y deja un hueco muerto al lado.
        estrecha: true,
      },
    ],
    funciones: [
      { title: 'Reservas sin llamadas', copy: 'El cliente elige hueco y la agenda se actualiza sola.' },
      { title: 'Cobro de la señal', copy: 'El dinero va directo al banco del salón, sin pasar por nosotros.' },
      { title: 'Recordatorios automáticos', copy: 'Menos ausencias sin que nadie avise a mano.' },
      { title: 'Fidelización por sellos', copy: 'El barbero ve en la agenda a quién le toca premio.' },
      { title: 'Instalable en el móvil', copy: 'Se instala como app, sin pasar por ninguna tienda.' },
      { title: 'Dominio propio', copy: 'Sin marketplace ni comisiones delante de su marca.' },
    ],
    stack: ['Next.js', 'Supabase', 'PostgreSQL + RLS', 'Stripe Connect', 'Vercel', 'Web Push'],
    enlace: { href: 'https://reservas.neumorstudio.com', texto: 'Ver Salonio' },
  },
  {
    id: 'regalado',
    nombre: 'González-Regalado',
    naturaleza: 'Encargo de cliente',
    titulo: 'González-Regalado Gourmet — catálogo y escaparate',
    entradilla:
      'Tenían una web de una sola pantalla que no enseñaba lo que venden. Ahora tienen su catálogo entero en siete idiomas.',
    insignias: ['Web rehecha', 'Alimentación gourmet'],
    pieza: 'antes-despues-regalado',
    funciones: [
      {
        title: 'Catálogo de verdad',
        copy: 'Antes, cuatro nombres de categoría en texto plano. Ahora 50 fichas con sus formatos, repartidas en ocho categorías.',
      },
      {
        title: 'De tres idiomas a siete',
        copy: 'Las tres URLs que ya estaban indexadas se respetan intactas y se suman cuatro mercados nuevos.',
      },
      {
        title: 'Fotografía sin marca ajena',
        copy: 'El cliente pidió catálogo sin fabricantes. No queda una sola etiqueta de proveedor a la vista.',
      },
      {
        title: 'Ferias y prensa',
        copy: 'Secciones que aparecen solas cuando hay algo que contar y se callan cuando no lo hay.',
      },
    ],
    stack: ['Next.js 16', 'React 19', 'Tailwind 4', 'Vercel', 'Contenido en JSON'],
    enlace: { href: 'https://regaladogourmet.com', texto: 'Ver la web' },
  },
]

/**
 * El antes y el después de González-Regalado, en cifras.
 *
 * Son reales y contrastables: salen de contar la copia de su web anterior y el
 * sitemap de la nueva, no de redondear al alza.
 */
export const regaladoCifras = [
  { etiqueta: 'idiomas', antes: 3, despues: 7 },
  { etiqueta: 'páginas', antes: 22, despues: 140 },
  { etiqueta: 'fichas', antes: 0, despues: 50 },
  { etiqueta: 'fotos', antes: 2, despues: 106 },
]
