import { useRef } from 'react'

function Header() {
  const navToggleRef = useRef(null)

  function closeMenu() {
    if (navToggleRef.current) {
      navToggleRef.current.checked = false
    }
  }

  return (
    <header className="header">
      <nav className="nav container" aria-label="Основная навигация">
        <a href="#about" className="nav__brand">
          О нас
        </a>

        <input
          type="checkbox"
          id="nav-toggle"
          className="nav__toggle"
          aria-hidden="true"
          ref={navToggleRef}
        />
        <label htmlFor="nav-toggle" className="nav__burger" aria-label="Открыть меню">
          <img
            src="/images/menu-burger.svg"
            alt=""
            className="nav__burger-icon"
          />
        </label>

        <ul className="nav__list">
          <li className="nav__item--about">
            <a href="#about" className="nav__link" onClick={closeMenu}>
              О нас
            </a>
          </li>
          <li>
            <a href="#portfolio" className="nav__link" onClick={closeMenu}>
              Портфолио
            </a>
          </li>
          <li>
            <a href="#reviews" className="nav__link" onClick={closeMenu}>
              Отзывы
            </a>
          </li>
          <li>
            <a href="#contacts" className="nav__link" onClick={closeMenu}>
              Контакты
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
