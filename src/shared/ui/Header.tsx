import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../app/theme'

const NAV_LINKS = [
  { label: 'Doação', href: '/#doacao' },
  { label: 'Adoção', href: '/adocao' },
  { label: 'Histórias', href: '/#historias' },
  { label: 'Eventos', href: '/#eventos' },
] as const

export default function Header() {
  const { theme, toggleTheme } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  function handleNavClick(href: string) {
    setMenuOpen(false)
    if (href.startsWith('/#') && location.pathname === '/') {
      const id = href.slice(2)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-gray-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:bg-gray-900 dark:focus:text-gray-100"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <Link
          to="/"
          className="min-w-0 truncate rounded-sm font-semibold text-gray-900 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-100 dark:focus-visible:ring-offset-gray-900"
        >
          Abrigo
        </Link>

        <nav aria-label="Menu principal" className="hidden items-center gap-6 sm:flex">
          {NAV_LINKS.map(link => (
            <NavItem key={link.href} link={link} onClick={handleNavClick} />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="flex h-10 w-10 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>

          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 sm:hidden"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Menu mobile"
          className="flex flex-col gap-1 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900 sm:hidden"
        >
          {NAV_LINKS.map(link => (
            <NavItem key={link.href} link={link} onClick={handleNavClick} mobile />
          ))}
        </nav>
      )}
    </header>
  )
}

interface NavItemProps {
  link: { label: string; href: string }
  onClick: (href: string) => void
  mobile?: boolean
}

function NavItem({ link, onClick, mobile }: NavItemProps) {
  const base = 'rounded-sm text-sm text-gray-600 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-300 dark:hover:text-gray-100 dark:focus-visible:ring-offset-gray-900'
  const mobileClass = mobile
    ? 'flex min-h-10 items-center rounded-md px-2 hover:bg-gray-100 dark:hover:bg-gray-800'
    : ''

  if (link.href.startsWith('/') && !link.href.startsWith('/#')) {
    return (
      <Link to={link.href} className={`${base} ${mobileClass}`} onClick={() => onClick(link.href)}>
        {link.label}
      </Link>
    )
  }

  return (
    <a href={link.href} className={`${base} ${mobileClass}`} onClick={() => onClick(link.href)}>
      {link.label}
    </a>
  )
}
