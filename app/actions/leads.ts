'use server'

/**
 * El formulario de contacto manda un correo y se acabó.
 *
 * Antes guardaba el lead en una tabla de Supabase y avisaba a un webhook de
 * n8n. Dos sitios donde mirar, dos que pueden fallar en silencio, y una base
 * de datos con datos personales de terceros que mantener por un formulario de
 * cuatro campos. Ahora es una llamada a Resend: si sale bien hay correo, si
 * sale mal quien escribe se entera en el acto.
 *
 * El reply-to apunta a quien rellena el formulario, así que responder desde
 * Gmail le llega directo sin copiar el correo a mano.
 */

const DESTINO = 'neumorstudio@gmail.com'
const REMITENTE = 'Web NeumorStudio <web@neumorstudio.com>'

export type LeadData = {
  nombre: string
  email: string
  tipo_negocio: string
  mensaje?: string
}

/** El nombre y el mensaje los escribe un desconocido y acaban dentro de un HTML. */
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!
  )

export async function crearLead(data: LeadData) {
  const nombre = (data.nombre ?? '').trim()
  const email = (data.email ?? '').trim()
  const tipo = (data.tipo_negocio ?? '').trim()
  const mensaje = (data.mensaje ?? '').trim()

  // Se valida aquí y no solo en el formulario: una server action es un
  // endpoint público y un POST directo se salta el navegador entero.
  if (nombre.length < 2) return { success: false, error: 'Dinos cómo te llamas.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { success: false, error: 'Ese email no parece válido.' }
  if (nombre.length > 100 || email.length > 200 || tipo.length > 100 || mensaje.length > 5000) {
    return { success: false, error: 'Se ha pasado de largo. Acorta un poco.' }
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Fallar en abierto sería lo peor: el usuario cree que ha contactado y no
    // ha contactado con nadie. Al menos se le da la dirección.
    console.error('RESEND_API_KEY no está definida — el formulario no puede enviar')
    return { success: false, error: `No se pudo enviar. Escríbenos a ${DESTINO}` }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: REMITENTE,
      to: [DESTINO],
      reply_to: email,
      subject: `Consulta de ${nombre}${tipo ? ` — ${tipo}` : ''}`,
      html: [
        `<p><b>Nombre:</b> ${esc(nombre)}</p>`,
        `<p><b>Email:</b> ${esc(email)}</p>`,
        tipo ? `<p><b>Tipo de negocio:</b> ${esc(tipo)}</p>` : '',
        mensaje ? `<p><b>Mensaje:</b></p><p>${esc(mensaje).replace(/\n/g, '<br>')}</p>` : '',
      ].join(''),
    }),
  })

  if (!res.ok) {
    console.error('Resend devolvió', res.status, await res.text())
    return { success: false, error: 'No se pudo enviar. Inténtalo de nuevo.' }
  }

  return { success: true }
}
