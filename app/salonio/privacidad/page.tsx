import type { Metadata } from 'next'
import { Navbar } from '@/components/ui/Navbar'
import { NeumorfSection } from '@/components/ui/NeumorfSection'
import { NeumorfCard } from '@/components/ui/NeumorfCard'
import { dato, salonioLegal } from '@/lib/content/salonio-legal'

export const metadata: Metadata = {
  title: 'Política de privacidad de Salonio | NeumorStudio',
  description: 'Qué datos trata la app Salonio, para qué, durante cuánto tiempo y cómo ejercer tus derechos.',
}

const { operador } = salonioLegal

export default function PrivacidadSalonio() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-[var(--background)]">
        <NeumorfSection>
          <NeumorfCard className="max-w-3xl mx-auto space-y-6 text-slate-800 dark:text-slate-200">
            <h1 className="text-3xl font-bold text-center">Política de privacidad — Salonio</h1>
            <p className="text-sm text-center opacity-70">Última actualización: {salonioLegal.actualizado}</p>

            <p>
              Salonio es una aplicación para pedir cita en peluquerías, salones de uñas y negocios
              similares. Esta política explica qué datos trata, para qué y qué derechos tienes. Está escrita
              para que se entienda, sin letra pequeña.
            </p>

            <div>
              <h2 className="text-xl font-semibold mb-3">1. Quién es el responsable</h2>
              <p className="mb-2">En Salonio hay dos tipos de datos, y cada uno tiene su responsable:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Los datos de tu cuenta</strong> (correo, nombre y teléfono si decides guardarlos):
                  el responsable es NeumorStudio.
                </li>
                <li>
                  <strong>Los datos de tus citas</strong> (nombre y teléfono de contacto, servicio, día y hora):
                  el responsable es <strong>el salón en el que reservas</strong>, que los usa para atenderte.
                  NeumorStudio los trata por cuenta del salón, como encargado del tratamiento, y solo para
                  prestarle el servicio.
                </li>
              </ul>
              <div className="mt-3 text-sm space-y-1">
                <p><strong>Titular:</strong> {dato(operador.titular)}</p>
                <p><strong>NIF:</strong> {dato(operador.nif)}</p>
                <p><strong>Domicilio:</strong> {dato(operador.domicilio)}</p>
                <p><strong>Contacto:</strong> {operador.email}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">2. Qué datos tratamos</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Para reservar:</strong> tu nombre, tu teléfono, el servicio, el día, la hora y el profesional elegidos.</li>
                <li><strong>Si creas una cuenta:</strong> tu correo electrónico y, si lo guardas, tu nombre y tu teléfono. Con ella
                  puedes ver tus citas desde otro móvil y que se rellenen tus datos al reservar.</li>
                <li><strong>Si entras con Google:</strong> tu nombre, tu correo y el identificador de tu cuenta de Google. No accedemos a tus
                  contactos, calendario ni a ningún otro dato de Google.</li>
                <li><strong>La lista de salones</strong> que has añadido, para que la tengas en cualquier móvil si usas cuenta.</li>
              </ul>
              <p className="mt-3">
                No usamos publicidad, no te seguimos con herramientas de analítica de terceros y no
                accedemos a tu ubicación. La cámara solo se usa, si tú lo pides, para leer el código QR de un
                salón: no guardamos ninguna imagen.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">3. Para qué los usamos y por qué podemos</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Gestionar tu cita y tu cuenta</strong> (reservar, mostrarte tus citas, cancelarlas, avisar
                  al salón). Base: es necesario para prestarte el servicio que pides (art. 6.1.b RGPD).
                </li>
                <li>
                  <strong>Seguridad y prevención de abusos</strong>, por ejemplo limitar el número de citas
                  pendientes por teléfono. Base: interés legítimo en proteger el servicio y a los salones
                  (art. 6.1.f RGPD).
                </li>
              </ul>
              <p className="mt-3">No tomamos decisiones automatizadas que te afecten ni elaboramos perfiles.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">4. Qué se guarda en tu móvil</h2>
              <p>
                La app guarda en el almacenamiento seguro de tu móvil los salones que has añadido, las claves de
                tus citas (para poder verlas y cancelarlas sin cuenta), tu nombre y teléfono para autocompletar
                y tu preferencia de tema claro u oscuro. Al cerrar sesión se quitan las citas y la lista de
                salones del móvil; al desinstalar la app, todo.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">5. Quién más ve tus datos</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>El salón</strong> donde reservas ve los datos de tu cita para atenderte.</li>
                <li>
                  <strong>InsForge</strong>, proveedor que aloja la base de datos y gestiona el acceso a tu cuenta
                  (incluido el envío del correo con el código de acceso). Los datos se alojan en su región de
                  Europa central.
                </li>
                <li>
                  <strong>Google</strong>, solo si eliges entrar con Google, para verificar tu identidad.
                </li>
              </ul>
              <p className="mt-3">
                No vendemos tus datos ni los cedemos para publicidad. Si algún proveedor tratara datos fuera del
                Espacio Económico Europeo, lo haría con las garantías que exige el RGPD (por ejemplo, cláusulas
                contractuales tipo).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">6. Inicio de sesión con Google</h2>
              <p>
                El uso y la transferencia a cualquier otra aplicación de la información que Salonio reciba de las
                APIs de Google se ajustará a la{' '}
                <a
                  className="underline"
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Política de Datos del Usuario de los Servicios de las APIs de Google
                </a>
                , incluidos los requisitos de uso limitado. Solo usamos tu nombre y tu correo para crear y
                mostrar tu cuenta.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">7. Cuánto tiempo los conservamos</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Tu cuenta:</strong> mientras la mantengas. Puedes eliminarla tú mismo en cualquier
                  momento desde la app (ver el apartado 8).
                </li>
                <li>
                  <strong>Tus citas:</strong> conservamos tu nombre y tu teléfono en cada cita durante{' '}
                  <strong>24 meses desde la fecha de la cita</strong>. Pasado ese plazo se anonimizan
                  automáticamente: se borran tu nombre, tu teléfono y el vínculo con tu cuenta, y la cita queda
                  solo como un registro de fecha, servicio y profesional, sin datos que te identifiquen, para
                  que el salón conserve su histórico.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">8. Tus derechos</h2>
              <p>
                Puedes pedir acceso a tus datos, que los rectifiquemos o los suprimamos, limitar su tratamiento,
                oponerte a él y recibirlos en un formato portable. Escríbenos a {operador.email} desde el correo
                de tu cuenta; si se trata de una cita concreta, también puedes dirigirte al salón. Si crees que no
                hemos atendido bien tu solicitud, puedes reclamar ante la Agencia Española de Protección de
                Datos (<a className="underline" href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>).
              </p>
              <p className="mt-3">
                <strong>Eliminar tu cuenta desde la app:</strong> entra en <em>Ajustes → Eliminar mi cuenta</em>.
                Al confirmar, se borra tu cuenta y tus salones guardados, se cancelan tus citas futuras y se
                eliminan el nombre y el teléfono de todas tus citas. No se puede deshacer. Si no tienes la app
                instalada, escríbenos a {operador.email} desde el correo de tu cuenta y la eliminamos por ti.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">9. Seguridad</h2>
              <p>
                Las comunicaciones van cifradas, cada usuario solo puede acceder a sus propios datos y las
                claves de acceso se guardan en el almacenamiento seguro del móvil. Ningún sistema es infalible:
                si ocurriera un incidente que te afecte, te lo comunicaremos como exige la ley.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">10. Menores</h2>
              <p>Salonio no está dirigida a menores de 14 años. Si crees que un menor nos ha facilitado datos, escríbenos y los eliminaremos.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-3">11. Cambios en esta política</h2>
              <p>Si cambiamos algo importante, lo avisaremos en la app y actualizaremos la fecha de arriba.</p>
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
