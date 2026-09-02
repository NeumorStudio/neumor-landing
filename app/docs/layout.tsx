import type { Metadata } from "next";
import { DocsShell } from "./DocsShell";

/**
 * `/docs` no se indexa.
 *
 * Describe una arquitectura que ya no existe —plantillas por sector, Astro,
 * n8n, integración con Meta— y que además contradice la regla de marca de no
 * contar con qué herramientas trabajamos. Que salga en una búsqueda de marca
 * es peor que no tenerla: dice que somos otra cosa distinta a la que dice la
 * portada.
 *
 * Va `noindex` y NO `disallow` en robots. Es a propósito: bloquear el rastreo
 * dejaría a Google sin poder leer esta etiqueta, y una URL bloqueada puede
 * seguir apareciendo indexada. Primero se lee el noindex y sale del índice;
 * el disallow solo tendría sentido después, y para entonces sobra.
 */
export const metadata: Metadata = {
  title: "Documentación | NeumorStudio",
  robots: { index: false, follow: false },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
