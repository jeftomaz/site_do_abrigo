import { Link } from 'react-router-dom'
import { Button } from '../../../../shared/ui/Button'

export default function AdocaoSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Adote um amigo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Temos cães de todos os portes esperando por um lar. Conheça os animais
            disponíveis para adoção e encontre seu novo companheiro.
          </p>
          <Link to="/adocao">
            <Button variant="primary">Ver cães disponíveis</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
