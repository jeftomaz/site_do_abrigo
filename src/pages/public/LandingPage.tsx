import Header from '../../shared/ui/Header'
import DoacaoSection from './landing/sections/DoacaoSection'
import AdocaoSection from './landing/sections/AdocaoSection'
import HistoriasSection from './landing/sections/HistoriasSection'
import EventosSection from './landing/sections/EventosSection'

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <DoacaoSection />
        <AdocaoSection />
        <HistoriasSection />
        <EventosSection />
      </main>
    </>
  )
}
