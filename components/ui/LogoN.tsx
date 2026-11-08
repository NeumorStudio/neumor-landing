import { N_FORMA } from "./n-forma";

// En línea y no como imagen: el arco toma el color del texto, así que vale para
// los dos temas sin cargar dos archivos, y no parpadea al entrar en la página.
// El punto va en ámbar, un poco más oscuro en el tema claro (MARCA.md).
export function LogoN({ className }: { className?: string }) {
  return (
    <svg viewBox={N_FORMA.vista} className={className} aria-hidden="true">
      <path
        d={N_FORMA.arco}
        fill="none"
        stroke="currentColor"
        strokeWidth={N_FORMA.trazo}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="logo-n-punto" cx={N_FORMA.punto.cx} cy={N_FORMA.punto.cy} r={N_FORMA.punto.r} />
    </svg>
  );
}
