function Hero() {
  return (
    <section className="hero" id="hero" aria-label="Главный экран">
      <div className="hero__content container">
        <h1 className="hero__title">Идеальные шторы для вашего интерьера</h1>
        <p className="hero__subtitle">
          индивидуальный пошив, отбор тканей и безупречное качество
        </p>
        <a href="#contact" className="btn hero__btn">
          Оставить заявку
        </a>
      </div>
    </section>
  )
}

export default Hero
