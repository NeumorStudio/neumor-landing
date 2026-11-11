import type { ReactNode } from 'react'

/**
 * Los iconos de las pantallas del ejemplo (Olmo). Son de trazo, en una caja de
 * 24 × 24, y toman el color y el tamaño del texto que tienen al lado.
 */
const TRAZOS = {
  inicio: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  calendario: <><rect x="3" y="4.5" width="18" height="16.5" rx="2.5" /><path d="M16 2.5v4M8 2.5v4M3 10h18" /></>,
  sala: <><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="3.75" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="3.75" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></>,
  usuarios: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  usuario: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  carta: <path d="M4 2.5v6.5a2.5 2.5 0 0 0 2.5 2.5h1A2.5 2.5 0 0 0 10 9V2.5M7 2.5V22M20 15V2.5a5 5 0 0 0-4.5 5V13a2 2 0 0 0 2 2zm0 0v7" />,
  megafono: <><path d="m3 11 18-5v12L3 14z" /><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" /></>,
  rayo: <path d="M13 2 3 14h9l-1 8 10-12h-9z" />,
  lupa: <><circle cx="11" cy="11" r="7.5" /><path d="m21 21-4.6-4.6" /></>,
  campana: <><path d="M6 8.5a6 6 0 0 1 12 0c0 6.5 3 8.5 3 8.5H3s3-2 3-8.5" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></>,
  reloj: <><circle cx="12" cy="12" r="9.5" /><path d="M12 6.5V12l3.8 2" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
  estrella: <path className="lleno" d="m12 2.5 2.94 5.96 6.56.96-4.75 4.63 1.12 6.55L12 17.52 6.13 20.6l1.12-6.55L2.5 9.42l6.56-.96z" />,
  visto: <path d="M20 6.5 9 17.5l-5-5" />,
  doble: <path d="m1.5 12.5 4.5 4.5L15.5 7M10.5 16l1.5 1L21.5 7.5" />,
  abajo: <path d="m6 9 6 6 6-6" />,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  mas: <path d="M12 5v14M5 12h14" />,
  mensaje: <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" />,
  correo: <><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="m21.5 7.5-9.5 6-9.5-6" /></>,
  movil: <><rect x="6" y="2.5" width="12" height="19" rx="2.5" /><path d="M11 18.5h2" /></>,
  regalo: <><path d="M20 12v9.5H4V12M2.5 7.5h19V12h-19zM12 21.5v-14" /><path d="M12 7.5H7.8a2.5 2.5 0 1 1 0-5C11 2.5 12 7.5 12 7.5zm0 0h4.2a2.5 2.5 0 1 0 0-5C13 2.5 12 7.5 12 7.5z" /></>,
  repetir: <><path d="m17 1.5 4 4-4 4" /><path d="M3 11.5v-2a4 4 0 0 1 4-4h14M7 22.5l-4-4 4-4" /><path d="M21 12.5v2a4 4 0 0 1-4 4H3" /></>,
  enviar: <><path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" /></>,
  aviso: <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4.5M12 17.3h.01" />,
  sube: <><path d="m22.5 6.5-9 9-5-5L1.5 17.5" /><path d="M16.5 6.5h6v6" /></>,
  editar: <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  hoja: <><path d="M4 20c0-9 5-15 16-16-1 11-7 16-16 16z" /><path d="M4 20 13 11" /></>,
  tarta: <><path d="M3 20.5h18M4.5 20.5v-6.5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v6.5M12 12V8.5" /><path d="M12 3.5c1.2 1.3 1.6 2.2 1.6 3a1.6 1.6 0 0 1-3.2 0c0-.8.4-1.7 1.6-3z" /></>,
  filtro: <path d="M21.5 4h-19l7.6 9v6.2l3.8 1.8v-8z" />,
  ruta: <><circle cx="6" cy="18.5" r="2.5" /><circle cx="18" cy="5.5" r="2.5" /><path d="M8.5 18.5H15a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h6.5" /></>,
} satisfies Record<string, ReactNode>

export type NombreIcono = keyof typeof TRAZOS

export function Ico({ n, className = '' }: { n: NombreIcono; className?: string }) {
  return (
    <svg className={`ol-ico${className ? ` ${className}` : ''}`} viewBox="0 0 24 24" aria-hidden="true">
      {TRAZOS[n]}
    </svg>
  )
}
