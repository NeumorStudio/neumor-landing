import { N_FORMA } from "./n-forma";

// En línea y no como imagen: la n toma el color del texto, así que vale para los
// dos temas sin cargar dos archivos, y no parpadea al entrar en la página.
// Va a una tinta (MARCA.md). El punto lleva su propia clase para poder animarlo
// o darle color en un momento concreto sin tocar la n.
export function LogoN({ className }: { className?: string }) {
  return (
    <svg viewBox={N_FORMA.vista} className={className} aria-hidden="true">
      <path d={N_FORMA.n} fill="currentColor" />
      <circle
        className="logo-n-punto"
        cx={N_FORMA.punto.cx}
        cy={N_FORMA.punto.cy}
        r={N_FORMA.punto.r}
        fill="currentColor"
      />
    </svg>
  );
}
