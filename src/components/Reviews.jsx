import { useCallback, useState } from 'react'
import reviewPages from '../data/reviews'
import { useSwipe } from '../hooks/useSwipe'
import { useReveal } from '../hooks/useReveal'

function Reviews() {
  const [page, setPage] = useState(0)
  const [direction, setDirection] = useState('next')
  const total = reviewPages.length
  const { ref: revealRef, className: revealClass } = useReveal()

  const goTo = useCallback(
    (nextPage) => {
      if (nextPage === page) return

      const isNextWrap = page === total - 1 && nextPage === 0
      const isPrevWrap = page === 0 && nextPage === total - 1
      const forward = isNextWrap || (!isPrevWrap && nextPage > page)

      setDirection(forward ? 'next' : 'prev')
      setPage(nextPage)
    },
    [page, total],
  )

  const showPrev = useCallback(() => {
    setDirection('prev')
    setPage((current) => (current - 1 + total) % total)
  }, [total])

  const showNext = useCallback(() => {
    setDirection('next')
    setPage((current) => (current + 1) % total)
  }, [total])

  const swipeHandlers = useSwipe({
    onSwipeLeft: showNext,
    onSwipeRight: showPrev,
  })

  return (
    <section ref={revealRef} className={`reviews ${revealClass}`} id="reviews">
      <div className="container">
        <h2 className="section-title reveal-child">Отзывы клиентов</h2>

        <div className="reviews__viewport reveal-child" {...swipeHandlers}>
          {reviewPages.map((reviews, pageIndex) => {
            const isActive = pageIndex === page

            return (
              <div
                key={isActive ? `active-${pageIndex}-${direction}` : `page-${pageIndex}`}
                className={[
                  'reviews__page',
                  isActive ? 'reviews__page--active' : '',
                  isActive ? `reviews__page--in-${direction}` : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                data-page={pageIndex}
                aria-hidden={!isActive}
              >
                <div className="reviews__grid">
                  {reviews.map((review) => (
                    <article
                      key={review.author}
                      className={`review-card review-card--${review.variant}`}
                    >
                      <p className="review-card__author">{review.author}</p>
                      <p className="review-card__text">{review.text}</p>
                    </article>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="reviews__dots reveal-child" role="tablist" aria-label="Страницы отзывов">
          {reviewPages.map((_, pageIndex) => {
            const isActive = pageIndex === page

            return (
              <button
                key={pageIndex}
                type="button"
                className={
                  isActive ? 'reviews__dot reviews__dot--active' : 'reviews__dot'
                }
                role="tab"
                aria-selected={isActive}
                aria-label={`Страница ${pageIndex + 1}`}
                onClick={() => goTo(pageIndex)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Reviews
