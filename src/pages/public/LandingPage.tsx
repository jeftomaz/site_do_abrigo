import Header from '../../shared/ui/Header'
import PageMeta from '../../shared/ui/PageMeta'
import DoacaoSection from './landing/sections/DoacaoSection'
import AdocaoSection from './landing/sections/AdocaoSection'
import HistoriasSection from './landing/sections/HistoriasSection'
import EventosSection from './landing/sections/EventosSection'

export default function LandingPage() {
  return (
    <>
      <PageMeta
        title="Adoção de cães e arrecadação"
        description="Apoie o abrigo, conheça cães para adoção, leia histórias felizes e participe de eventos de arrecadação."
        path="/"
      />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <DoacaoSection />
        <AdocaoSection />
        <HistoriasSection />
        <EventosSection />
      </main>
    </>
  )
}
