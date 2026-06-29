import { Link } from 'react-router-dom'
import { Button } from '../../../../shared/ui/Button'

export default function HistoriasSection() {
  return (
    <section id="historias" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Histórias de superação
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Cada animal que passa pelo abrigo carrega uma história. Conheça os
            cães que encontraram um lar e as pessoas que mudaram suas vidas.
          </p>
          <Link to="/historias">
            <Button variant="secondary">Ver histórias</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
