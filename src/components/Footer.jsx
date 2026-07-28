import { useReveal } from '../hooks/useReveal'

function Footer() {
  const { ref, className: revealClass } = useReveal()

  return (
    <footer ref={ref} className={`footer ${revealClass}`} id="contacts">
      <div className="footer__inner container">
        <div className="footer__info reveal-child">
          <h2 className="footer__title">Связаться с нами</h2>
          <p className="footer__schedule">Звонки с 10:00 до 20:00 (г. Краснодар)</p>
          <a href="tel:+79686557438" className="footer__phone">
            +7(968)655-74-38
          </a>
        </div>

        <div className="footer__developer reveal-child">
          <span>Разработчик:</span>
          <a
            href="https://github.com/sheludkoanastasia"
            className="footer__developer-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub разработчика"
          >
            <img src="/images/github.svg" alt="GitHub" />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
