import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { NeumorfSection } from '@/components/ui/NeumorfSection'
import { NeumorfCard } from '@/components/ui/NeumorfCard'
import { salonioLegal } from '@/lib/content/salonio-legal'

export const metadata: Metadata = {
  title: 'Eliminar tu cuenta de Salonio | NeumorStudio',
  description: 'Cómo eliminar tu cuenta de Salonio y tus datos personales, con o sin la app instalada.',
}

const { operador } = salonioLegal

export default function EliminarCuentaSalonio() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-[var(--background)]">
        <NeumorfSection>
          <NeumorfCard className="max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-200">
            <h1 className="text-3xl font-bold text-center">Eliminar tu cuenta de Salonio</h1>
            <p className="text-sm text-center opacity-70">Última actualización: {salonioLegal.actualizado}</p>

            <p>
              Puedes eliminar tu cuenta de Salonio y tus datos personales en cualquier momento. Hay dos formas,
              según tengas o no la app instalada.
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-3">Opción 1: desde la app</h2>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Abre Salonio y entra en la pestaña <strong>Ajustes</strong>.</li>
                <li>Pulsa <strong>Eliminar mi cuenta</strong>.</li>
                <li>Lee el aviso y confirma con <strong>Eliminar cuenta</strong>.</li>
              </ol>
              <p className="mt-3">Es inmediato y no se puede deshacer.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Opción 2: sin la app</h2>
              <p>
                Escríbenos a <a className="underline" href={`mailto:${operador.email}?subject=Eliminar%20mi%20cuenta%20de%20Salonio`}>{operador.email}</a>{' '}
                <strong>desde el correo con el que creaste la cuenta</strong>, con el asunto «Eliminar mi cuenta de
                Salonio». La eliminaremos y te lo confirmaremos por correo, como máximo en un mes.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Qué se elimina</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Tu cuenta: correo, nombre y teléfono guardados en ella, y tu acceso con Google si lo usabas.</li>
                <li>Los salones que tenías guardados.</li>
                <li>Tus citas futuras se cancelan.</li>
                <li>El nombre y el teléfono de <strong>todas</strong> tus citas se borran; la cita queda solo como un
                  registro de fecha, servicio y profesional, sin datos que te identifiquen.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">Qué no se puede eliminar</h2>
              <p>
                Si eres propietario de un salón, primero hay que traspasarlo o cerrarlo: escríbenos y lo gestionamos
                contigo. Y si pides la baja de un dato concreto de una cita, también puedes dirigirte al salón, que
                es el responsable de esos datos.
              </p>
            </div>

            <p className="text-sm">
              Más información en la <a className="underline" href="/salonio/privacidad">política de privacidad</a>.
            </p>
          </NeumorfCard>
        </NeumorfSection>
      </main>
    </>
  )
}
