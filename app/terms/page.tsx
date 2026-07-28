import { Navbar } from "@/components/ui/Navbar";
import { NeumorfSection } from "@/components/ui/NeumorfSection";
import { NeumorfCard } from "@/components/ui/NeumorfCard";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-[var(--background)]">
        <NeumorfSection>
          <NeumorfCard className="max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-200">
            <h1 className="text-3xl font-bold mb-6 text-center">Términos del Servicio — NeumorStudio</h1>

            <p>
              NeumorStudio ofrece herramientas de automatización, gestión de contenido y servicios de
              integración con plataformas de Meta (Instagram y Facebook). Al utilizar nuestro servicio,
              aceptas los siguientes términos.
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-3">Uso del servicio</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>El usuario deberá conectar su cuenta de Instagram o Facebook voluntariamente.</li>
                <li>NeumorStudio actuará únicamente bajo los permisos otorgados.</li>
                <li>Está prohibido usar la plataforma para spam, actividades ilegales o violaciones de políticas de Meta.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Conexión con Meta</h2>
              <p>
                Para funcionar correctamente, nuestro sistema requiere permisos específicos como
                administrar mensajes, gestionar comentarios y publicar contenido en nombre del usuario.
                El usuario puede revocar estos permisos en cualquier momento desde su cuenta de Facebook.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Responsabilidades</h2>
              <p>No somos responsables de suspensiones o restricciones aplicadas por Meta debido a mal uso del cliente.</p>
            </div>

            <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-1">Contacto</h2>
              <p className="text-sm">info@neumorstudio.com</p>
            </div>
          </NeumorfCard>
        </NeumorfSection>
      </main>
    </>
  );
}