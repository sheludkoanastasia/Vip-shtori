import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function LeadModal({ title, text, onClose }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return createPortal(
    <div
      className="lead-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-modal-title"
      onClick={onClose}
    >
      <div
        className="lead-modal__card"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="lead-modal-title" className="lead-modal__title">
          {title}
        </h3>
        <p className="lead-modal__text">{text}</p>
        <button type="button" className="btn lead-modal__btn" onClick={onClose}>
          Хорошо
        </button>
      </div>
    </div>,
    document.body,
  )
}

export default LeadModal
