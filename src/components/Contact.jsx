import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import LeadModal from './LeadModal'

function Contact() {
  const { ref, className: revealClass } = useReveal()
  const [status, setStatus] = useState('idle')
  const [errorText, setErrorText] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (status === 'loading') return

    const form = event.currentTarget
    const formData = new FormData(form)

    const payload = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      company: formData.get('company'),
    }

    setStatus('loading')
    setErrorText('')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Не удалось отправить заявку')
      }

      form.reset()
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setErrorText(
        error.message ||
          'Сервис временно недоступен. Попробуйте позже или позвоните нам.',
      )
    }
  }

  function closeModal() {
    setStatus('idle')
    setErrorText('')
  }

  return (
    <section ref={ref} className={`contact ${revealClass}`} id="contact">
      <div className="container">
        <h2 className="section-title reveal-child">Оставить заявку</h2>

        <form className="contact__form reveal-child" onSubmit={handleSubmit}>
          <input
            type="text"
            name="company"
            className="contact__honeypot"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="contact__fields">
            <input
              type="text"
              name="name"
              className="contact__input"
              placeholder="Введите имя..."
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              disabled={status === 'loading'}
            />
            <input
              type="tel"
              name="phone"
              className="contact__input"
              placeholder="Введите номер телефона..."
              required
              maxLength={32}
              autoComplete="tel"
              disabled={status === 'loading'}
            />
          </div>

          <button type="submit" className="btn" disabled={status === 'loading'}>
            {status === 'loading' ? 'Отправляем...' : 'Отправить заявку'}
          </button>

          {status === 'error' && (
            <p className="contact__error" role="alert">
              {errorText}
            </p>
          )}
        </form>
      </div>

      {status === 'success' && (
        <LeadModal
          title="Заявка принята"
          text="Спасибо! Мы свяжемся с вами в ближайшее время."
          onClose={closeModal}
        />
      )}
    </section>
  )
}

export default Contact
