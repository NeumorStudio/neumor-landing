import { Navbar } from "@/components/ui/Navbar";
import { NeumorfSection } from "@/components/ui/NeumorfSection";
import { NeumorfCard } from "@/components/ui/NeumorfCard";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-[var(--background)]">
        <NeumorfSection>
          <NeumorfCard className="max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-200">
            <h1 className="text-3xl font-bold mb-6 text-center">Política de Privacidad — NeumorStudio</h1>

            <p>
              En NeumorStudio nos tomamos muy en serio la privacidad de nuestros usuarios y clientes.
              Esta política explica cómo recopilamos, usamos y protegemos la información cuando se utiliza
              nuestra plataforma o cuando se conectan cuentas de Facebook, Instagram u otros servicios de Meta.
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-3">Información que recopilamos</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Datos necesarios para la autenticación mediante Meta (ID de usuario, nombre y foto pública).</li>
                <li>Permisos otorgados por el usuario para administrar contenido, leer comentarios, publicar
                  en Instagram o gestionar páginas de Facebook.</li>
                <li>Datos proporcionados voluntariamente en nuestra plataforma (correo, nombre del negocio, etc.).</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Cómo usamos la información</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Automatizar respuestas en Instagram y Facebook según la configuración del cliente.</li>
                <li>Gestionar contenido, publicar publicaciones y administrar interacciones.</li>
                <li>Proveer funcionalidades contractuales del servicio NeumorStudio.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Compartición de datos</h2>
              <p>No compartimos información con terceros. La información solo se usa dentro de NeumorStudio
                para prestar los servicios contratados.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Seguridad</h2>
              <p>Aplicamos medidas técnicas y organizativas para proteger los datos, incluyendo encriptación y accesos restringidos.</p>
            </div>

            <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
              <p className="text-sm">Si tienes dudas, puedes contactarnos en: info@neumorstudio.com</p>
            </div>
          </NeumorfCard>
        </NeumorfSection>
      </main>
    </>
  );
}