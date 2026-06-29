import { Link } from 'react-router-dom'
import { Button } from '../../../../shared/ui/Button'

export default function EventosSection() {
  return (
    <section id="eventos" className="py-20 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recãopensa
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Participe da nossa rifa solidária e concorra a prêmios enquanto ajuda
            os animais do abrigo. Confira o evento atual e garanta sua cota.
          </p>
          <Link to="/eventos">
            <Button variant="secondary">Ver evento atual</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
