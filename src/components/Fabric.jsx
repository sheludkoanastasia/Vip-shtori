import { useReveal } from '../hooks/useReveal'

function Fabric() {
  const { ref, className: revealClass } = useReveal()

  return (
    <section
      ref={ref}
      className={`fabric container ${revealClass}`}
      id="fabric"
      aria-label="Подбор ткани"
    >
      <div className="fabric__main">
        <img src="/images/fabric.png" alt="" className="fabric__bg-image" />

        <div className="fabric__overlay">
          <h2 className="fabric__title">
            Подберем ткань
            <br />
            согласно вашим желаниям
          </h2>
        </div>

        <p className="fabric__desc">
          Широкий выбор ткани разных сегментов
          <br />
          от проверенных производителей
        </p>
      </div>
    </section>
  )
}

export default Fabric
