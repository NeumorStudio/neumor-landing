import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { NeumorfSection } from '@/components/ui/NeumorfSection'
import { NeumorfCard } from '@/components/ui/NeumorfCard'
import { dato, salonioLegal } from '@/lib/content/salonio-legal'

export const metadata: Metadata = {
  title: 'Condiciones del servicio de Salonio | NeumorStudio',
  description: 'Las reglas de uso de la app Salonio para pedir cita en peluquerías y salones.',
}

const { operador } = salonioLegal

export default function CondicionesSalonio() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-[var(--background)]">
        <NeumorfSection>
          <NeumorfCard className="max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-200">
            <h1 className="text-3xl font-bold text-center">Condiciones del servicio — Salonio</h1>
            <p className="text-sm text-center opacity-70">Última actualización: {salonioLegal.actualizado}</p>

            <p>
              Estas condiciones regulan el uso de la aplicación Salonio. Al usarla aceptas lo que sigue. Si
              no estás de acuerdo, no la uses.
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-3">1. Qué es Salonio</h2>
              <p>
                Salonio es una herramienta que te permite pedir cita en los salones que la utilizan y
                gestionar tus citas. <strong>Los servicios (el corte, la manicura…) los presta el salón</strong>,
                no Salonio. La relación sobre el servicio, su precio y su prestación es entre tú y el salón.
                Salonio no gestiona pagos: si el salón cobra, lo hace en el local o por sus propios medios.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">2. Quién ofrece la aplicación</h2>
              <div className="text-sm space-y-1">
                <p><strong>Titular:</strong> {dato(operador.titular)}</p>
                <p><strong>NIF:</strong> {dato(operador.nif)}</p>
                <p><strong>Domicilio:</strong> {dato(operador.domicilio)}</p>
                <p><strong>Contacto:</strong> {operador.email}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">3. Tu cuenta</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Puedes reservar sin cuenta. Crear una es opcional y sirve para ver tus citas en otro móvil.</li>
                <li>Los datos que facilites deben ser verdaderos, y el teléfono, uno al que puedas responder.</li>
                <li>Eres responsable de tu acceso. Si crees que alguien ha entrado en tu cuenta, avísanos.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">4. Reservas y cancelaciones</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Las horas disponibles las define cada salón. La cita queda confirmada cuando la app te lo muestra.</li>
                <li>Puedes cancelar tus citas futuras desde la app. Cada salón puede tener sus propias normas sobre
                  cancelaciones y asistencia, que te explicará directamente.</li>
                <li>El salón puede cancelar o mover una cita por causas justificadas y se pondrá en contacto contigo.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">5. Uso correcto</h2>
              <p className="mb-2">No está permitido:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Reservar con datos falsos o a nombre de otra persona sin que lo sepa, o acaparar horas sin intención de acudir.</li>
                <li>Automatizar reservas, sobrecargar el servicio o intentar acceder a datos de otros usuarios o salones.</li>
                <li>Usar la aplicación para fines ilegales o para molestar a otros.</li>
              </ul>
              <p className="mt-3">
                Podemos limitar o suspender el acceso, y los salones pueden dejar de aceptarte reservas, si se
                hace un uso abusivo. Por seguridad hay un límite de citas pendientes por teléfono en cada salón.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">6. Disponibilidad</h2>
              <p>
                Procuramos que Salonio funcione siempre, pero no podemos garantizar que no haya interrupciones
                por mantenimiento, fallos o causas ajenas. Si la app no está disponible, ponte en contacto
                con el salón por sus medios habituales.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">7. Responsabilidad</h2>
              <p>
                Salonio no responde de cómo el salón presta su servicio ni de los cambios de horario que este
                haga. En la medida que permite la ley, no respondemos de daños indirectos derivados del uso de la
                aplicación. Nada de esto limita los derechos que como consumidor te reconoce la normativa.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">8. Tus datos</h2>
              <p>
                El tratamiento de tus datos personales se explica en nuestra{' '}
                <a className="underline" href="/salonio/privacidad">política de privacidad</a>.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">9. Propiedad intelectual</h2>
              <p>
                La aplicación, su diseño y su código son de NeumorStudio. Los nombres, logotipos y fotos de cada
                salón son de sus titulares y se muestran con su autorización.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">10. Cambios en estas condiciones</h2>
              <p>
                Podemos actualizarlas. Si el cambio es importante te lo avisaremos en la app, y seguir
                usándola después supone aceptarlo.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">11. Ley aplicable</h2>
              <p>
                Estas condiciones se rigen por la ley española. Si eres consumidor, podrás acudir a los
                tribunales de tu domicilio.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-300 dark:border-slate-700">
              <h2 className="text-lg font-semibold mb-1">Contacto</h2>
              <p className="text-sm">{operador.email}</p>
            </div>
          </NeumorfCard>
        </NeumorfSection>
      </main>
    </>
  )
}
