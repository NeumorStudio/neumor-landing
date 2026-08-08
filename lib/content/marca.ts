// Identidad de NeumorStudio.
//
// Fuente única de la misión, la visión y los valores. Si cambian, se cambian
// aquí y se actualiza la web entera a la vez. El motivo de que esto exista es
// concreto: en julio de 2026 la web se rehizo dos veces en paralelo y acabó
// diciendo dos cosas distintas sobre a qué nos dedicamos. El texto de marca no
// vuelve a vivir suelto dentro del JSX.
//
// Dos reglas de lenguaje, decididas y no negociables:
//   1. Nada de "neumórfico" en el texto de venta. El cliente no sabe qué es.
//   2. Nada de contar con qué herramientas trabajamos. Al cliente le da igual,
//      igual que no pregunta qué taladro usa el electricista.

export const marca = {
  nombre: "NeumorStudio",
  descriptor: "Estudio de software para negocios que quieren dejar de hacerlo a mano",

  // El hero. Es la misión dicha en una línea y sin la palabra "misión".
  titular: "Montamos el software que tu negocio todavía hace a mano",
  subtitular:
    "Reservas, gestión, captación de clientes y atención automática. " +
    "Aplicaciones a medida con su panel, entregadas funcionando y mantenidas " +
    "después, sin que necesites a nadie técnico en plantilla.",

  mision:
    "Damos a los negocios pequeños los sistemas que hasta ahora solo tenían los " +
    "grandes: reservas, stock, captación y atención automática, montados a medida, " +
    "funcionando desde el primer día y sin necesitar a nadie técnico en plantilla.",

  // Interna a propósito: sirve para decidir, no para enseñar. No se publica.
  vision:
    "Que montar el sistema de un negocio deje de ser un proyecto y pase a ser un " +
    "producto. Que cualquier negocio pueda tener su operación automatizada en días, " +
    "no en meses, ensamblando piezas que ya funcionan.",

  // Cada valor lleva su prueba al lado. Un valor sin prueba es un eslogan; el
  // campo `prueba` es lo que impide que esta lista se convierta en decoración.
  // Cada valor son dos líneas y punto: la promesa y lo que la demuestra. El
  // párrafo explicativo que había en medio se quitó a propósito — repetía el
  // título con otras palabras y era la mitad del texto de la sección.
  valores: [
    {
      titulo: "Se demuestra, no se promete",
      prueba: "Salonio está en producción, con salones cogiendo citas hoy.",
    },
    {
      titulo: "Hablamos claro",
      prueba: "En esta página no hay una sola palabra que necesite traducción.",
    },
    {
      titulo: "Se entrega funcionando",
      prueba: "El proyecto termina el día que tu primer cliente lo usa.",
    },
    {
      titulo: "Tu casa es tuya",
      prueba: "Tu panel y tu dominio, a tu nombre. Sin pedirnos permiso.",
    },
    {
      titulo: "Sin sorpresas en la factura",
      prueba: "Precio cerrado y cuota conocida antes de firmar.",
    },
  ],
} as const;

// El coste de hacerlo a mano. Esta sección existe por una razón de estructura:
// sin ella la página pasa de "montamos software" a "lo que construimos" sin que
// entre medias haya dolido nada, y un scroll largo sin tensión aburre.
//
// Nada de porcentajes ni de estudios inventados: son situaciones que quien lleva
// un negocio reconoce al leerlas. Un dato falso aquí tumbaría "hablamos claro".
export const costeManual = {
  titulo: "Lo que te cuesta hacerlo a mano",
  entrada:
    "Por separado ninguna parece grave. Juntas son la razón por la que sales tarde.",
  puntos: [
    {
      titulo: "El teléfono suena mientras atiendes",
      detalle: "Y el cliente que tienes delante espera.",
    },
    {
      titulo: "Huecos que nadie avisó",
      detalle: "La cancelación de última hora ya no la rellenas.",
    },
    {
      titulo: "Mensajes enterrados",
      detalle: "Te escriben por cinco sitios y contestas cuando puedes.",
    },
    {
      titulo: "El inventario vive en tu cabeza",
      detalle: "Te enteras de que se acabó cuando ya lo han pedido.",
    },
  ],
  cierre: "Todo esto son sistemas. Y los sistemas se montan una vez.",
} as const;

export const contacto = {
  email: "info@neumorstudio.com",
  redes: {
    instagram: "https://www.instagram.com/neumorstudio/",
    tiktok: "https://www.tiktok.com/@neumorstudio",
    x: "https://x.com/neumorstudio",
  },
} as const;

export const sitio = {
  url: "https://neumorstudio.com",
  demoSalonio: "https://reservas.neumorstudio.com",
} as const;
