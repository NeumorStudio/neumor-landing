import { NS_TRAZADO } from "./ns-trazado";

// En línea y no como imagen: toma el color del texto, así que vale para los dos
// temas sin cargar dos archivos, y no parpadea al entrar en la página.
export function LogoNS({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 2820 2820" className={className} aria-hidden="true">
      <path fill="currentColor" fillRule="evenodd" d={NS_TRAZADO} />
    </svg>
  );
}
