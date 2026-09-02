'use client'

import { useEffect, useRef, useState } from 'react'
import { crearLead } from '@/app/actions/leads'

export function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    tipo_negocio: '',
    mensaje: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const confirmacion = useRef<HTMLHeadingElement>(null)

  /**
   * Al enviarse bien, el formulario entero se desmonta y en su sitio aparece la
   * confirmación. El foco estaba en el botón de enviar, que ya no existe, así
   * que se caía al `body`: quien navega con teclado o lector de pantalla se
   * quedaba sin saber ni dónde está ni que se ha enviado nada. Se lleva el foco
   * al titular de la confirmación.
   */
  useEffect(() => {
    if (status === 'success') confirmacion.current?.focus()
  }, [status])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const result = await crearLead(formData)

    if (result.success) {
      setStatus('success')
      setFormData({ nombre: '', email: '', tipo_negocio: '', mensaje: '' })
    } else {
      setStatus('error')
      setErrorMsg(result.error || 'Error al enviar el formulario')
    }
  }

  if (status === 'success') {
    return (
      <div className="ng-card p-8 text-center" role="status" aria-live="polite">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full
                      bg-emerald-500/10 dark:bg-emerald-500/20
                      flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3
          ref={confirmacion}
          tabIndex={-1}
          className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100 focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-4"
        >
          Consulta recibida
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Te responderemos en menos de 24 horas con una propuesta detallada.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="ng-raised mt-6 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
        >
          Enviar otra consulta
        </button>
      </div>
    )
  }

  return (
    <div className="ng-card p-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 ml-1">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="ng-input"
            placeholder="Nombre y apellidos"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 ml-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="ng-input"
            placeholder="nombre@empresa.com"
          />
        </div>

        <div>
          <label htmlFor="tipo_negocio" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 ml-1">
            Tipo de negocio
          </label>
          <input
            type="text"
            id="tipo_negocio"
            name="tipo_negocio"
            value={formData.tipo_negocio}
            onChange={handleChange}
            required
            className="ng-input"
            placeholder="Restaurante, clínica, comercio..."
          />
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 ml-1">
            Descripción del proyecto
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            rows={3}
            className="ng-input resize-none"
            placeholder="Describe brevemente qué necesitas y tus objetivos"
          />
        </div>

        {status === 'error' && (
          <p role="alert" className="text-red-600 dark:text-red-400 text-sm px-1">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="ng-btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar consulta'}
        </button>
      </form>
    </div>
  )
}
