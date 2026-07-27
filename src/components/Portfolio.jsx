import { useCallback, useState } from 'react'
import portfolioSlides from '../data/portfolio'
import { useSwipe } from '../hooks/useSwipe'
import { useReveal } from '../hooks/useReveal'

function Portfolio() {
  const [index, setIndex] = useState(0)
  const total = portfolioSlides.length
  const { ref: revealRef, className: revealClass } = useReveal()

  const showPrev = useCallback(() => {
    setIndex((current) => (current - 1 + total) % total)
  }, [total])

  const showNext = useCallback(() => {
    setIndex((current) => (current + 1) % total)
  }, [total])

  const swipeHandlers = useSwipe({
    onSwipeLeft: showNext,
    onSwipeRight: showPrev,
  })

  return (
    <section
      ref={revealRef}
      className={`portfolio ${revealClass}`}
      id="portfolio"
      aria-label="Портфолио"
      {...swipeHandlers}
    >
      <div className="portfolio__slides" aria-live="polite">
        {portfolioSlides.map((slide, slideIndex) => {
          const isActive = slideIndex === index

          return (
            <img
              key={slide.src}
              src={slide.src}
              alt={isActive ? slide.alt : ''}
              draggable={false}
              className={
                isActive
                  ? 'portfolio__bg portfolio__bg--active'
                  : 'portfolio__bg'
              }
            />
          )
        })}
      </div>

      <div className="portfolio__content reveal-child">
        <div className="container">
          <h2 className="portfolio__title">Наши работы</h2>
        </div>
      </div>

      <div className="portfolio__arrows reveal-child">
        <button
          type="button"
          className="portfolio__arrow"
          aria-label="Предыдущая работа"
          onClick={showPrev}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <img src="/images/arrowLeft.svg" alt="" draggable={false} />
        </button>
        <button
          type="button"
          className="portfolio__arrow"
          aria-label="Следующая работа"
          onClick={showNext}
          onPointerDown={(event) => event.stopPropagation()}
        >
          <img src="/images/arrowRight.svg" alt="" draggable={false} />
        </button>
      </div>
    </section>
  )
}

export default Portfolio
