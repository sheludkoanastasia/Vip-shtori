import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Fabric from './components/Fabric'
import Portfolio from './components/Portfolio'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Fabric />
        <Portfolio />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
