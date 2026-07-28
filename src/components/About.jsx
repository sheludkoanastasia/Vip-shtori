import { useReveal } from '../hooks/useReveal'

function About() {
  const { ref, className: revealClass } = useReveal()

  return (
    <section ref={ref} className={`about ${revealClass}`} id="about">
      <div className="about__inner container">
        <div className="about__left">
          <div className="about__stats reveal-child">
            <span className="about__stat-number">300 +</span>
            <p className="about__stat-text">заказов уже выполнены нами</p>
          </div>

          <h2 className="about__heading reveal-child">Как мы работаем?</h2>

          <div className="about__steps">
            <div className="about__step reveal-child">
              <span className="step__num" aria-hidden="true">
                01
              </span>
              <h3 className="step__title">Заявка</h3>
              <p className="step__desc">
                Оставьте заявку на сайте или позвоните нам
              </p>
            </div>

            <div className="about__step reveal-child">
              <span className="step__num" aria-hidden="true">
                02
              </span>
              <h3 className="step__title">Консультация</h3>
              <p className="step__desc">
                Мы приедем к вам с образцами и поможем с выбором
              </p>
            </div>

            <div className="about__step reveal-child">
              <span className="step__num" aria-hidden="true">
                03
              </span>
              <h3 className="step__title">Пошив</h3>
              <p className="step__desc">
                Индивидуальный пошив по вашим меркам
              </p>
            </div>

            <div className="about__step reveal-child">
              <span className="step__num" aria-hidden="true">
                04
              </span>
              <h3 className="step__title">Установка</h3>
              <p className="step__desc">
                Финальная примерка и установка штор
              </p>
            </div>
          </div>
        </div>

        <div className="about__gallery reveal-child" aria-hidden="true">
          <div className="about__gallery-grid">
            <img
              src="/images/LeftDecor.jpg"
              alt=""
              className="gallery-img"
            />
            <img
              src="/images/RightDecor.jpg"
              alt=""
              className="gallery-img"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
