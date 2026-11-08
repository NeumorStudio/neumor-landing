// Datos legales de Salonio (la app de reservas para salones).
//
// Fuente única para las dos páginas legales (/salonio/privacidad y /salonio/condiciones). Los
// datos fiscales NO se inventan: si falta alguno, la página lo señala con «pendiente de completar»
// en lugar de publicar algo falso. Rellenar `operador` ANTES de desplegar estas páginas.
//
// El art. 10 de la LSSI-CE y el art. 13 del RGPD piden identificar a quien opera el servicio:
// denominación social o nombre, NIF, domicilio y un medio de contacto directo.

export const salonioLegal = {
  actualizado: '8 de noviembre de 2026',
  operador: {
    titular: 'Carlos Mateos Martinez' as string | null, // razón social o nombre y apellidos
    nif: '30267406G' as string | null,
    domicilio: 'C/Don Juan 61' as string | null,
    email: 'info@neumorstudio.com',
  },
}

/** Marca el hueco en lugar de dejar la frase coja o inventar el dato. */
export const dato = (v: string | null) => v ?? '«pendiente de completar»'

/** ¿Están completos los datos que exige la ley? Útil para no desplegar con huecos. */
export const legalCompleto = () => Object.values(salonioLegal.operador).every(Boolean)
