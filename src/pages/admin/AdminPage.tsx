import { Link } from 'react-router-dom'
import { Card, CardHeader } from '../../shared/ui/Card'

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Painel Admin</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/admin/dogs" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">Adoção</h2>
            </CardHeader>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie os cães disponíveis.</p>
          </Card>
        </Link>
        <Link to="/admin/stories" className="block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">Histórias</h2>
            </CardHeader>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie histórias de adoção.</p>
          </Card>
        </Link>
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Eventos</h2>
          </CardHeader>
          <p className="text-sm text-gray-500 dark:text-gray-400">Gerencie rifas e produtos.</p>
        </Card>
      </div>
    </main>
  )
}
